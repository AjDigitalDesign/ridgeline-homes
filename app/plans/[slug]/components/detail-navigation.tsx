"use client";

import { useRef, useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FloorplanSectionId =
  | "overview"
  | "description"
  | "elevations"
  | "floorplans"
  | "virtualtour"
  | "videotour"
  | "features"
  | "homes";

export interface FloorplanSection {
  id: FloorplanSectionId;
  label: string;
  visible: boolean;
}

interface DetailNavigationProps {
  sections: FloorplanSection[];
  activeSection: FloorplanSectionId;
  onSectionClick: (sectionId: FloorplanSectionId) => void;
  onScheduleTour: () => void;
}

export default function DetailNavigation({
  sections,
  activeSection,
  onSectionClick,
  onScheduleTour,
}: DetailNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScrollability, 300);
  };

  return (
    <nav className="sticky top-[72px] xl:top-[88px] z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex items-center justify-between h-14">
          {/* Section Tabs */}
          <div className="relative flex-1 overflow-hidden">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-8 bg-white shadow-md rounded-full lg:hidden"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}

            {/* Tabs Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollability}
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-8 lg:px-0"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                    activeSection === section.id
                      ? "bg-main-primary text-white"
                      : "text-main-primary hover:bg-gray-100"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-8 bg-white shadow-md rounded-full lg:hidden"
              >
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>

          {/* Schedule Tour CTA */}
          <div className="hidden lg:block ml-4">
            <Button
              onClick={onScheduleTour}
              size="sm"
              className="bg-main-secondary text-main-primary hover:bg-main-secondary/90"
            >
              <Calendar className="size-4 mr-2" />
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
