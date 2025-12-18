"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Use local API route to avoid CORS issues
const ANALYTICS_ENDPOINT = "/api/analytics/track";
const VISITOR_ID_KEY = "fh_visitor_id";
const SESSION_ID_KEY = "fh_session_id";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface UseAnalyticsOptions {
  tenantId: string;
  entityId?: string;
  entitySlug?: string;
}

interface TrackingData {
  visitorId: string;
  sessionId: string;
  pageUrl: string;
  pageType: string;
  entityId?: string;
  entitySlug?: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  deviceType: string;
  browser: string;
  os: string;
  screenWidth: number;
  screenHeight: number;
  timeOnPage?: number;
  scrollDepth?: number;
}

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create visitor ID (persisted in localStorage)
function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Get or create session ID (30-min timeout in sessionStorage)
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  const stored = sessionStorage.getItem(SESSION_ID_KEY);
  if (stored) {
    const { id, timestamp } = JSON.parse(stored);
    if (Date.now() - timestamp < SESSION_TIMEOUT) {
      // Update timestamp to extend session
      sessionStorage.setItem(
        SESSION_ID_KEY,
        JSON.stringify({ id, timestamp: Date.now() })
      );
      return id;
    }
  }

  // Create new session
  const newId = generateId();
  sessionStorage.setItem(
    SESSION_ID_KEY,
    JSON.stringify({ id: newId, timestamp: Date.now() })
  );
  return newId;
}

// Detect page type from pathname
function detectPageType(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/communities") && pathname.split("/").length > 2)
    return "community";
  if (pathname === "/communities") return "communities";
  if (pathname.startsWith("/homes") && pathname.split("/").length > 2)
    return "home_detail";
  if (pathname === "/homes") return "homes";
  if (pathname.startsWith("/plans") && pathname.split("/").length > 2)
    return "floorplan";
  if (pathname === "/plans") return "floorplans";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/photos")) return "gallery";
  return "other";
}

// Parse user agent for device/browser/OS info
function parseUserAgent(): { deviceType: string; browser: string; os: string } {
  if (typeof window === "undefined") {
    return { deviceType: "unknown", browser: "unknown", os: "unknown" };
  }

  const ua = navigator.userAgent;

  // Device type
  let deviceType = "desktop";
  if (/Mobi|Android/i.test(ua)) deviceType = "mobile";
  else if (/Tablet|iPad/i.test(ua)) deviceType = "tablet";

  // Browser
  let browser = "unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  // OS
  let os = "unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad"))
    os = "iOS";

  return { deviceType, browser, os };
}

// Extract UTM parameters from URL
function getUtmParams(searchParams: URLSearchParams): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
} {
  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
  };
}

export function useAnalytics(options: UseAnalyticsOptions) {
  const { tenantId, entityId, entitySlug } = options;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const hasTrackedRef = useRef<boolean>(false);

  // Track page view
  const trackPageView = useCallback(
    async (additionalData?: Partial<TrackingData>) => {
      if (typeof window === "undefined" || !tenantId) return;

      const { deviceType, browser, os } = parseUserAgent();
      const utmParams = getUtmParams(searchParams);

      const data: TrackingData = {
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        pageUrl: window.location.href,
        pageType: detectPageType(pathname),
        entityId,
        entitySlug,
        referrer: document.referrer,
        ...utmParams,
        deviceType,
        browser,
        os,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        ...additionalData,
      };

      try {
        await fetch(ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    },
    [tenantId, pathname, searchParams, entityId, entitySlug]
  );

  // Track scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track page view on mount and send exit data on unmount
  useEffect(() => {
    if (hasTrackedRef.current) return;

    // Reset tracking state
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    hasTrackedRef.current = true;

    // Track page view
    trackPageView();

    // Send time on page and scroll depth when leaving
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      const scrollDepth = maxScrollRef.current;

      // Use sendBeacon for reliability
      if (navigator.sendBeacon && tenantId) {
        const data = {
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          pageUrl: window.location.href,
          timeOnPage,
          scrollDepth,
        };

        navigator.sendBeacon(
          ANALYTICS_ENDPOINT,
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      hasTrackedRef.current = false;
    };
  }, [pathname, trackPageView, tenantId]);

  return {
    trackPageView,
    getVisitorId,
    getSessionId: () => getSessionId(),
  };
}
