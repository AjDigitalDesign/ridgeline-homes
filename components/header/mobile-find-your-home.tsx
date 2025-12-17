"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchNavigation, type NavigationState } from "@/lib/api";

interface MobileFindYourHomeProps {
  onClose: () => void;
}

export function MobileFindYourHome({ onClose }: MobileFindYourHomeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [navigationData, setNavigationData] = useState<NavigationState[]>([]);
  const [expandedState, setExpandedState] = useState<string | null>(null);

  useEffect(() => {
    async function loadNavigation() {
      if (!isOpen || navigationData.length > 0) return;

      setIsLoading(true);
      try {
        const response = await fetchNavigation({ previewLimit: 5, type: "communities" });
        setNavigationData(response.data.communities || []);
      } catch (error) {
        console.error("Failed to load navigation:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNavigation();
  }, [isOpen, navigationData.length]);

  return (
    <div className="border-b border-slate-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-base font-medium text-white"
      >
        Find Your Home
        <ChevronDown
          className={cn(
            "size-5 text-slate-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-5 animate-spin text-slate-400" />
            </div>
          ) : navigationData.length === 0 ? (
            <div className="py-4 pl-4 text-sm text-slate-400">
              No communities available
            </div>
          ) : (
            <>
              {/* Browse All Communities Link */}
              <Link
                href="/communities"
                onClick={onClose}
                className="flex items-center gap-2 py-2 pl-4 text-sm text-main-secondary font-medium transition-colors hover:text-amber-400"
              >
                <MapPin className="size-4" />
                Browse All Communities
              </Link>

              {/* States with expandable cities */}
              {navigationData.map((stateData) => (
                <div key={stateData.state}>
                  <button
                    onClick={() =>
                      setExpandedState(
                        expandedState === stateData.state ? null : stateData.state
                      )
                    }
                    className="flex w-full items-center justify-between py-2 pl-4 text-sm text-slate-300 transition-colors hover:text-amber-400"
                  >
                    <span className="flex items-center gap-2">
                      {stateData.state}
                      <span className="text-xs text-slate-500">
                        ({stateData.totalCommunities})
                      </span>
                    </span>
                    <ChevronRight
                      className={cn(
                        "size-4 text-slate-500 transition-transform mr-2",
                        expandedState === stateData.state && "rotate-90"
                      )}
                    />
                  </button>

                  {/* Cities within state */}
                  <div
                    className={cn(
                      "grid transition-all duration-200",
                      expandedState === stateData.state
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      {stateData.previewCities.map((cityData) => (
                        <Link
                          key={cityData.city}
                          href={`/communities?state=${stateData.state}&city=${encodeURIComponent(cityData.city)}`}
                          onClick={onClose}
                          className="flex items-center justify-between py-2 pl-8 text-sm text-slate-400 transition-colors hover:text-amber-400"
                        >
                          <span>{cityData.city}</span>
                          <span className="text-xs text-slate-500 mr-2">
                            {cityData.count}
                          </span>
                        </Link>
                      ))}
                      {stateData.hasMoreCities && (
                        <Link
                          href={`/communities?state=${stateData.state}`}
                          onClick={onClose}
                          className="flex items-center gap-1 py-2 pl-8 text-sm text-main-secondary transition-colors hover:text-amber-400"
                        >
                          View all {stateData.state} communities
                          <ChevronRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
