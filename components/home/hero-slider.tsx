"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Play, ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export interface BannerSlide {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  buttonLink: string;
  buttonText: string;
  description: string;
}

interface HeroSliderProps {
  slides: BannerSlide[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export default function HeroSlider({ slides, socialLinks }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // Build social links from props - only show if they exist
  const socialLinksArray = [
    socialLinks?.twitter && { name: "TWITTER", href: socialLinks.twitter },
    socialLinks?.instagram && {
      name: "INSTAGRAM",
      href: socialLinks.instagram,
    },
    socialLinks?.facebook && { name: "FACEBOOK", href: socialLinks.facebook },
  ].filter(Boolean) as { name: string; href: string }[];

  // Check if slide has a video
  const hasVideo = (slide: BannerSlide) =>
    slide.videoUrl && slide.videoUrl.length > 0;

  // Early return if no slides (after hooks)
  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        {/* Green Background - covers 2/3 of section */}
        <div
          className="absolute inset-0 bg-main-primary"
          style={{ height: "66.666%" }}
        />
        {/* Tertiary Background - covers bottom 1/3 of section */}
        <div
          className="absolute inset-x-0 bottom-0 bg-[#C0CDD1]"
          style={{ height: "33.334%" }}
        />

        {/* Main Container */}
        <div className="relative pt-20 lg:pt-24 xl:pt-32">
          {/* Content wrapper aligned with navigation */}
          <div className="">
            <div className="relative flex items-center">
              {/* Social Media Links - Left Side (Desktop) */}
              {socialLinksArray.length > 0 && (
                <div className="absolute -left-16 top-1/2  z-30 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex">
                  {socialLinksArray.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-3"
                    >
                      <span
                        className="text-[10px] font-medium tracking-widest text-white/70 transition-colors hover:text-main-secondary"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {social.name}
                      </span>
                      {index < socialLinksArray.length - 1 && (
                        <div className="h-4 w-px bg-white/30" />
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Slider Container */}
              <div className="relative w-full overflow-hidden rounded-2xl border-none">
                <div className="relative h-[50vh] min-h-[500px] lg:h-[60vh] xl:h-[70vh]">
                  <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    speed={1000}
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    pagination={{
                      clickable: true,
                      el: ".hero-pagination",
                      bulletClass: "hero-bullet",
                      bulletActiveClass: "hero-bullet-active",
                    }}
                    loop={slides.length > 1}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                      setCurrentSlide(swiper.realIndex);
                    }}
                    className="h-full w-full"
                  >
                    {slides.map((slide, index) => (
                      <SwiperSlide key={slide.id}>
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <Image
                            src={slide.imageUrl}
                            alt={slide.title}
                            fill
                            priority={index === 0}
                            className="object-cover"
                          />
                          {/* Overlay gradients for better text readability */}
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
                          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />
                        </div>

                        {/* Slide Content */}
                        <div className="relative z-20 flex h-full items-center px-6 sm:px-10 lg:px-16">
                          <div className="flex w-full items-center">
                            {/* Text Content */}
                            <div className="max-w-xl xl:max-w-2xl">
                              <h2 className="font-outfit text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                <span className="block">{slide.title}</span>
                              </h2>
                              <p className="mt-4 max-w-md text-base text-white/80 sm:mt-6 sm:text-lg">
                                {slide.description}
                              </p>
                              <div className="mt-6 flex flex-wrap justify-start items-center gap-4  sm:mt-8">
                                <Button
                                  asChild
                                  className="group h-auto rounded-md bg-main-secondary px-4 py-3 text-base font-medium text-main-primary hover:bg-main-secondary/90"
                                >
                                  <Link href={slide.buttonLink}>
                                    {slide.buttonText}
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                  </Link>
                                </Button>

                                {/* Mobile Video Play Button - next to CTA */}
                                {hasVideo(slide) && (
                                  <button
                                    onClick={() => setIsVideoOpen(true)}
                                    className="group relative flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all active:scale-95 hover:bg-white/30 lg:hidden xl:ml-32"
                                    aria-label="Play video"
                                  >
                                    <Play className="size-5 fill-white text-white" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Video Play Button (Desktop - only show on video slides) */}
                            {hasVideo(slide) && (
                              <div className="hidden items-center lg:flex lg:ml-10">
                                <button
                                  onClick={() => setIsVideoOpen(true)}
                                  className="group relative flex size-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
                                  aria-label="Play video"
                                >
                                  <div className="absolute inset-0 animate-ping rounded-full border-2 border-white/50" />
                                  <Play className="size-10 fill-white text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Pagination - Bottom Right */}
                  <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 sm:right-8 lg:right-10">
                    <div className="hero-pagination flex items-center gap-2" />
                  </div>
                </div>
              </div>

              {/* Scroll Indicator - Right Side (Desktop) */}
              <div className="absolute -right-16 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
                <span
                  className="text-[10px] font-medium tracking-widest text-white/70"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  SCROLL
                </span>
                <div className="h-8 w-px bg-white/30" />
                <ArrowDown className="size-4 animate-bounce text-white/70" />
              </div>
            </div>
          </div>

          {/* Bottom padding for green bg */}
          <div className="h-20 lg:h-28" />
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl overflow-hidden border-0 bg-black p-0 sm:rounded-xl">
          <DialogTitle className="sr-only">Video Player</DialogTitle>
          <div className="aspect-video w-full">
            {currentSlideData?.videoUrl && (
              <iframe
                src={`${currentSlideData.videoUrl}?autoplay=1`}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .hero-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-bullet:hover {
          background: rgba(255, 255, 255, 1);
        }
        .hero-bullet-active {
          width: 32px;
          background: var(--color-main-secondary);
        }
      `}</style>
    </section>
  );
}
