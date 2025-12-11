"use client";

import { useEffect, useState } from "react";
import { Analytics } from "./analytics";
import type { Tenant } from "@/lib/api";

export function AnalyticsProvider() {
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    // Use local API proxy to avoid CORS issues
    fetch("/api/tenant")
      .then((res) => res.json())
      .then((data) => {
        console.log("Analytics - Tenant data:", {
          googleAnalyticsId: data.googleAnalyticsId,
          googleTagManagerId: data.googleTagManagerId,
        });
        setTenant(data);
      })
      .catch((error) => {
        console.error("Analytics - Failed to fetch tenant:", error);
      });
  }, []);

  if (!tenant) return null;

  // Check if any analytics ID exists
  if (!tenant.googleAnalyticsId && !tenant.googleTagManagerId) {
    console.log("Analytics - No analytics IDs configured");
    return null;
  }

  return (
    <Analytics
      googleAnalyticsId={tenant.googleAnalyticsId}
      googleTagManagerId={tenant.googleTagManagerId}
    />
  );
}
