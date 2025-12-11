"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, ZoomIn } from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";
import type { Home } from "@/lib/api";

interface FloorplanSectionProps {
  home: Home;
}

export default function FloorplanSection({ home }: FloorplanSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const planImages = home.floorPlanGallery || [];
  const floorplanName = home.floorplan?.name || "Floor Plan";

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
          Floor Plan
        </h2>
        {home.floorplan?.name && (
          <p className="text-gray-600 mt-2">The {home.floorplan.name}</p>
        )}
        <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
      </div>

      {/* Plan Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planImages.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <Image
              src={image}
              alt={`${floorplanName} ${index + 1}`}
              fill
              className="object-contain p-4"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 shadow-lg">
                <ZoomIn className="size-6 text-main-primary" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Floor Plan Link */}
      {home.interactiveFloorPlanUrl && (
        <div className="mt-6 text-center">
          <a
            href={home.interactiveFloorPlanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-main-secondary text-main-primary font-semibold rounded-lg hover:bg-main-secondary/80 transition-colors"
          >
            <ExternalLink className="size-5" />
            View Interactive Floor Plan
          </a>
        </div>
      )}

      {/* Lightbox for Plan Images */}
      <Lightbox
        images={planImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={floorplanName}
      />
    </div>
  );
}
