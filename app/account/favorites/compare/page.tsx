"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Bed, Bath, Square, Car, Home, Loader2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { Favorite } from "@/lib/api";

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

// Star rating display
function StarRating({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= rating
              ? "fill-main-secondary text-main-secondary"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// Compare Card Component
function CompareCard({ favorite }: { favorite: Favorite }) {
  const home = favorite.home;
  if (!home) return null;

  const image = home.gallery?.[0] || "";
  const communityName = home.community?.name || "";
  const location = `${home.city || ""} ${home.state || ""}`.trim();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border flex-1 min-w-[300px]">
      {/* Image */}
      <div className="relative h-48">
        {image ? (
          <Image src={image} alt={home.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="size-12 text-gray-400" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-main-secondary text-main-primary text-xs font-semibold rounded-full">
            Available Homes For Sale
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-main-primary text-lg">{home.name}</h3>
          <span className="font-bold text-main-primary shrink-0">
            {formatPrice(home.price)}
          </span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-600">{communityName}</p>
        <p className="text-sm text-gray-500">{location}</p>

        {/* Rating */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Your Rating:</p>
          <StarRating />
        </div>

        {/* Created date */}
        <p className="text-xs text-gray-400 mt-2">
          Created {new Date(favorite.createdAt).toLocaleDateString()} at Marketplace
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
          {home.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="size-4" />
              <span>{home.bedrooms}</span>
            </div>
          )}
          {home.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="size-4" />
              <span>{home.bathrooms}</span>
            </div>
          )}
          {home.squareFeet && (
            <div className="flex items-center gap-1.5">
              <Square className="size-4" />
              <span>{home.squareFeet.toLocaleString()}</span>
            </div>
          )}
          {home.garages && (
            <div className="flex items-center gap-1.5">
              <Car className="size-4" />
              <span>{home.garages}</span>
            </div>
          )}
        </div>

        {/* Comparison Details */}
        <div className="mt-4 pt-4 border-t space-y-4">
          <div>
            <h4 className="font-semibold text-main-primary mb-2">Exterior</h4>
            <p className="text-sm text-gray-500">No Exterior Selected</p>
          </div>

          <div>
            <h4 className="font-semibold text-main-primary mb-2">Floorplan</h4>
            <p className="text-sm text-gray-500">
              {home.floorplan?.name || "No Floorplan Selected"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-main-primary mb-2">Interior</h4>
            <p className="text-sm text-gray-500">No Interior Selected</p>
          </div>

          <div>
            <h4 className="font-semibold text-main-primary mb-2">Homesite</h4>
            <p className="text-sm text-gray-500">
              {home.lotNumber ? `Lot ${home.lotNumber}` : "No Homesite Selected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompareFavoritesPage() {
  const { data: favorites, isLoading } = useFavorites("home");
  const homeFavorites = favorites?.filter((f) => f.type === "home") || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-main-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/account/favorites"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="size-5 text-main-primary" />
        </Link>
        <h1 className="text-3xl lg:text-4xl font-bold text-main-primary italic">
          Compare Favorites
        </h1>
      </div>

      {/* Compare Grid */}
      {homeFavorites.length === 0 ? (
        <div className="text-center py-20">
          <Home className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No homes to compare
          </h3>
          <p className="text-gray-500">
            Save some homes to your favorites first, then come back to compare them.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {homeFavorites.slice(0, 4).map((favorite) => (
              <CompareCard key={favorite.id} favorite={favorite} />
            ))}
          </div>
        </div>
      )}

      {homeFavorites.length > 4 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing first 4 homes. Remove some favorites to compare others.
        </p>
      )}
    </div>
  );
}
