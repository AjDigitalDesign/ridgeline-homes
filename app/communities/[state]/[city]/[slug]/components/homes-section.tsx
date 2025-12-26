"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, Calendar, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { getHomeStatusBadge } from "@/lib/home-status";

// Simplified home type that works with embedded community homes
export interface CommunityHome {
  id: string;
  name: string;
  slug: string;
  lotNumber?: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  garages?: number | null;
  stories?: number | null;
  status: string;
  gallery: string[];
  openHouseDate?: string | null;
  city?: string | null;
  state?: string | null;
  street?: string | null;
  address?: string | null;
  zipCode?: string | null;
  marketingHeadline?: string | null;
  showMarketingHeadline?: boolean;
  community?: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    state: string | null;
  } | null;
  floorplan?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface HomesSectionProps {
  homes: CommunityHome[];
  communitySlug?: string;
  onScheduleTour?: (homeId: string, homeName: string) => void;
}

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function calculateMonthlyPayment(price: number): string {
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthlyInterest = 0.07 / 12;
  const numberOfPayments = 30 * 12;
  const monthlyPayment =
    (loanAmount *
      (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments))) /
    (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthlyPayment);
}


function getHomeUrl(home: CommunityHome): string {
  // Build URL based on community context
  if (home.community) {
    const state =
      home.community.state?.toLowerCase().replace(/\s+/g, "-") || "md";
    const city =
      home.community.city?.toLowerCase().replace(/\s+/g, "-") || "unknown";
    return `/homes/${state}/${city}/${home.community.slug}/${home.slug}`;
  }
  // Fallback to simple slug-based URL
  return `/homes/${home.slug}`;
}

interface HomeCardProps {
  home: CommunityHome;
  onOpenGallery: (images: string[], title: string) => void;
  onScheduleTour?: (homeId: string, homeName: string) => void;
  onOpenCalculator?: (price: number, name: string) => void;
}

function HomeCard({ home, onOpenGallery, onScheduleTour, onOpenCalculator }: HomeCardProps) {
  const image = home.gallery?.[0] || "";
  const photoCount = home.gallery?.length || 0;
  const location = [home.city, `${home.state} ${home.zipCode || ""}`]
    .filter(Boolean)
    .join(", ");
  const status = getHomeStatusBadge(home.status);
  const homeUrl = getHomeUrl(home);

  const handlePhotosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (home.gallery && home.gallery.length > 0) {
      onOpenGallery(home.gallery, `${home.street || home.name} Gallery`);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={home.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Favorite Button */}
        <FavoriteButton
          type="home"
          itemId={home.id}
          className="absolute top-4 right-4"
        />

        {/* Bottom overlay with photos and map buttons */}
        <div className={`absolute left-4 right-4 flex items-center gap-2 ${
          home.marketingHeadline && home.showMarketingHeadline ? "bottom-12" : "bottom-4"
        }`}>
          {photoCount > 0 && (
            <button
              onClick={handlePhotosClick}
              className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white rounded-full text-xs font-semibold text-main-primary transition-colors"
            >
              {photoCount} Photos
              <Camera className="size-4" />
            </button>
          )}
          <button className="flex items-center justify-center size-9 bg-main-secondary hover:bg-main-secondary/90 rounded-full transition-colors">
            <MapPin className="size-4 text-main-primary" />
          </button>
        </div>

        {/* Marketing Headline Banner */}
        {home.marketingHeadline && home.showMarketingHeadline && (
          <div className="absolute bottom-0 left-0 right-0 bg-main-secondary px-4 py-2">
            <p className="text-sm font-medium text-main-primary truncate">
              {home.marketingHeadline}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Address & Price Row */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-main-primary group-hover:text-main-primary/80 transition-colors">
              {home.street || home.address || home.name}
            </h3>
            {location && (
              <p className="text-sm text-main-primary">{location}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-main-primary">
              {formatPrice(home.price)}
            </p>
            {home.price && (
              <button
                onClick={() => onOpenCalculator?.(home.price!, home.street || home.name)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-main-primary transition-colors"
              >
                <span>{calculateMonthlyPayment(home.price)}/mo</span>
                <Calculator className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-1 py-4 border-b border-gray-100">
          {home.bedrooms && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {home.bedrooms}
              </p>
              <p className="text-xs text-gray-500">Beds</p>
            </div>
          )}
          {home.bathrooms && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {home.bathrooms}
              </p>
              <p className="text-xs text-gray-500">Baths</p>
            </div>
          )}
          {home.squareFeet && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {home.squareFeet.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Sq Ft</p>
            </div>
          )}
          {home.garages && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">
                {home.garages}-Car
              </p>
              <p className="text-xs text-gray-500">Garage</p>
            </div>
          )}
          {home.stories && (
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-main-primary">
                {home.stories}
              </p>
              <p className="text-xs text-gray-500">Stories</p>
            </div>
          )}
        </div>

        {/* Floor Plan */}
        {home.floorplan && (
          <div className="py-4 text-sm">
            <p className="text-gray-500">Floor Plan</p>
            <Link
              href={`/plans/${home.floorplan.slug}`}
              className="font-semibold text-main-secondary hover:underline"
            >
              {home.floorplan.name}
            </Link>
          </div>
        )}

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onScheduleTour?.(home.id, home.street || home.name)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-main-secondary text-main-primary text-sm font-semibold rounded-full hover:bg-main-secondary/90 transition-colors"
          >
            Schedule Tour
            <Calendar className="size-4" />
          </button>
          <Link
            href={homeUrl}
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

const INITIAL_HOMES_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function HomesSection({
  homes,
  onScheduleTour,
}: HomesSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorPrice, setCalculatorPrice] = useState(400000);
  const [calculatorPropertyName, setCalculatorPropertyName] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_HOMES_COUNT);

  const displayedHomes = homes.slice(0, visibleCount);
  const hasMore = visibleCount < homes.length;
  const remainingCount = homes.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, homes.length));
  };

  const handleOpenGallery = (images: string[], title: string) => {
    setLightboxImages(images);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  const handleOpenCalculator = (price: number, name: string) => {
    setCalculatorPrice(price);
    setCalculatorPropertyName(name);
    setCalculatorOpen(true);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
          Quick Move-In Homes
        </h2>
        <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
      </div>

      {/* Homes Grid */}
      <div
        className={`grid gap-6 ${
          displayedHomes.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : displayedHomes.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {displayedHomes.map((home) => (
          <HomeCard
            key={home.id}
            home={home}
            onOpenGallery={handleOpenGallery}
            onScheduleTour={onScheduleTour}
            onOpenCalculator={handleOpenCalculator}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore}>
            Load More ({remainingCount} remaining)
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={0}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={lightboxTitle}
      />

      {/* Mortgage Calculator Modal */}
      <MortgageCalculator
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        initialPrice={calculatorPrice}
        propertyName={calculatorPropertyName}
      />
    </div>
  );
}
