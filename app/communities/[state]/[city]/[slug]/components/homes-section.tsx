"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, Calendar, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Home } from "@/lib/api";

interface HomesSectionProps {
  homes: Home[];
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

function getStatusBadge(status: string) {
  switch (status) {
    case "AVAILABLE":
      return { label: "Active", className: "bg-main-secondary text-main-primary" };
    case "UNDER_CONSTRUCTION":
      return { label: "Under Construction", className: "bg-gray-600 text-white" };
    case "SOLD":
      return { label: "Sold", className: "bg-gray-400 text-white" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-800" };
  }
}

function HomeCard({ home }: { home: Home }) {
  const image = home.gallery?.[0] || "";
  const photoCount = home.gallery?.length || 0;
  const location = [home.city, `${home.state} ${home.zipCode || ""}`]
    .filter(Boolean)
    .join(", ");
  const status = getStatusBadge(home.status);

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
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <span
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Bottom overlay with photos and map buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          {photoCount > 0 && (
            <button className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white rounded-full text-xs font-semibold text-main-primary transition-colors">
              {photoCount} Photos
              <Camera className="size-4" />
            </button>
          )}
          <button className="flex items-center justify-center size-9 bg-main-secondary hover:bg-main-secondary/90 rounded-full transition-colors">
            <MapPin className="size-4 text-main-primary" />
          </button>
        </div>
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
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>{calculateMonthlyPayment(home.price)}/mo</span>
                <Calculator className="size-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-1 py-4 border-b border-gray-100">
          {home.bedrooms && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">{home.bedrooms}</p>
              <p className="text-xs text-gray-500">Beds</p>
            </div>
          )}
          {home.bathrooms && (
            <div className="flex-1 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-lg font-bold text-main-primary">{home.bathrooms}</p>
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
              <p className="text-lg font-bold text-main-primary">{home.garages}-Car</p>
              <p className="text-xs text-gray-500">Garage</p>
            </div>
          )}
          {home.stories && (
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-main-primary">{home.stories}</p>
              <p className="text-xs text-gray-500">Stories</p>
            </div>
          )}
        </div>

        {/* Community & Floor Plan */}
        <div className="flex items-start justify-between gap-4 py-4 text-sm">
          <div>
            <p className="text-gray-500">Community</p>
            <p className="font-semibold text-main-secondary">
              {home.community?.name || "—"}
            </p>
          </div>
          {home.floorplan && (
            <div className="text-right">
              <p className="text-gray-500">Floor Plan</p>
              <p className="font-semibold text-main-secondary">
                {home.floorplan.name}
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href={`/homes/${home.slug}?schedule=true`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-main-secondary text-main-primary text-sm font-semibold rounded-full hover:bg-main-secondary/90 transition-colors"
          >
            Schedule Tour
            <Calendar className="size-4" />
          </Link>
          <Link
            href={`/homes/${home.slug}`}
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

export default function HomesSection({ homes, communitySlug }: HomesSectionProps) {
  const displayedHomes = homes.slice(0, 6);
  const hasMore = homes.length > 6;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedHomes.map((home) => (
          <HomeCard key={home.id} home={home} />
        ))}
      </div>

      {/* View All Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={`/homes?community=${communitySlug}`}>
              View All {homes.length} Homes
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
