"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  ChatMessage,
  ChatWidgetConfig,
  UseChatOptions,
  UseChatReturn,
} from "./types";

const SESSION_ID_KEY = "chat_session_id";
const VISITOR_ID_KEY = "chat_visitor_id";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return generateVisitorId();

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function getStoredSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

function storeSessionId(sessionId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
}

export function useChat({
  tenantId,
  onLeadCaptured,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ChatWidgetConfig>({
    welcomeMessage: "Hi! How can I help you find your perfect home today?",
    placeholderText: "Type your message...",
    headerTitle: "Chat with us",
    headerSubtitle: "We typically reply within minutes",
  });

  const visitorIdRef = useRef<string>("");
  const sessionIdRef = useRef<string | null>(null);
  const configFetchedRef = useRef(false);

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    sessionIdRef.current = getStoredSessionId();
  }, []);

  useEffect(() => {
    if (configFetchedRef.current || !tenantId) return;
    configFetchedRef.current = true;

    async function fetchConfig() {
      try {
        const response = await fetch(
          `${API_URL}/api/public/ai-chat/config?tenantId=${tenantId}`
        );
        if (response.ok) {
          const data = await response.json();
          setConfig((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch chat config:", error);
      }
    }

    fetchConfig();
  }, [tenantId]);

  const createSession = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/api/public/ai-chat/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId: visitorIdRef.current,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Session creation failed:", response.status, errorText);
        throw new Error("Failed to create session");
      }

      const data = await response.json();
      console.log("Session created:", data);
      const sessionId = data.sessionId || data.id;
      if (sessionId) {
        sessionIdRef.current = sessionId;
        storeSessionId(sessionId);
        return sessionId;
      }
      return null;
    } catch (error) {
      console.error("Failed to create chat session:", error);
      return null;
    }
  }, []);

  const handleResponse = useCallback(
    async (response: Response, messageId: string) => {
      const contentType = response.headers.get("content-type") || "";

      // Check if it's a streaming response (SSE)
      if (contentType.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response stream");
        }

        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);

                if (parsed.content) {
                  fullContent += parsed.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === messageId ? { ...m, content: fullContent } : m
                    )
                  );
                }

                if (parsed.inquiryId && onLeadCaptured) {
                  onLeadCaptured(parsed.inquiryId);
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } else {
        // Handle regular JSON response
        const data = await response.json();
        console.log("Received JSON response:", data);

        const content =
          data.response ||
          data.content ||
          data.message ||
          data.text ||
          data.reply ||
          "";

        if (content) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, content } : m
            )
          );
        }

        if (data.inquiryId && onLeadCaptured) {
          onLeadCaptured(data.inquiryId);
        }
      }
    },
    [onLeadCaptured]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // Ensure we have a session
        let sessionId = sessionIdRef.current;
        if (!sessionId) {
          sessionId = await createSession();
          if (!sessionId) {
            throw new Error("Failed to create session");
          }
        }

        console.log("Sending message with sessionId:", sessionId);
        const response = await fetch(`${API_URL}/api/public/ai-chat/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            content: content.trim(),
            message: content.trim(),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Message send failed:", response.status, errorText);

          // If session expired, try creating a new one
          if (response.status === 404) {
            sessionIdRef.current = null;
            localStorage.removeItem(SESSION_ID_KEY);
            const newSessionId = await createSession();
            if (newSessionId) {
              // Retry with new session
              const retryResponse = await fetch(
                `${API_URL}/api/public/ai-chat/message`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sessionId: newSessionId,
                    message: content.trim(),
                  }),
                }
              );
              if (!retryResponse.ok) {
                throw new Error("Failed to send message");
              }
              await handleResponse(retryResponse, assistantMessage.id);
              return;
            }
          }
          throw new Error("Failed to send message");
        }

        await handleResponse(response, assistantMessage.id);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content:
                    "I'm sorry, I'm having trouble connecting. Please try again later.",
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, createSession, handleResponse]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    messages,
    isLoading,
    isOpen,
    config,
    sendMessage,
    toggleChat,
    openChat,
    closeChat,
  };
}
