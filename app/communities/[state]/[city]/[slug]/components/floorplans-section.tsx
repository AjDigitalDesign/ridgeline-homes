"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Floorplan } from "@/lib/api";

interface FloorplansSectionProps {
  floorplans: Floorplan[];
  communitySlug: string;
}

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function FloorplanCard({ floorplan }: { floorplan: Floorplan }) {
  const image = floorplan.elevationGallery?.[0] || floorplan.gallery?.[0] || "";
  const photoCount =
    (floorplan.elevationGallery?.length || 0) + (floorplan.gallery?.length || 0);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
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

        {/* Marketing Headline Badge */}
        {floorplan.marketingHeadline && floorplan.showMarketingHeadline && (
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-main-secondary text-main-primary">
              {floorplan.marketingHeadline}
            </span>
          </div>
        )}

        {/* Bottom overlay with photos button */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center">
          {photoCount > 0 && (
            <button className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white rounded-full text-xs font-semibold text-main-primary transition-colors">
              {photoCount} Photos
              <Camera className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name & Price Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <p className="text-sm text-gray-500">The</p>
            <h3 className="text-xl font-bold text-main-primary group-hover:text-main-primary/80 transition-colors">
              {floorplan.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm text-gray-500">Priced From</p>
            <p className="text-xl font-bold text-main-primary">
              {formatPrice(floorplan.basePrice)}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-1 py-4 border-b border-gray-100">
          {floorplan.baseBedrooms && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {floorplan.baseBedrooms}
              </p>
              <p className="text-xs text-gray-500">Beds</p>
            </div>
          )}
          {floorplan.baseBathrooms && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {floorplan.baseBathrooms}
              </p>
              <p className="text-xs text-gray-500">Baths</p>
            </div>
          )}
          {floorplan.baseSquareFeet && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {floorplan.baseSquareFeet.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Sq Ft</p>
            </div>
          )}
          {floorplan.baseGarages && (
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-main-primary">
                {floorplan.baseGarages}-Car
              </p>
              <p className="text-xs text-gray-500">Garage</p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 pt-4">
          {floorplan.virtualTourUrl ? (
            <Link
              href={floorplan.virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-main-secondary text-main-primary text-sm font-semibold rounded-full hover:bg-main-secondary/90 transition-colors"
            >
              Virtual Tour
              <Calendar className="size-4" />
            </Link>
          ) : (
            <Link
              href={`/plans/${floorplan.slug}?schedule=true`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-main-secondary text-main-primary text-sm font-semibold rounded-full hover:bg-main-secondary/90 transition-colors"
            >
              Virtual Tour
              <Calendar className="size-4" />
            </Link>
          )}
          <Link
            href={`/plans/${floorplan.slug}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-main-primary text-white text-sm font-semibold rounded-full hover:bg-main-primary/90 transition-colors"
          >
            Detail
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FloorplansSection({
  floorplans,
  communitySlug,
}: FloorplansSectionProps) {
  const displayedFloorplans = floorplans.slice(0, 6);
  const hasMore = floorplans.length > 6;

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
          Available Floor Plans
        </h2>
        <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
      </div>

      {/* Floorplans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedFloorplans.map((floorplan) => (
          <FloorplanCard key={floorplan.id} floorplan={floorplan} />
        ))}
      </div>

      {/* View All Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={`/plans?community=${communitySlug}`}>
              View All {floorplans.length} Floor Plans
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
