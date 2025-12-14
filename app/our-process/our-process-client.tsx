"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Play, ArrowRight, Compass, Palette, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { OurProcessPage } from "@/lib/api";

interface OurProcessPageClientProps {
  pageData: OurProcessPage | null;
}

// Process Sub-Navigation
function ProcessSubNav({
  activeTab,
  isAnimated,
}: {
  activeTab: string;
  isAnimated?: boolean;
}) {
  const tabs = [
    { label: "OUR PROCESS", href: "/our-process", value: "our-process", icon: Compass },
    { label: "DESIGN CENTER", href: "/our-process/design-center", value: "design-center", icon: Palette },
    { label: "ENERGY EFFICIENCY", href: "/our-process/energy-efficiency", value: "energy-efficiency", icon: Zap },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center gap-2 bg-white py-4 border-b">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.value
                ? "bg-main-primary text-white"
                : "bg-white text-main-primary border border-gray-200 hover:border-main-primary hover:scale-105"
            } ${
              isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${index * 50 + 300}ms` }}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

// Mobile Process Sub-Navigation
function MobileProcessSubNav() {
  return (
    <div className="lg:hidden bg-white border-b">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-4 text-main-primary font-semibold">
            OUR PROCESS MENU
            <ChevronDown className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Our Process</SheetTitle>
          </SheetHeader>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-2 py-4">
              <Link
                href="/our-process"
                className="flex items-center gap-2 px-4 py-3 bg-main-primary text-white rounded-lg font-medium"
              >
                <Compass className="size-5" />
                Our Process
              </Link>
              <Link
                href="/our-process/design-center"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
              >
                <Palette className="size-5" />
                Design Center
              </Link>
              <Link
                href="/our-process/energy-efficiency"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
              >
                <Zap className="size-5" />
                Energy Efficiency
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
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

// YouTube Embed Component
function YouTubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title={title || "Video"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  );
}

// YouTube Thumbnail with Play Button
function YouTubeThumbnail({
  videoId,
  onClick,
}: {
  videoId: string;
  onClick: () => void;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback to hqdefault if maxresdefault doesn't exist
          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      <VideoPlayButton onClick={onClick} />
    </>
  );
}

// Video Play Button Overlay
function VideoPlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
    >
      <div className="size-20 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
        <Play className="size-8 text-white fill-white ml-1" />
      </div>
    </button>
  );
}

// Intro Section Component
function IntroSection({
  pageData,
  isAnimated,
}: {
  pageData: OurProcessPage;
  isAnimated: boolean;
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="bg-main-primary/10 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
          {/* Left Content Card - Lower position */}
          <div
            className={`flex-1 lg:mt-24 bg-white rounded-lg lg:rounded-r-none p-8 lg:p-12 xl:p-16 transition-all duration-700 order-2 lg:order-1 ${
              isAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-light text-main-primary leading-tight">
              {pageData.processIntroTitle || "Exquisite Living Redefined"}
            </h2>
            {pageData.processIntroDescription && (
              <h3 className="text-lg lg:text-xl font-bold text-main-primary mt-6 italic">
                {pageData.processIntroDescription}
              </h3>
            )}
            {pageData.processIntroContent && (
              <div
                className="text-gray-600 mt-6 leading-relaxed prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: pageData.processIntroContent }}
              />
            )}
            {pageData.processIntroCta && pageData.processIntroCtaLink && (
              <Link
                href={pageData.processIntroCtaLink}
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-main-secondary text-main-primary rounded-full font-semibold hover:bg-main-secondary/90 transition-colors"
              >
                {pageData.processIntroCta}
                <ArrowRight className="size-5" />
              </Link>
            )}
          </div>

          {/* Right Media - Higher position, starts at top */}
          <div
            className={`flex-1 lg:flex-[1.1] transition-all duration-700 delay-200 order-1 lg:order-2 ${
              isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {pageData.processIntroMediaUrl && (
              <div className="relative aspect-4/5 lg:aspect-auto lg:h-[600px] rounded-lg lg:rounded-l-none overflow-hidden shadow-2xl">
                {pageData.processIntroMediaType === "video" ? (
                  // Video handling
                  isYouTubeUrl(pageData.processIntroMediaUrl) ? (
                    // YouTube video
                    !isVideoPlaying ? (
                      <YouTubeThumbnail
                        videoId={getYouTubeVideoId(pageData.processIntroMediaUrl) || ""}
                        onClick={() => setIsVideoPlaying(true)}
                      />
                    ) : (
                      <YouTubeEmbed
                        videoId={getYouTubeVideoId(pageData.processIntroMediaUrl) || ""}
                        title="Our Process"
                      />
                    )
                  ) : (
                    // Regular video file
                    !isVideoPlaying ? (
                      <>
                        <video
                          src={pageData.processIntroMediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <VideoPlayButton onClick={() => setIsVideoPlaying(true)} />
                      </>
                    ) : (
                      <video
                        src={pageData.processIntroMediaUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    )
                  )
                ) : (
                  // Image
                  <Image
                    src={pageData.processIntroMediaUrl}
                    alt="Our Process"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Step Number Badge
function StepBadge({ number, isAnimated, delay = 0 }: { number: number; isAnimated: boolean; delay?: number }) {
  return (
    <div
      className={`size-16 lg:size-20 rounded-full bg-main-primary flex items-center justify-center transition-all duration-500 ${
        isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-2xl lg:text-3xl font-light text-white">{number}</span>
    </div>
  );
}

// Process Step Component
function ProcessStep({
  step,
  index,
  isAnimated,
}: {
  step: {
    id: string;
    title: string;
    shortTitle: string;
    description: string;
    mediaType: "image" | "video";
    mediaUrl: string;
  };
  index: number;
  isAnimated: boolean;
}) {
  const isEven = index % 2 === 0;
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className={`${isEven ? "bg-main-primary/10" : "bg-white"} py-16 lg:py-24`}>
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
          {/* Content Card - Lower position */}
          <div
            className={`flex-1 lg:mt-24 bg-white rounded-lg ${isEven ? "lg:rounded-r-none" : "lg:rounded-l-none"} p-8 lg:p-12 xl:p-16 shadow-lg transition-all duration-700 ${
              isEven ? "order-2 lg:order-1" : "order-2 lg:order-2"
            } ${
              isAnimated
                ? "opacity-100 translate-x-0"
                : isEven
                  ? "opacity-0 -translate-x-8"
                  : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: `${index * 150 + 300}ms` }}
          >
            {/* Step Number */}
            <StepBadge number={index + 1} isAnimated={isAnimated} delay={index * 150 + 400} />

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold text-main-primary mt-6">
              {step.title}
            </h3>
            {step.shortTitle && (
              <p className="text-lg font-semibold text-main-primary mt-1 italic">
                {step.shortTitle}
              </p>
            )}

            {/* Accent Line */}
            <div
              className={`w-16 h-1 bg-main-secondary mt-4 transition-all duration-500 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
              style={{ transitionDelay: `${index * 150 + 500}ms`, transformOrigin: "left" }}
            />

            {/* Description */}
            <div
              className="text-gray-600 mt-6 leading-relaxed prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: step.description }}
            />
          </div>

          {/* Media - Higher position, starts at top */}
          <div
            className={`flex-1 lg:flex-[1.1] transition-all duration-700 ${
              isEven ? "order-1 lg:order-2" : "order-1 lg:order-1"
            } ${
              isAnimated
                ? "opacity-100 translate-x-0"
                : isEven
                  ? "opacity-0 translate-x-8"
                  : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: `${index * 150 + 200}ms` }}
          >
            <div className={`relative aspect-4/5 lg:aspect-auto lg:h-[600px] rounded-lg ${isEven ? "lg:rounded-l-none" : "lg:rounded-r-none"} overflow-hidden shadow-2xl`}>
              {step.mediaType === "video" ? (
                // Video handling
                isYouTubeUrl(step.mediaUrl) ? (
                  // YouTube video
                  !isVideoPlaying ? (
                    <YouTubeThumbnail
                      videoId={getYouTubeVideoId(step.mediaUrl) || ""}
                      onClick={() => setIsVideoPlaying(true)}
                    />
                  ) : (
                    <YouTubeEmbed
                      videoId={getYouTubeVideoId(step.mediaUrl) || ""}
                      title={step.title}
                    />
                  )
                ) : (
                  // Regular video file
                  !isVideoPlaying ? (
                    <>
                      <video
                        src={step.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <VideoPlayButton onClick={() => setIsVideoPlaying(true)} />
                    </>
                  ) : (
                    <video
                      src={step.mediaUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  )
                )
              ) : (
                // Image
                <Image
                  src={step.mediaUrl}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Process Steps Section
function ProcessStepsSection({
  pageData,
  isAnimated,
}: {
  pageData: OurProcessPage;
  isAnimated: boolean;
}) {
  if (!pageData.processSteps || pageData.processSteps.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Section Title */}
      {pageData.processStepsTitle && (
        <div className="bg-white py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
            <div className="text-center">
              <h2
                className={`text-3xl lg:text-5xl font-bold text-main-primary transition-all duration-700 ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                {pageData.processStepsTitle}
              </h2>
              <div
                className={`w-24 h-1 bg-main-secondary mx-auto mt-6 transition-all duration-500 ${
                  isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      {pageData.processSteps.map((step, index) => (
        <ProcessStep
          key={step.id}
          step={step}
          index={index}
          isAnimated={isAnimated}
        />
      ))}
    </div>
  );
}

export default function OurProcessPageClient({
  pageData,
}: OurProcessPageClientProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const heroImage = pageData?.processBannerImage || "";
  const heroTitle = pageData?.processBannerTitle || "Our Process";

  return (
    <main className="min-h-screen bg-white">
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
          <div className="absolute inset-0 bg-gradient-to-br from-main-primary to-main-primary/80" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div
            className={`transition-all duration-700 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              {heroTitle}
            </h1>
            <p
              className={`text-lg lg:text-xl text-white/90 mt-2 transition-all duration-700 delay-100 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Building your dream home, step by step
            </p>
            <div
              className={`w-24 h-1 bg-main-secondary mx-auto mt-4 transition-all duration-500 delay-200 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Process Sub-Navigation */}
      <ProcessSubNav activeTab="our-process" isAnimated={isAnimated} />
      <MobileProcessSubNav />

      {/* Intro Section */}
      {pageData && <IntroSection pageData={pageData} isAnimated={isAnimated} />}

      {/* Process Steps Section */}
      {pageData && <ProcessStepsSection pageData={pageData} isAnimated={isAnimated} />}

      {/* Fallback when no data */}
      {!pageData && (
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-16 text-center">
          <Compass className="size-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">Process information coming soon</p>
          <p className="text-sm text-gray-400 mt-1">
            Check back later for details about our homebuilding process
          </p>
        </div>
      )}
    </main>
  );
}
