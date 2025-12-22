"use client";

import { useState, useCallback, useMemo } from "react";
import CoverageMap from "./coverage-map";
import type { BOYLLocation } from "@/lib/api";
import { cn } from "@/lib/utils";

interface WhereWeBuildSectionProps {
  location: BOYLLocation;
  allLocations?: BOYLLocation[];
}

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

export default function WhereWeBuildSection({ location, allLocations = [] }: WhereWeBuildSectionProps) {
  const [highlightedCounty, setHighlightedCounty] = useState<string | null>(null);
  const stateName = getStateName(location.state);

  // Get all locations for this state, or use the single location
  // Memoize to prevent unnecessary CoverageMap re-renders
  const stateLocations = useMemo(() =>
    allLocations.length > 0
      ? allLocations.filter(loc => loc.state.toLowerCase() === location.state.toLowerCase())
      : [location],
    [allLocations, location]
  );

  // Get unique counties sorted alphabetically
  const counties = useMemo(() =>
    [...new Set(stateLocations.map(loc => loc.county))].sort(),
    [stateLocations]
  );

  // Split counties into two columns
  const midpoint = Math.ceil(counties.length / 2);
  const leftColumnCounties = counties.slice(0, midpoint);
  const rightColumnCounties = counties.slice(midpoint);

  // Memoize callback to prevent unnecessary re-renders
  const handleCountyHover = useCallback((county: string | null) => {
    setHighlightedCounty(county);
  }, []);

  return (
    <div>
      {/* Map and Counties Section */}
      <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
        {/* Map - Full width left side */}
        <div className="w-full lg:w-[60%] h-[400px] lg:h-auto relative">
          <CoverageMap
            location={location}
            allLocations={stateLocations}
            highlightedCounty={highlightedCounty}
            onCountyHover={handleCountyHover}
          />
        </div>

        {/* Counties Panel - Right side */}
        <div className="w-full lg:w-[40%] bg-white p-6 lg:p-10 overflow-y-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-main-primary mb-6">
            Counties We Build In
          </h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {/* Left Column */}
            <div className="space-y-1">
              {leftColumnCounties.map((county) => (
                <p
                  key={county}
                  className={cn(
                    "text-sm lg:text-base py-1.5 px-2 rounded cursor-pointer transition-all duration-200",
                    highlightedCounty === county
                      ? "bg-main-secondary text-main-primary font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onMouseEnter={() => handleCountyHover(county)}
                  onMouseLeave={() => handleCountyHover(null)}
                >
                  {county}
                </p>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-1">
              {rightColumnCounties.map((county) => (
                <p
                  key={county}
                  className={cn(
                    "text-sm lg:text-base py-1.5 px-2 rounded cursor-pointer transition-all duration-200",
                    highlightedCounty === county
                      ? "bg-main-secondary text-main-primary font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onMouseEnter={() => handleCountyHover(county)}
                  onMouseLeave={() => handleCountyHover(null)}
                >
                  {county}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section - Below the map */}
      {location.description && (
        <div className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-main-primary mb-6 uppercase tracking-wide">
                About Our New Home Construction in {stateName}
              </h2>
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                {location.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
