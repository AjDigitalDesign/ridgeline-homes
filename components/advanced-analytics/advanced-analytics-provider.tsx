"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAnalytics, type AnalyticsEvent } from "@/hooks/use-analytics";

interface AdvancedAnalyticsContextValue {
  trackPageView: () => void;
  trackEvent: (event: AnalyticsEvent) => void;
  getVisitorId: () => string;
  getSessionId: () => string;
}

const AdvancedAnalyticsContext = createContext<AdvancedAnalyticsContextValue | null>(null);

interface AdvancedAnalyticsProviderProps {
  children: ReactNode;
}

export function AdvancedAnalyticsProvider({ children }: AdvancedAnalyticsProviderProps) {
  // Use the analytics hook for tracking (tenant ID handled server-side)
  const analytics = useAnalytics({});

  const contextValue: AdvancedAnalyticsContextValue = {
    trackPageView: analytics.trackPageView,
    trackEvent: analytics.trackEvent,
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
