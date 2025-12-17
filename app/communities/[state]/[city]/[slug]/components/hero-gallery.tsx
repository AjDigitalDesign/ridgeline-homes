"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

interface HeroGalleryProps {
  gallery: string[];
  communityName: string;
  onOpenGallery: (index: number) => void;
}

export default function HeroGallery({
  gallery,
  communityName,
  onOpenGallery,
}: HeroGalleryProps) {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="w-full h-[300px] lg:h-[500px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Get up to 5 images for the grid (1 main + 4 thumbnails)
  const mainImage = gallery[0];
  const thumbnails = gallery.slice(1, 5);
  const remainingCount = gallery.length - 5;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3 h-[300px] lg:h-[500px]">
        {/* Main Large Image - Left Side */}
        <button
          onClick={() => onOpenGallery(0)}
          className="relative lg:col-span-2 overflow-hidden rounded-lg lg:rounded-xs group"
        >
          <Image
            src={mainImage}
            alt={`${communityName} - Main`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Right Side - 2x2 Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-2 lg:gap-3">
          {thumbnails.map((image, index) => (
            <button
              key={index}
              onClick={() => onOpenGallery(index + 1)}
              className="relative overflow-hidden rounded-xs lg:rounded-xs group"
            >
              <Image
                src={image}
                alt={`${communityName} - Image ${index + 2}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Show remaining count overlay on last thumbnail */}
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="size-6 mx-auto mb-1" />
                    <p className="text-sm font-semibold">
                      +{remainingCount} more
                    </p>
                  </div>
                </div>
              )}
            </button>
          ))}

          {/* Fill empty slots if less than 4 thumbnails */}
          {thumbnails.length < 4 &&
            Array.from({ length: 4 - thumbnails.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-100 rounded-lg lg:rounded-xl"
              />
            ))}
        </div>
      </div>

      {/* Photos Button - Positioned bottom right on mobile, absolute on desktop */}
      <button
        onClick={() => onOpenGallery(0)}
        className="mt-3 lg:mt-0 lg:absolute lg:bottom-6 lg:right-6 inline-flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg transition-colors z-10"
      >
        <Camera className="size-4 text-main-primary" />
        <span className="text-sm font-medium text-main-primary">
          {gallery.length} Photos
        </span>
      </button>
    </div>
  );
}
