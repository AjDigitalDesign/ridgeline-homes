"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Phone } from "lucide-react";
import type { AboutPage, Tenant } from "@/lib/api";

interface AboutPageClientProps {
  pageData: AboutPage | null;
  tenant: Tenant | null;
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper function to check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// Video Play Button
function VideoPlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
    >
      <div className="size-16 lg:size-20 rounded-full border-2 border-white bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Play className="size-6 lg:size-8 text-white fill-white ml-1" />
      </div>
    </button>
  );
}

// Decorative corner element
function DecorativeCorner({ position }: { position: "top-left" | "bottom-left" }) {
  return (
    <div
      className={`absolute ${
        position === "top-left" ? "top-4 left-4" : "bottom-8 left-8"
      } w-16 h-16 lg:w-24 lg:h-24 pointer-events-none`}
    >
      <div className="w-full h-full border-2 border-main-primary/30 rotate-45" />
    </div>
  );
}

// Decorative lines element
function DecorativeLines({ position }: { position: "right" | "left" }) {
  return (
    <div
      className={`absolute ${
        position === "right" ? "right-0 top-1/2 -translate-y-1/2" : "left-0 bottom-20"
      } w-24 lg:w-32 h-48 pointer-events-none opacity-30`}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-full h-2 bg-main-primary/20 mb-3 rounded-full"
          style={{ transform: `translateX(${i * 8}px)` }}
        />
      ))}
    </div>
  );
}

export default function AboutPageClient({
  pageData,
  tenant,
}: AboutPageClientProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Default content based on the design screenshots
  const heroImage = pageData?.aboutPageBannerImage || pageData?.seo?.ogImage || "";
  const heroTitle = pageData?.aboutPageBannerTitle || "About Us";

  // Intro section content
  const introTitle = pageData?.aboutPageIntroTitle || "Realar Vision & Mission";
  const introDescription =
    pageData?.aboutPageIntroDescription ||
    "You are the center of our process. Your needs, your wants, and your goals. We actively listen, always keep it even keel — never rushing you or pushing something you don't need.";
  const introContent =
    pageData?.aboutPageIntroContent ||
    "Full transparency is our goal. We stay connected while building your home, clearly outlining next steps and collaborating with you to select personal design details. From day one, your peace of mind is our highest priority.";

  // Features list
  const features = [
    "Quality real estate services",
    "100% Satisfaction guarantee",
    "Highly professional team",
    "Dealing always on time",
  ];

  return (
    <main className="min-h-screen bg-[#C0CDD1] pt-16 xl:pt-20">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[400px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            className={`object-cover transition-transform duration-1000 ${
              isAnimated ? "scale-100" : "scale-110"
            }`}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-main-primary/90 to-main-primary/70" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {/* Decorative corner */}
        <DecorativeCorner position="top-left" />

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div
            className={`transition-all duration-700 ${
              isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white">{heroTitle}</h1>
            <div
              className={`flex items-center justify-center gap-2 text-white/90 mt-4 transition-all duration-700 delay-100 ${
                isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ArrowRight className="size-4" />
              <span>About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          {/* Section 1: Title + Description with Video */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 lg:mb-24">
            {/* Left Content */}
            <div
              className={`flex-1 transition-all duration-700 ${
                isAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-main-primary leading-tight">
                {introTitle}
              </h2>
              <p className="text-gray-700 mt-6 leading-relaxed">{introDescription}</p>
              <p className="text-gray-700 mt-4 leading-relaxed">{introContent}</p>
            </div>

            {/* Right Video/Image */}
            <div
              className={`flex-1 transition-all duration-700 delay-200 ${
                isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                {pageData?.aboutPageIntroMediaUrl ? (
                  pageData.aboutPageIntroMediaType === "video" ? (
                    isYouTubeUrl(pageData.aboutPageIntroMediaUrl) ? (
                      !isVideoPlaying ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeVideoId(pageData.aboutPageIntroMediaUrl)}/maxresdefault.jpg`}
                            alt="Video thumbnail"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <VideoPlayButton onClick={() => setIsVideoPlaying(true)} />
                          {/* Decorative text */}
                          <div className="absolute top-4 right-4 text-white/80 text-sm font-medium writing-mode-vertical">
                            <span className="block rotate-90 origin-center whitespace-nowrap">
                              Realar Living Solutions
                            </span>
                          </div>
                        </>
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(pageData.aboutPageIntroMediaUrl)}?autoplay=1`}
                          title="About Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      )
                    ) : (
                      !isVideoPlaying ? (
                        <>
                          <video
                            src={pageData.aboutPageIntroMediaUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <VideoPlayButton onClick={() => setIsVideoPlaying(true)} />
                        </>
                      ) : (
                        <video
                          src={pageData.aboutPageIntroMediaUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                      )
                    )
                  ) : (
                    <Image
                      src={pageData.aboutPageIntroMediaUrl}
                      alt="About Us"
                      fill
                      className="object-cover"
                    />
                  )
                ) : (
                  // Placeholder image
                  <div className="absolute inset-0 bg-main-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="size-16 text-main-primary/50 mx-auto" />
                      <p className="text-main-primary/60 mt-2">Video coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Image + Design Philosophy */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 lg:mb-24">
            {/* Left Image */}
            <div
              className={`flex-1 lg:flex-[0.8] transition-all duration-700 delay-100 ${
                isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about.jpg"
                  alt="Modern home exterior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Content */}
            <div
              className={`flex-1 lg:flex-[1.2] transition-all duration-700 delay-300 ${
                isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <p className="text-gray-700 leading-relaxed">
                We design homes for how people live. Centered Design is our philosophy, our
                approach to creating spaces that energize and inspire.
              </p>
              <p className="text-gray-700 mt-4 leading-relaxed">
                Our floor plan designs focus on three elements: natural light, color, and clean
                air all qualities that support your wellbeing and energy levels. When you walk
                into our homes, you&apos;ll see design that puts people first, and more
                importantly, you&apos;ll feel it.
              </p>
            </div>
          </div>

          {/* Decorative lines */}
          <DecorativeLines position="right" />

          {/* Section 3: Quality & Contact */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start relative">
            {/* Left Content */}
            <div
              className={`flex-1 transition-all duration-700 delay-200 ${
                isAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <p className="text-gray-700 leading-relaxed">
                That&apos;s why we build every home like it&apos;s our own. Building locally since 1988,
                we hold ourselves to the highest standards of quality and construction integrity.
                In addition to the 28 required county inspections, we complete nine formal Inland
                inspections, plus nine more third-party critical inspections — that&apos;s 18
                additional formal inspections on every Inland Home, by choice. Our goal is that
                each home will serve your family, and others, for generations to come.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 transition-all duration-500 ${
                      isAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <CheckCircle2 className="size-5 text-main-primary shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div
                className={`flex items-center gap-4 mt-8 pt-8 border-t border-gray-300 transition-all duration-700 delay-500 ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="size-14 rounded-full bg-main-primary flex items-center justify-center">
                  <Phone className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Us 24/7</p>
                  <a
                    href={`tel:${tenant?.builderPhone || "+01 234 56789"}`}
                    className="text-xl lg:text-2xl font-bold text-main-primary hover:text-main-primary/80 transition-colors"
                  >
                    {tenant?.builderPhone || "+01 234 56789"}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div
              className={`flex-1 transition-all duration-700 delay-400 ${
                isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/abouttwo.jpg"
                  alt="Professional team meeting"
                  fill
                  className="object-cover"
                />
                {/* Decorative lines overlay */}
                <DecorativeLines position="right" />
              </div>
            </div>
          </div>

          {/* Bottom decorative corner */}
          <DecorativeCorner position="bottom-left" />
        </div>
      </section>
    </main>
  );
}
