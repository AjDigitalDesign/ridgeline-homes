"use client";

import { useEffect, useState } from "react";
import { ChatWidget } from "./chat-widget";

export function ChatWidgetWrapper() {
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenantId() {
      try {
        // Use local API proxy to avoid CORS issues
        const response = await fetch("/api/tenant");
        if (response.ok) {
          const data = await response.json();
          setTenantId(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch tenant ID:", error);
      }
    }

    fetchTenantId();
  }, []);

  if (!tenantId) return null;

  return (
    <ChatWidget
      tenantId={tenantId}
      onLeadCaptured={(inquiryId) => {
        console.log("Lead captured:", inquiryId);
      }}
    />
  );
}
