"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Camera, Video, View, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Lightbox } from "@/components/ui/lightbox";
import type { GalleryPage, GalleryImage, GalleryTag } from "@/lib/api";

interface GalleryPageClientProps {
  galleryPage: GalleryPage | null;
  initialImages: GalleryImage[];
  tags: GalleryTag[];
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
                className="flex items-center gap-2 px-4 py-3 bg-main-primary text-white rounded-lg font-medium"
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
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
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

// Tag Filter Pills
function TagFilters({
  tags,
  activeTag,
  onTagChange,
}: {
  tags: GalleryTag[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onTagChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeTag === "all"
            ? "bg-main-primary text-white"
            : "bg-gray-100 text-main-primary hover:bg-gray-200"
        }`}
      >
        All Photos
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagChange(tag.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTag === tag.slug
              ? "bg-main-primary text-white"
              : "bg-gray-100 text-main-primary hover:bg-gray-200"
          }`}
        >
          {tag.name}
          <span className="ml-1 text-xs opacity-70">({tag.imageCount})</span>
        </button>
      ))}
    </div>
  );
}

// Gallery Grid
function GalleryGrid({
  images,
  onImageClick,
  animationKey,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
  animationKey: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Reset and trigger animation when images change
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [animationKey]);

  if (images.length === 0) {
    return (
      <div className="text-center py-16 animate-in fade-in duration-500">
        <Camera className="size-16 text-gray-300 mx-auto mb-4" />
        <p className="text-lg text-gray-500">No photos found</p>
        <p className="text-sm text-gray-400 mt-1">Check back later for new photos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick(index)}
          className={`group relative aspect-square rounded-lg overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-main-primary focus:ring-offset-2 transition-all duration-500 ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
          style={{
            transitionDelay: `${Math.min(index * 50, 400)}ms`,
          }}
        >
          <Image
            src={image.url}
            alt={image.alt || "Gallery image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm truncate">{image.caption}</p>
            </div>
          )}
          {image.tag && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-main-primary/90 text-white text-xs font-medium rounded-full">
                {image.tag.name}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export default function GalleryPageClient({
  galleryPage,
  initialImages,
  tags,
}: GalleryPageClientProps) {
  const [activeTag, setActiveTag] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animations after mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Filter images by tag
  const filteredImages = useMemo(() => {
    if (activeTag === "all") return initialImages;
    return initialImages.filter((img) => img.tag?.slug === activeTag);
  }, [initialImages, activeTag]);

  // Get lightbox images URLs
  const lightboxImages = useMemo(
    () => filteredImages.map((img) => img.url),
    [filteredImages]
  );

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Hero background image - only use banner image, not gallery images
  const heroImage = galleryPage?.galleryBannerImage || "";
  const heroTitle = galleryPage?.galleryBannerTitle || "Photo Gallery";

  return (
    <main className="min-h-screen bg-gray-50 pt-16 xl:pt-20">
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
              Explore our beautiful homes and communities
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
      <MediaSubNav activeTab="photos" isAnimated={isAnimated} />
      <MobileMediaSubNav />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        {/* Filter Section */}
        <div
          className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 transition-all duration-500 delay-300 ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <h2 className="text-2xl font-bold text-main-primary">Browse Photos</h2>
            <p className="text-gray-500 text-sm mt-1">
              {filteredImages.length} {filteredImages.length === 1 ? "photo" : "photos"}
              {activeTag !== "all" && ` in ${tags.find((t) => t.slug === activeTag)?.name}`}
            </p>
          </div>

          {/* Tag Filters */}
          {tags.length > 0 && (
            <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              <TagFilters
                tags={tags}
                activeTag={activeTag}
                onTagChange={setActiveTag}
              />
            </div>
          )}
        </div>

        {/* Active Filter Tag */}
        {activeTag !== "all" && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Filtered by:</span>
            <button
              onClick={() => setActiveTag("all")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/10 text-main-primary text-sm rounded-full hover:bg-main-primary/20 transition-colors"
            >
              {tags.find((t) => t.slug === activeTag)?.name}
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        <div
          className={`transition-all duration-500 delay-400 ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <GalleryGrid
            images={filteredImages}
            onImageClick={handleImageClick}
            animationKey={activeTag}
          />
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        initialIndex={lightboxIndex}
        title="Photo Gallery"
      />
    </main>
  );
}
