"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface GallerySectionProps {
  gallery: string[];
  homeName: string;
  onOpenGallery: (index: number) => void;
}

export default function GallerySection({
  gallery,
  homeName,
  onOpenGallery,
}: GallerySectionProps) {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
          Photo Gallery
        </h2>
        <p className="text-gray-600 mt-2">{gallery.length} Photos</p>
        <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((image, index) => (
          <button
            key={index}
            onClick={() => onOpenGallery(index)}
            className="group relative aspect-4/3 rounded-xl overflow-hidden"
          >
            <Image
              src={image}
              alt={`${homeName} - Photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg">
                <ZoomIn className="size-5 text-main-primary" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
