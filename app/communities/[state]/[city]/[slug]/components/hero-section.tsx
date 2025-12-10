"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Camera,
  Share2,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import type { Community } from "@/lib/api";

interface HeroSectionProps {
  community: Community;
  onScheduleTour: () => void;
  onOpenGallery: () => void;
}

function formatPrice(price: number | null) {
  if (!price) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function HeroSection({
  community,
  onScheduleTour,
  onOpenGallery,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const gallery = community.gallery || [];
  const hasMultipleImages = gallery.length > 1;

  const location = [community.city, community.state].filter(Boolean).join(", ");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleShare = async () => {
    const shareData = {
      title: community.name,
      text: `Check out ${community.name} - new homes in ${location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const getDirectionsUrl = () => {
    if (community.latitude && community.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${community.latitude},${community.longitude}`;
    }
    const address = [
      community.address,
      community.city,
      community.state,
      community.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
      {/* Background Image */}
      {gallery.length > 0 && (
        <Image
          src={gallery[currentImageIndex]}
          alt={community.name}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Top Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={handleShare}
          className="flex items-center justify-center size-10 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
          title="Share"
        >
          <Share2 className="size-5 text-main-primary" />
        </button>
        <FavoriteButton
          type="community"
          itemId={community.id}
          size="lg"
        />
      </div>

      {/* Image Navigation */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors z-10"
          >
            <ChevronLeft className="size-6 text-main-primary" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors z-10"
          >
            <ChevronRight className="size-6 text-main-primary" />
          </button>
        </>
      )}

      {/* Gallery Button */}
      {gallery.length > 0 && (
        <button
          onClick={onOpenGallery}
          className="absolute bottom-24 lg:bottom-28 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors z-10"
        >
          <Camera className="size-4 text-main-primary" />
          <span className="text-sm font-medium text-main-primary">
            {gallery.length} Photos
          </span>
        </button>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 z-10">
        <div className="container mx-auto lg:px-10 xl:px-20 2xl:px-24">
          {/* Marketing Headline */}
          {community.marketingHeadline && community.showMarketingHeadline && (
            <div className="inline-block px-4 py-1.5 bg-main-secondary text-main-primary text-sm font-medium rounded-full mb-3">
              {community.marketingHeadline}
            </div>
          )}

          {/* Title & Location */}
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">
            {community.name}
          </h1>
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <MapPin className="size-4" />
            <span>{location}</span>
          </div>

          {/* Price & Stats */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
            {community.priceMin && (
              <div className="text-white">
                <span className="text-sm text-white/80">Starting From</span>
                <p className="text-2xl lg:text-3xl font-bold">
                  {formatPrice(community.priceMin)}
                </p>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-4 text-white/90">
              {community.bedsMin && (
                <div className="text-center px-4 border-l border-white/30">
                  <p className="text-lg font-semibold">
                    {community.bedsMin}
                    {community.bedsMax && community.bedsMax !== community.bedsMin
                      ? `-${community.bedsMax}`
                      : "+"}
                  </p>
                  <p className="text-sm text-white/70">Beds</p>
                </div>
              )}
              {community.bathsMin && (
                <div className="text-center px-4 border-l border-white/30">
                  <p className="text-lg font-semibold">
                    {community.bathsMin}
                    {community.bathsMax && community.bathsMax !== community.bathsMin
                      ? `-${community.bathsMax}`
                      : "+"}
                  </p>
                  <p className="text-sm text-white/70">Baths</p>
                </div>
              )}
              {community.sqftMin && (
                <div className="text-center px-4 border-l border-white/30">
                  <p className="text-lg font-semibold">
                    {community.sqftMin.toLocaleString()}+
                  </p>
                  <p className="text-sm text-white/70">Sq Ft</p>
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={onScheduleTour}
              className="bg-main-secondary text-main-primary hover:bg-main-secondary/90"
            >
              <Calendar className="size-4 mr-2" />
              Schedule a Tour
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-main-primary"
            >
              <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
                <Navigation className="size-4 mr-2" />
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {gallery.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`size-2 rounded-full transition-colors ${
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
          {gallery.length > 5 && (
            <span className="text-xs text-white/80 ml-1">+{gallery.length - 5}</span>
          )}
        </div>
      )}
    </section>
  );
}
