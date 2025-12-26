"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import type { Community, Home } from "@/lib/api";

interface FeaturedSectionBoldProps {
  communities: Community[];
  homes: Home[];
  title?: string | null;
}

// Card for the carousel - simplified design matching the Schumacher style
function FeaturedCard({
  image,
  name,
  index,
  href,
}: {
  image: string | null;
  name: string;
  index: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex-shrink-0 w-[350px] lg:w-[400px] h-[450px] lg:h-[500px] overflow-hidden"
    >
      {/* Image */}
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-main-primary/20" />
      )}

      {/* Dark gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Label at bottom */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <span className="bg-main-primary/90 text-white px-4 py-2 text-sm font-medium">
          <span className="text-main-secondary mr-2">{index + 1}</span>
          {name.toUpperCase()}
        </span>
      </div>
    </Link>
  );
}

export function FeaturedSectionBold({
  communities,
  homes,
}: FeaturedSectionBoldProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Combine communities and homes for display
  const items = [
    ...communities.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.gallery?.[0] || null,
      href: `/communities/${c.slug}`,
      type: "community" as const,
    })),
    ...homes.map((h) => ({
      id: h.id,
      name: h.name,
      image: h.gallery?.[0] || null,
      href: `/homes/${h.slug}`,
      type: "home" as const,
    })),
  ];

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

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

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 xl:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-16">
        {/* Header - Left aligned with navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 lg:mb-16">
          {/* Title section */}
          <div className="lg:col-span-4">
            <AnimateOnScroll animation="fade-in-up">
              <span className="inline-block text-main-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                OUR HOMES
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-serif text-main-primary leading-[1.1]">
                Beautifully Built
                <br />
                and Crafted with
                <br />
                Care
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

          {/* Carousel takes remaining space */}
          <div className="lg:col-span-8 -mr-4 lg:-mr-10 xl:-mr-16">
            <AnimateOnScroll animation="fade-in-right" delay={300}>
              <div
                ref={scrollContainerRef}
                onScroll={updateScrollState}
                className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {items.map((item, index) => (
                  <FeaturedCard
                    key={`${item.type}-${item.id}`}
                    image={item.image}
                    name={item.name}
                    index={index}
                    href={item.href}
                  />
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* View More Button - Right aligned */}
        <AnimateOnScroll animation="fade-in-up" delay={400}>
          <div className="flex justify-end">
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 bg-main-primary text-white px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-main-primary/90 transition-colors group"
            >
              Tour More Homes
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default FeaturedSectionBold;
