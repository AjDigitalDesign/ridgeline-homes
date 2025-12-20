"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  ChatMessage,
  ChatWidgetConfig,
  UseChatOptions,
  UseChatReturn,
} from "./types";

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
  const configFetchedRef = useRef(false);

  useEffect(() => {
    visitorIdRef.current = getVisitorId();
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
        const response = await fetch(`${API_URL}/api/public/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId,
            visitorId: visitorIdRef.current,
            message: content.trim(),
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

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
                      m.id === assistantMessage.id
                        ? { ...m, content: fullContent }
                        : m
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
    [tenantId, messages, isLoading, onLeadCaptured]
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
