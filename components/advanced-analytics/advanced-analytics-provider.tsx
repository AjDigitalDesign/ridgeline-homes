"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analytics";

interface AdvancedAnalyticsContextValue {
  tenantId: string | null;
  trackPageView: () => void;
  getVisitorId: () => string;
  getSessionId: () => string;
}

const AdvancedAnalyticsContext = createContext<AdvancedAnalyticsContextValue | null>(null);

interface AdvancedAnalyticsProviderProps {
  children: ReactNode;
  tenantId?: string;
}

export function AdvancedAnalyticsProvider({ children, tenantId: propTenantId }: AdvancedAnalyticsProviderProps) {
  const [tenantId, setTenantId] = useState<string | null>(propTenantId || null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fetch tenant ID if not provided as prop
  useEffect(() => {
    if (propTenantId) {
      setTenantId(propTenantId);
      return;
    }

    // Fetch tenant data to get the tenant ID
    fetch("/api/tenant")
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setTenantId(data.id);
        }
      })
      .catch((error) => {
        console.error("Advanced Analytics - Failed to fetch tenant:", error);
      });
  }, [propTenantId]);

  // Use the analytics hook for tracking
  const analytics = useAnalytics({
    tenantId: tenantId || "",
  });

  const contextValue: AdvancedAnalyticsContextValue = {
    tenantId,
    trackPageView: analytics.trackPageView,
    getVisitorId: analytics.getVisitorId,
    getSessionId: analytics.getSessionId,
  };

  return (
    <AdvancedAnalyticsContext.Provider value={contextValue}>
      {children}
    </AdvancedAnalyticsContext.Provider>
  );
}

export function useAdvancedAnalytics() {
  const context = useContext(AdvancedAnalyticsContext);
  if (!context) {
    throw new Error("useAdvancedAnalytics must be used within AdvancedAnalyticsProvider");
  }
  return context;
}
