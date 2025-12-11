"use client";

import { useEffect, useState } from "react";
import { Analytics } from "./analytics";
import { fetchTenant, type Tenant } from "@/lib/api";

export function AnalyticsProvider() {
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    fetchTenant()
      .then((response) => setTenant(response.data))
      .catch(() => {
        // Silently fail - analytics are optional
      });
  }, []);

  if (!tenant) return null;

  return (
    <Analytics
      googleAnalyticsId={tenant.googleAnalyticsId}
      googleTagManagerId={tenant.googleTagManagerId}
    />
  );
}
