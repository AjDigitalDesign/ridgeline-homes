"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
  primaryColor?: string;
}

export function ChatMessage({ message, primaryColor }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "rounded-br-md text-white"
            : "rounded-bl-md bg-gray-100 text-gray-900"
        )}
        style={
          isUser
            ? { backgroundColor: primaryColor || "#2563eb" }
            : undefined
        }
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
