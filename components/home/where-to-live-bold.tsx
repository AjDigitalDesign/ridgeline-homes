"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface MarketArea {
  id: string;
  name: string;
  slug: string;
  state: string;
  county?: string;
  city?: string;
  description?: string;
  featureImage?: string | null;
  _count?: {
    communities: number;
  };
}

interface WhereToLiveBoldProps {
  subtitle?: string | null;
  title?: string | null;
  marketAreas: MarketArea[];
}

// Card for the carousel - matching the Schumacher design
function MarketAreaCard({
  marketArea,
  index,
}: {
  marketArea: MarketArea;
  index: number;
}) {
  return (
    <Link
      href={`/communities?state=${marketArea.state}&city=${encodeURIComponent(marketArea.city || marketArea.name)}`}
      className="group relative flex-shrink-0 w-[320px] sm:w-[350px] lg:w-[400px] h-[420px] sm:h-[450px] lg:h-[500px] overflow-hidden"
    >
      {/* Image */}
      {marketArea.featureImage ? (
        <Image
          src={marketArea.featureImage}
          alt={marketArea.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-main-primary/20" />
      )}

      {/* Dark gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Label at bottom */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="inline-flex items-center gap-3 bg-main-primary/90 text-white px-5 py-3">
          <span className="text-main-secondary font-medium">{index + 1}</span>
          <span className="font-medium tracking-wide">{marketArea.name.toUpperCase()}</span>
        </div>
      </div>
    </Link>
  );
}

export function WhereToLiveBold({
  subtitle,
  title,
  marketAreas,
}: WhereToLiveBoldProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollState();
    // Add resize listener
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [marketAreas]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateScrollState, 300);
    }
  };

  if (marketAreas.length === 0) {
    return null;
  }

  const displaySubtitle = subtitle || "OUR HOMES";
  const displayTitle = title || "Where Do You Want to Live?";

  return (
    <section className="py-16 lg:py-24 xl:py-32 bg-main-secondary/20 overflow-hidden">
      {/* Main content wrapper - extends full width */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-0">
        {/* Title section - Left side with padding */}
        <div className="px-4 lg:pl-10 xl:pl-16 2xl:pl-24 lg:pr-8 xl:pr-12 shrink-0 lg:w-[480px] xl:w-[580px] 2xl:w-[650px]">
          <AnimateOnScroll animation="fade-in-up">
            <span className="inline-block text-main-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              {displaySubtitle}
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" delay={100}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-serif text-main-primary leading-[1.1]">
              Beautifully Built and
              <br />
              Crafted with Care
            </h2>
          </AnimateOnScroll>

          {/* Navigation Arrows */}
          <AnimateOnScroll animation="fade-in-up" delay={200}>
            <div className="flex items-center gap-0 mt-8 lg:mt-12">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`flex items-center justify-center w-14 h-14 rounded-l-full border border-gray-300 transition-all ${
                  canScrollLeft
                    ? "bg-white hover:bg-gray-50 text-main-secondary"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Scroll left"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`flex items-center justify-center w-14 h-14 rounded-r-full border border-l-0 border-gray-300 transition-all ${
                  canScrollRight
                    ? "bg-white hover:bg-gray-50 text-main-secondary"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Scroll right"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Carousel - Right side, extends to edge */}
        <div className="flex-1 min-w-0">
          <AnimateOnScroll animation="fade-in-right" delay={300}>
            <div
              ref={scrollContainerRef}
              onScroll={updateScrollState}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pl-4 lg:pl-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {marketAreas.map((area, index) => (
                <MarketAreaCard
                  key={area.id}
                  marketArea={area}
                  index={index}
                />
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

    </section>
  );
}

export default WhereToLiveBold;
