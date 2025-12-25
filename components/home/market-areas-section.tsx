"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import type { MarketArea } from "@/lib/api";

import "swiper/css";
import "swiper/css/navigation";

interface MarketAreasSectionProps {
  marketAreas: MarketArea[];
}

export default function MarketAreasSection({
  marketAreas,
}: MarketAreasSectionProps) {
  if (!marketAreas || marketAreas.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#C0CDD1] py-16 lg:py-24 overflow-x-clip relative">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
          {/* Left Content */}
          <AnimateOnScroll
            animation="fade-in-left"
            className="lg:w-1/3 shrink-0 pr-4 lg:pr-8"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-main-primary leading-tight">
              Where Do You Want to Live?
            </h2>
            <p className="mt-4 text-main-primary/70 text-lg">
              {marketAreas.length} Areas in Maryland to Choose from
            </p>
            <div className="mt-6 w-16 h-1 bg-main-secondary" />
          </AnimateOnScroll>

          {/* Right Content - Slider */}
          <AnimateOnScroll
            animation="fade-in-right"
            delay={200}
            className="lg:w-2/3 -mr-4 lg:-mr-10 xl:-mr-16 overflow-hidden relative"
          >
            {/* Navigation Arrows */}
            <button className="market-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="size-5 text-main-primary" />
            </button>
            <button className="market-next absolute right-4 lg:right-10 xl:right-16 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="size-5 text-main-primary" />
            </button>

            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1.2}
              navigation={{
                prevEl: ".market-prev",
                nextEl: ".market-next",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
            >
              {marketAreas.map((area) => (
                <SwiperSlide key={area.id}>
                  <Link
                    href={`/communities?marketArea=${area.slug}`}
                    className="group relative block overflow-hidden rounded-xl h-[400px] lg:h-[450px]"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {area.featureImage ? (
                        <Image
                          src={area.featureImage}
                          alt={area.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-main-primary/20" />
                      )}
                      {/* Overlay for readability */}
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between  p-6 ">
                      {/* Title */}
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white">
                          {area.name}
                          {(area.city || area.state) && (
                            <span className="block text-lg font-normal text-white/80 mt-1">
                              {[area.city, area.state]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-white/70 uppercase tracking-wider mt-2">
                          New Homes
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="mt-6">
                        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all group-hover:bg-main-secondary group-hover:border-main-secondary">
                          <ArrowRight className="size-5 text-white transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-main-secondary/50 group-hover:bg-main-secondary transition-colors" />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
