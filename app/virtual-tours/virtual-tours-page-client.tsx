"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Camera, Video, View, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { VirtualToursPage, VirtualTourItem } from "@/lib/api";

interface VirtualToursPageClientProps {
  virtualToursPage: VirtualToursPage | null;
}

// Helper function to extract Matterport model ID
function getMatterportModelId(url: string): string | null {
  const patterns = [
    /my\.matterport\.com\/show\/\?m=([^&\s]+)/,
    /matterport\.com\/show\/\?m=([^&\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Media Sub-Navigation
function MediaSubNav({
  activeTab,
  isAnimated,
}: {
  activeTab: string;
  isAnimated?: boolean;
}) {
  const tabs = [
    { label: "PHOTOS", href: "/photos", value: "photos", icon: Camera },
    { label: "VIDEOS", href: "/videos", value: "videos", icon: Video },
    { label: "VIRTUAL TOURS", href: "/virtual-tours", value: "virtual-tours", icon: View },
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

// Mobile Media Sub-Navigation
function MobileMediaSubNav() {
  return (
    <div className="lg:hidden bg-white border-b">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-4 text-main-primary font-semibold">
            MEDIA GALLERY MENU
            <ChevronDown className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Media Gallery</SheetTitle>
          </SheetHeader>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-2 py-4">
              <Link
                href="/photos"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
              >
                <Camera className="size-5" />
                Photos
              </Link>
              <Link
                href="/videos"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
              >
                <Video className="size-5" />
                Videos
              </Link>
              <Link
                href="/virtual-tours"
                className="flex items-center gap-2 px-4 py-3 bg-main-primary text-white rounded-lg font-medium"
              >
                <View className="size-5" />
                Virtual Tours
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Tour Thumbnail Component
function TourThumbnail({
  tour,
  isActive,
  onClick,
  index,
  isAnimated,
}: {
  tour: VirtualTourItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
  isAnimated: boolean;
}) {
  const modelId = getMatterportModelId(tour.url);
  // Matterport provides a thumbnail URL format
  const thumbnailUrl = modelId
    ? `https://my.matterport.com/api/v1/player/models/${modelId}/thumb`
    : "";

  return (
    <button
      onClick={onClick}
      className={`flex gap-3 w-full text-left p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
        isActive ? "bg-main-primary/10 ring-2 ring-main-primary" : ""
      } ${
        isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 100 + 400}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-200">
        {thumbnailUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={tour.title || "Virtual Tour"}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a placeholder
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="fallback-placeholder absolute inset-0 flex items-center justify-center bg-gray-200" style={{ display: "none" }}>
              <View className="size-8 text-gray-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="size-10 rounded-full bg-main-primary/90 flex items-center justify-center">
                <View className="size-4 text-white" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <View className="size-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Tour Info */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-medium text-main-primary text-sm line-clamp-2 leading-tight">
          {tour.title || "Virtual Tour"}
        </h3>
        {tour.pageUrl && (
          <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <ExternalLink className="size-3" />
            Related Page
          </span>
        )}
      </div>
    </button>
  );
}

// Main Virtual Tour Viewer Component
function MainTourViewer({
  tour,
  isAnimated,
}: {
  tour: VirtualTourItem;
  isAnimated: boolean;
}) {
  const modelId = getMatterportModelId(tour.url);

  return (
    <div
      className={`transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: "300ms" }}
    >
      {/* Tour Viewer */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
        {modelId ? (
          <iframe
            src={`https://my.matterport.com/show/?m=${modelId}`}
            title={tour.title || "Virtual Tour"}
            allow="fullscreen; vr"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : tour.url ? (
          <iframe
            src={tour.url}
            title={tour.title || "Virtual Tour"}
            allow="fullscreen; vr"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <View className="size-16 text-gray-500" />
          </div>
        )}
      </div>

      {/* Tour Title and Info */}
      <div className="mt-4">
        <h2 className="text-xl lg:text-2xl font-bold text-main-primary line-clamp-2">
          {tour.title || "Virtual Tour"}
        </h2>
        {tour.pageUrl && (
          <Link
            href={tour.pageUrl}
            className="inline-flex items-center gap-2 mt-3 text-sm text-main-primary hover:text-main-secondary transition-colors"
          >
            <ExternalLink className="size-4" />
            View Related Page
          </Link>
        )}
      </div>
    </div>
  );
}

export default function VirtualToursPageClient({
  virtualToursPage,
}: VirtualToursPageClientProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const heroImage = virtualToursPage?.virtualTourBannerImage || "";
  const heroTitle = virtualToursPage?.virtualTourBannerTitle || "Virtual Tours";
  const tours = virtualToursPage?.virtualTourItems
    ?.filter((tour) => tour.url) // Only include tours with URLs
    ?.sort((a, b) => a.displayOrder - b.displayOrder) || [];
  const selectedTour = tours[selectedTourIndex];
  const hasTours = tours.length > 0;

  return (
    <main className="min-h-screen bg-gray-50">
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
              Experience our homes in immersive 3D
            </p>
            <div
              className={`w-24 h-1 bg-main-secondary mx-auto mt-4 transition-all duration-500 delay-200 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Media Sub-Navigation */}
      <MediaSubNav activeTab="virtual-tours" isAnimated={isAnimated} />
      <MobileMediaSubNav />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        {hasTours && selectedTour ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Tour Viewer - Left Side */}
            <div className="lg:flex-2">
              <MainTourViewer tour={selectedTour} isAnimated={isAnimated} />
            </div>

            {/* Tour List - Right Side */}
            <div className="lg:flex-1">
              <h3
                className={`text-lg font-semibold text-main-primary mb-4 transition-all duration-500 ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                More Virtual Tours
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {tours.map((tour, index) => (
                  <TourThumbnail
                    key={tour.id}
                    tour={tour}
                    isActive={index === selectedTourIndex}
                    onClick={() => setSelectedTourIndex(index)}
                    index={index}
                    isAnimated={isAnimated}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            className={`text-center py-16 transition-all duration-500 delay-400 ${
              isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <View className="size-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-500">No virtual tours available yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for virtual tour content</p>
            <Link
              href="/photos"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-main-primary text-white rounded-full font-medium hover:bg-main-primary/90 transition-colors"
            >
              <Camera className="size-4" />
              View Photo Gallery
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
