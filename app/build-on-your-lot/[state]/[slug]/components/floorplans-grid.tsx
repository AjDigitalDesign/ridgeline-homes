"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, Bed, Bath, Ruler, Car } from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";
import type { BOYLFloorplan } from "@/lib/api";

interface FloorplansGridProps {
  floorplans: BOYLFloorplan[];
}

function formatPrice(price: number | null | undefined) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

interface FloorplanCardProps {
  floorplan: BOYLFloorplan;
  onOpenGallery: (images: string[], title: string) => void;
}

function FloorplanCard({ floorplan, onOpenGallery }: FloorplanCardProps) {
  const image = floorplan.elevationGallery?.[0] || floorplan.gallery?.[0] || "";
  const allImages = [
    ...(floorplan.elevationGallery || []),
    ...(floorplan.gallery || []),
  ];
  const photoCount = allImages.length;

  const handlePhotosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (allImages.length > 0) {
      onOpenGallery(allImages, `${floorplan.name} Gallery`);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={floorplan.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Bottom overlay with photos button */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          {photoCount > 0 && (
            <button
              onClick={handlePhotosClick}
              className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white rounded-full text-xs font-semibold text-main-primary transition-colors"
            >
              {photoCount} Photos
              <Camera className="size-4" />
            </button>
          )}

          {floorplan.virtualTourUrl && (
            <Link
              href={floorplan.virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-main-secondary text-main-primary text-xs font-semibold rounded-full hover:bg-main-secondary/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Virtual Tour
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name & Price Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-main-primary group-hover:text-main-primary/80 transition-colors">
              {floorplan.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm text-gray-500">Starting at</p>
            <p className="text-xl font-bold text-main-primary">
              {formatPrice(floorplan.price)}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-100">
          {floorplan.bedrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bed className="size-4" />
              <span className="text-sm font-medium">{floorplan.bedrooms} Beds</span>
            </div>
          )}
          {floorplan.bathrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bath className="size-4" />
              <span className="text-sm font-medium">{floorplan.bathrooms} Baths</span>
            </div>
          )}
          {floorplan.sqft && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Ruler className="size-4" />
              <span className="text-sm font-medium">{floorplan.sqft.toLocaleString()} Sq Ft</span>
            </div>
          )}
          {floorplan.garages && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Car className="size-4" />
              <span className="text-sm font-medium">{floorplan.garages}-Car</span>
            </div>
          )}
        </div>

        {/* Description */}
        {floorplan.description && (
          <p className="text-gray-600 text-sm mt-4 line-clamp-2">
            {floorplan.description}
          </p>
        )}

        {/* CTA */}
        <div className="mt-4">
          <Link
            href={`/plans/${floorplan.slug}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-main-primary text-white text-sm font-semibold rounded-full hover:bg-main-primary/90 transition-colors"
          >
            View Details
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FloorplansGrid({ floorplans }: FloorplansGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState("");

  const handleOpenGallery = (images: string[], title: string) => {
    setLightboxImages(images);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  if (floorplans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No floor plans available for this location.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
            Available Floor Plans
          </h2>
          <p className="text-gray-600 mt-2">
            Choose from {floorplans.length} floor plan{floorplans.length !== 1 ? "s" : ""} available for your lot
          </p>
          <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div
          className={`grid gap-6 ${
            floorplans.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : floorplans.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {floorplans.map((floorplan) => (
            <FloorplanCard
              key={floorplan.floorplanId}
              floorplan={floorplan}
              onOpenGallery={handleOpenGallery}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={0}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={lightboxTitle}
      />
    </div>
  );
}
