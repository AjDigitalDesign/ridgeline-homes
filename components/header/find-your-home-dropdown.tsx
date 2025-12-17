"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, MapPin, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchNavigation, type NavigationState } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FindYourHomeDropdownProps {
  className?: string;
}

export function FindYourHomeDropdown({ className }: FindYourHomeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [navigationData, setNavigationData] = useState<NavigationState[]>([]);
  const [activeState, setActiveState] = useState<string | null>(null);

  useEffect(() => {
    async function loadNavigation() {
      if (!open || navigationData.length > 0) return;

      setIsLoading(true);
      try {
        const response = await fetchNavigation({ previewLimit: 3, type: "communities" });
        setNavigationData(response.data.communities || []);
        // Set first state as active by default
        if (response.data.communities?.length > 0) {
          setActiveState(response.data.communities[0].state);
        }
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

  const activeStateData = navigationData.find((s) => s.state === activeState);

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
        className="w-[500px] p-0 shadow-xl border-0"
        sideOffset={12}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-main-primary" />
          </div>
        ) : navigationData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MapPin className="size-8 mx-auto mb-2 text-gray-400" />
            <p>No communities available</p>
          </div>
        ) : (
          <div className="flex">
            {/* States Column */}
            <div className="w-1/3 bg-gray-50 border-r">
              <div className="p-3 border-b bg-main-primary">
                <p className="text-sm font-semibold text-white uppercase tracking-wide">
                  Select State
                </p>
              </div>
              <div className="py-2">
                {navigationData.map((stateData) => (
                  <button
                    key={stateData.state}
                    onMouseEnter={() => setActiveState(stateData.state)}
                    onClick={() => setActiveState(stateData.state)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors",
                      activeState === stateData.state
                        ? "bg-white text-main-primary border-l-2 border-main-secondary"
                        : "text-gray-600 hover:bg-white hover:text-main-primary"
                    )}
                  >
                    <span>{stateData.state}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {stateData.totalCommunities}
                      </span>
                      <ChevronRight className="size-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cities Column */}
            <div className="flex-1">
              <div className="p-3 border-b bg-main-primary">
                <p className="text-sm font-semibold text-white uppercase tracking-wide">
                  {activeState ? `Communities in ${activeState}` : "Select a State"}
                </p>
              </div>
              {activeStateData && (
                <div className="p-4">
                  {/* Preview Cities */}
                  <div className="space-y-1 mb-4">
                    {activeStateData.previewCities.map((cityData) => (
                      <Link
                        key={cityData.city}
                        href={`/communities?state=${activeStateData.state}&city=${encodeURIComponent(cityData.city)}`}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-main-secondary" />
                          <span className="text-sm font-medium text-main-primary group-hover:text-main-secondary">
                            {cityData.city}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {cityData.count} {cityData.count === 1 ? "community" : "communities"}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* View All Link */}
                  {activeStateData.hasMoreCities && (
                    <Link
                      href={`/communities?state=${activeStateData.state}`}
                      onClick={handleLinkClick}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-main-primary text-white text-sm font-semibold rounded-lg hover:bg-main-primary/90 transition-colors"
                    >
                      View All {activeStateData.state} Communities
                      <ChevronRight className="size-4" />
                    </Link>
                  )}

                  {/* Browse All */}
                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href="/communities"
                      onClick={handleLinkClick}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-main-primary text-main-primary text-sm font-semibold rounded-lg hover:bg-main-primary hover:text-white transition-colors"
                    >
                      Browse All Communities
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
