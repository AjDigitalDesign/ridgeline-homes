"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchBOYLLocations, type BOYLLocation } from "@/lib/api";

// Map state abbreviations to full names
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const getStateName = (abbr: string) => STATE_NAMES[abbr] || abbr;

const PREVIEW_LIMIT = 3;

// Group locations by state with preview limit
interface BOYLNavState {
  state: string;
  previewLocations: {
    name: string;
    slug: string;
    county: string;
  }[];
  totalLocations: number;
  hasMore: boolean;
}

function groupLocationsByState(locations: BOYLLocation[]): BOYLNavState[] {
  const grouped = locations.reduce((acc, location) => {
    if (!acc[location.state]) {
      acc[location.state] = [];
    }
    acc[location.state].push({
      name: location.name,
      slug: location.slug,
      county: location.county,
    });
    return acc;
  }, {} as Record<string, { name: string; slug: string; county: string }[]>);

  return Object.entries(grouped)
    .map(([state, locs]) => {
      const sortedLocations = locs.sort((a, b) => a.county.localeCompare(b.county));
      return {
        state,
        previewLocations: sortedLocations.slice(0, PREVIEW_LIMIT),
        totalLocations: sortedLocations.length,
        hasMore: sortedLocations.length > PREVIEW_LIMIT,
      };
    })
    .sort((a, b) => getStateName(a.state).localeCompare(getStateName(b.state)));
}

interface MobileBOYLProps {
  onClose: () => void;
}

export function MobileBOYL({ onClose }: MobileBOYLProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [navigationData, setNavigationData] = useState<BOYLNavState[]>([]);
  const [expandedState, setExpandedState] = useState<string | null>(null);

  useEffect(() => {
    async function loadNavigation() {
      if (!isOpen || navigationData.length > 0) return;

      setIsLoading(true);
      try {
        const response = await fetchBOYLLocations();
        const locations = Array.isArray(response.data) ? response.data : [];
        setNavigationData(groupLocationsByState(locations));
      } catch (error) {
        console.error("Failed to load BOYL locations:", error);
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
        Build on Your Lot
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
          ) : (
            <>
              {/* Overview Link */}
              <Link
                href="/build-on-your-lot"
                onClick={onClose}
                className="flex items-center gap-2 py-2 pl-4 text-sm text-main-secondary font-medium transition-colors hover:text-amber-400"
              >
                <MapPin className="size-4" />
                Overview
              </Link>

              {navigationData.length === 0 ? (
                <div className="py-4 pl-4 text-sm text-slate-400">
                  No locations available
                </div>
              ) : (
                /* States with expandable counties */
                navigationData.map((stateData) => (
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
                        {getStateName(stateData.state)}
                        <span className="text-xs text-slate-500">
                          ({stateData.totalLocations})
                        </span>
                      </span>
                      <ChevronRight
                        className={cn(
                          "size-4 text-slate-500 transition-transform mr-2",
                          expandedState === stateData.state && "rotate-90"
                        )}
                      />
                    </button>

                    {/* Counties within state */}
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        expandedState === stateData.state
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        {stateData.previewLocations.map((location) => (
                          <Link
                            key={location.slug}
                            href={`/build-on-your-lot/${stateData.state.toLowerCase()}/${location.slug}/lot-process`}
                            onClick={onClose}
                            className="flex items-center justify-between py-2 pl-8 text-sm text-slate-400 transition-colors hover:text-amber-400"
                          >
                            <span>{location.county}</span>
                          </Link>
                        ))}
                        {stateData.hasMore && (
                          <Link
                            href={`/build-on-your-lot/${stateData.state.toLowerCase()}/lot-process`}
                            onClick={onClose}
                            className="flex items-center gap-1 py-2 pl-8 text-sm text-main-secondary transition-colors hover:text-amber-400"
                          >
                            View all {getStateName(stateData.state)} locations
                            <ChevronRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
