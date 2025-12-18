"use client";

import { useAnalytics } from "@/hooks/use-analytics";

interface PageTrackerProps {
  tenantId: string;
  entityId?: string;
  entitySlug?: string;
}

export function PageTracker({ tenantId, entityId, entitySlug }: PageTrackerProps) {
  // The hook handles all tracking automatically
  useAnalytics({
    tenantId,
    entityId,
    entitySlug,
  });

  // This component doesn't render anything
  return null;
}
