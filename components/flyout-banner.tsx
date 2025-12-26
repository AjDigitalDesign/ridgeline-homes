"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/components/providers/tenant-provider";
import type { FlyoutBanner } from "@/lib/api";

// Storage key for dismissed banners
const DISMISSED_BANNERS_KEY = "dismissedFlyoutBanners";

// Expiration time in milliseconds (5 minutes)
const DISMISSAL_EXPIRATION_MS = 5 * 60 * 1000;

// Type for stored dismissed banner with timestamp
interface DismissedBannerEntry {
  id: string;
  dismissedAt: number;
}

// Get dismissed banner IDs from localStorage (filtering out expired ones)
function getDismissedBanners(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(DISMISSED_BANNERS_KEY);
    if (!stored) return [];

    const entries: DismissedBannerEntry[] = JSON.parse(stored);
    const now = Date.now();

    // Filter out expired entries
    const validEntries = entries.filter(
      (entry) => now - entry.dismissedAt < DISMISSAL_EXPIRATION_MS
    );

    // Update storage if any entries were removed
    if (validEntries.length !== entries.length) {
      localStorage.setItem(DISMISSED_BANNERS_KEY, JSON.stringify(validEntries));
    }

    return validEntries.map((entry) => entry.id);
  } catch {
    return [];
  }
}

// Add banner ID to dismissed list with timestamp
function dismissBanner(bannerId: string) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(DISMISSED_BANNERS_KEY);
    const entries: DismissedBannerEntry[] = stored ? JSON.parse(stored) : [];

    // Check if already dismissed
    if (!entries.some((entry) => entry.id === bannerId)) {
      entries.push({
        id: bannerId,
        dismissedAt: Date.now(),
      });
      localStorage.setItem(DISMISSED_BANNERS_KEY, JSON.stringify(entries));
    }
  } catch {
    // Ignore storage errors
  }
}

// Check if a banner is within its active time window
function isBannerActive(banner: FlyoutBanner): boolean {
  if (!banner.enabled) return false;

  const now = new Date();

  // Check start time
  if (banner.startTime) {
    const startDate = new Date(banner.startTime);
    if (now < startDate) return false;
  }

  // Check end time
  if (banner.endTime) {
    const endDate = new Date(banner.endTime);
    if (now > endDate) return false;
  }

  return true;
}

// Get the first active, non-dismissed banner
function getActiveBanner(banners: FlyoutBanner[] | null): FlyoutBanner | null {
  if (!banners || banners.length === 0) return null;

  const dismissedIds = getDismissedBanners();

  for (const banner of banners) {
    if (isBannerActive(banner) && !dismissedIds.includes(banner.id)) {
      return banner;
    }
  }

  return null;
}

export function FlyoutBannerPopup() {
  const { tenant } = useTenant();
  const [activeBanner, setActiveBanner] = useState<FlyoutBanner | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Find active banner on mount and when tenant changes
  useEffect(() => {
    if (tenant?.flyoutBanners) {
      const banner = getActiveBanner(tenant.flyoutBanners);
      if (banner) {
        setActiveBanner(banner);
        // Small delay before showing popup for better UX
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [tenant?.flyoutBanners]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (activeBanner) {
      dismissBanner(activeBanner.id);
    }
  }, [activeBanner]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!activeBanner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-4xl lg:max-w-5xl xl:max-w-6xl p-0 overflow-hidden border-0 gap-0"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        {/* Visually hidden title for screen readers */}
        <DialogTitle className="sr-only">
          {activeBanner.name || activeBanner.title || "Promotional Banner"}
        </DialogTitle>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - Image */}
          {activeBanner.image && (
            <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] lg:min-h-[450px] xl:min-h-[500px]">
              <Image
                src={activeBanner.image}
                alt={activeBanner.name || activeBanner.title || "Promotional banner"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Right - Content */}
          <div className="relative flex flex-col justify-center p-8 md:p-10 lg:p-14 xl:p-16 bg-main-primary text-white">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Content */}
            <div className="space-y-4 lg:space-y-6">
              {/* Banner Title (Eyebrow) - uses name field */}
              {activeBanner.name && (
                <span className="inline-block text-main-secondary font-semibold text-sm uppercase tracking-[0.2em]">
                  {activeBanner.name}
                </span>
              )}

              {/* Main Title */}
              {activeBanner.title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif leading-tight">
                  {activeBanner.title}
                </h2>
              )}

              {/* Description */}
              {activeBanner.description && (
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
                  {activeBanner.description}
                </p>
              )}

              {/* CTA Button - uses ctaText for label and link for URL */}
              {activeBanner.ctaText && activeBanner.link && (
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 font-semibold rounded-full px-8 group"
                  >
                    <Link href={activeBanner.link} onClick={handleClose}>
                      {activeBanner.ctaText}
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FlyoutBannerPopup;
