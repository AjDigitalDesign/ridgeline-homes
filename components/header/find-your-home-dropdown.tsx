"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchNavigation, type NavigationState } from "@/lib/api";
import { cn } from "@/lib/utils";

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

interface FindYourHomeDropdownProps {
  className?: string;
}

export function FindYourHomeDropdown({ className }: FindYourHomeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [navigationData, setNavigationData] = useState<NavigationState[]>([]);
  const [expandedState, setExpandedState] = useState<string | null>(null);

  // Load navigation data when dropdown opens
  useEffect(() => {
    async function loadNavigation() {
      if (!open || navigationData.length > 0) return;

      setIsLoading(true);
      try {
        const response = await fetchNavigation({ previewLimit: 5, type: "communities" });
        // Handle both array response and wrapped { communities: [...] } response
        const data = response.data;
        const communities = Array.isArray(data) ? data : (data?.communities || []);
        setNavigationData(communities);
      } catch (error) {
        console.error("Failed to load navigation:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNavigation();
  }, [open, navigationData.length]);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const toggleState = (state: string) => {
    setExpandedState(expandedState === state ? null : state);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap",
            className
          )}
        >
          Find Your Home
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[220px] p-0 shadow-xl border-0 bg-main-primary rounded-none"
        sideOffset={12}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-600">
          <p className="text-sm font-semibold text-white uppercase tracking-wide">
            Communities
          </p>
          <div className="mt-1.5 w-12 h-0.5 bg-main-secondary" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        ) : navigationData.length === 0 ? (
          <div className="px-4 py-6 text-center text-slate-400 text-sm">
            No communities available
          </div>
        ) : (
          <div className="py-2">
            {navigationData.map((stateData) => (
              <div key={stateData.state}>
                {/* State Button */}
                <button
                  onClick={() => toggleState(stateData.state)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors",
                    expandedState === stateData.state
                      ? "text-main-secondary"
                      : "text-white hover:text-main-secondary"
                  )}
                >
                  <span>{getStateName(stateData.state)}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      expandedState === stateData.state && "rotate-180"
                    )}
                  />
                </button>

                {/* Cities - Expandable */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    expandedState === stateData.state
                      ? "max-h-[300px]"
                      : "max-h-0"
                  )}
                >
                  <div className="pb-2">
                    {stateData.previewCities.map((cityData) => (
                      <Link
                        key={cityData.city}
                        href={`/communities?state=${stateData.state}&city=${encodeURIComponent(cityData.city)}`}
                        onClick={handleLinkClick}
                        className="block px-8 py-2 text-sm text-slate-300 hover:text-main-secondary transition-colors"
                      >
                        {cityData.city}
                      </Link>
                    ))}
                    {stateData.hasMoreCities && (
                      <Link
                        href={`/communities?state=${stateData.state}`}
                        onClick={handleLinkClick}
                        className="block px-8 py-2 text-sm text-main-secondary hover:text-main-secondary/80 transition-colors"
                      >
                        View All →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
