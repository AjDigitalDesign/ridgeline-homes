"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Home,
  Send,
  BookOpen,
  Phone,
  Star,
  Bed,
  Bath,
  Square,
  Car,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, useRemoveFavorite } from "@/hooks/use-favorites";
import type { Favorite, FavoriteType } from "@/lib/api";

type TabType = "homes" | "floorplans" | "communities";

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

// Rating component
function StarRating({ rating = 0, onChange }: { rating?: number; onChange?: (rating: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className="text-gray-300 hover:text-main-secondary transition-colors"
        >
          <Star
            className={`size-5 ${star <= rating ? "fill-main-secondary text-main-secondary" : ""}`}
          />
        </button>
      ))}
    </div>
  );
}

// Home Favorite Card
function HomeFavoriteCard({ favorite, onRemove }: { favorite: Favorite; onRemove: () => void }) {
  const home = favorite.home;
  if (!home) return null;

  const image = home.gallery?.[0] || "";
  const location = [home.community?.name, `${home.city} ${home.state}`].filter(Boolean).join("\n");

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
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
            {home.status === "AVAILABLE" ? "Available Homes For Sale" : home.status}
          </span>
        </div>
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 rounded-full transition-colors group"
        >
          <Trash2 className="size-4 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-main-primary">{home.name}</h3>
          <span className="font-bold text-main-primary shrink-0">
            {formatPrice(home.price)}
          </span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-500 whitespace-pre-line">{location}</p>

        {/* Rating */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Your Rating:</p>
          <StarRating />
        </div>

        {/* Created date */}
        <p className="text-xs text-gray-400 mt-2">
          Created {new Date(favorite.createdAt).toLocaleDateString()}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
          {home.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="size-4" />
              {home.bedrooms}
            </div>
          )}
          {home.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="size-4" />
              {home.bathrooms}
            </div>
          )}
          {home.squareFeet && (
            <div className="flex items-center gap-1">
              <Square className="size-4" />
              {home.squareFeet.toLocaleString()}
            </div>
          )}
          {home.garages && (
            <div className="flex items-center gap-1">
              <Car className="size-4" />
              {home.garages}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <Link
              href={`/homes/${home.slug}`}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors"
            >
              <Home className="size-5" />
              <span className="text-xs">Info</span>
            </Link>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors">
              <Send className="size-5" />
              <span className="text-xs">Send</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors">
              <BookOpen className="size-5" />
              <span className="text-xs">Brochure</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors">
              <Phone className="size-5" />
              <span className="text-xs">Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floorplan Favorite Card
function FloorplanFavoriteCard({ favorite, onRemove }: { favorite: Favorite; onRemove: () => void }) {
  const floorplan = favorite.floorplan;
  if (!floorplan) return null;

  const image = floorplan.gallery?.[0] || floorplan.elevationGallery?.[0] || "";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
      {/* Image */}
      <div className="relative h-48">
        {image ? (
          <Image src={image} alt={floorplan.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="size-12 text-gray-400" />
          </div>
        )}
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 rounded-full transition-colors group"
        >
          <Trash2 className="size-4 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-main-primary">{floorplan.name}</h3>
          <span className="font-bold text-main-primary shrink-0">
            {formatPrice(floorplan.basePrice)}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Your Rating:</p>
          <StarRating />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
          {floorplan.baseBedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="size-4" />
              {floorplan.baseBedrooms}
            </div>
          )}
          {floorplan.baseBathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="size-4" />
              {floorplan.baseBathrooms}
            </div>
          )}
          {floorplan.baseSquareFeet && (
            <div className="flex items-center gap-1">
              <Square className="size-4" />
              {floorplan.baseSquareFeet.toLocaleString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <Link
              href={`/floorplans/${floorplan.slug}`}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors"
            >
              <Home className="size-5" />
              <span className="text-xs">Info</span>
            </Link>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors">
              <Send className="size-5" />
              <span className="text-xs">Send</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors">
              <BookOpen className="size-5" />
              <span className="text-xs">Brochure</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-main-primary transition-colors">
              <Phone className="size-5" />
              <span className="text-xs">Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Community Favorite Card
function CommunityFavoriteCard({ favorite, onRemove }: { favorite: Favorite; onRemove: () => void }) {
  const community = favorite.community;
  if (!community) return null;

  const image = community.gallery?.[0] || "";
  const location = [community.city, community.state].filter(Boolean).join(", ");

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
      {/* Image */}
      <div className="relative h-48">
        {image ? (
          <Image src={image} alt={community.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="size-12 text-gray-400" />
          </div>
        )}
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 rounded-full transition-colors group"
        >
          <Trash2 className="size-4 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-main-primary">{community.name}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <span className="font-bold text-main-primary shrink-0">
            {community.priceMin ? `${formatPrice(community.priceMin)}+` : "Contact Us"}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
          {community.bedsMin && (
            <div className="flex items-center gap-1">
              <Bed className="size-4" />
              {community.bedsMin}-{community.bedsMax || community.bedsMin}
            </div>
          )}
          {community.bathsMin && (
            <div className="flex items-center gap-1">
              <Bath className="size-4" />
              {community.bathsMin}-{community.bathsMax || community.bathsMin}
            </div>
          )}
          {community.sqftMin && (
            <div className="flex items-center gap-1">
              <Square className="size-4" />
              {community.sqftMin.toLocaleString()}+
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t">
          <Button asChild className="w-full bg-main-primary">
            <Link href={`/communities/${community.slug}`}>View Community</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("homes");
  const { data: favoritesData, isLoading } = useFavorites();
  const removeFavoriteMutation = useRemoveFavorite();

  // Ensure favorites is always an array
  const favorites = Array.isArray(favoritesData) ? favoritesData : [];

  // Filter favorites by type (case-insensitive)
  const homeFavorites = favorites.filter((f) => f.type?.toLowerCase() === "home");
  const floorplanFavorites = favorites.filter((f) => f.type?.toLowerCase() === "floorplan");
  const communityFavorites = favorites.filter((f) => f.type?.toLowerCase() === "community");

  const handleRemove = (type: FavoriteType, itemId: string) => {
    removeFavoriteMutation.mutate({ type, itemId });
  };

  const tabs = [
    { id: "homes" as TabType, label: "HOMES", count: homeFavorites.length },
    { id: "floorplans" as TabType, label: "PLANS", count: floorplanFavorites.length },
    { id: "communities" as TabType, label: "COMMUNITIES", count: communityFavorites.length },
  ];

  const getCurrentFavorites = () => {
    switch (activeTab) {
      case "homes":
        return homeFavorites;
      case "floorplans":
        return floorplanFavorites;
      case "communities":
        return communityFavorites;
      default:
        return [];
    }
  };

  const currentFavorites = getCurrentFavorites();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? "border-main-primary text-main-primary"
                    : "border-transparent text-gray-500 hover:text-main-primary"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {currentFavorites.length > 1 && (
          <Button asChild variant="outline" className="border-main-primary text-main-primary">
            <Link href="/account/favorites/compare">COMPARE</Link>
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-main-primary" />
        </div>
      ) : currentFavorites.length === 0 ? (
        <div className="text-center py-20">
          <Home className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No {activeTab} saved yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start exploring and save your favorite {activeTab} to compare later.
          </p>
          <Button asChild className="bg-main-primary">
            <Link href={activeTab === "communities" ? "/communities" : activeTab === "floorplans" ? "/floorplans" : "/homes"}>
              Browse {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === "homes" &&
            homeFavorites.map((favorite) => (
              <HomeFavoriteCard
                key={favorite.id}
                favorite={favorite}
                onRemove={() => handleRemove("home", favorite.homeId!)}
              />
            ))}
          {activeTab === "floorplans" &&
            floorplanFavorites.map((favorite) => (
              <FloorplanFavoriteCard
                key={favorite.id}
                favorite={favorite}
                onRemove={() => handleRemove("floorplan", favorite.floorplanId!)}
              />
            ))}
          {activeTab === "communities" &&
            communityFavorites.map((favorite) => (
              <CommunityFavoriteCard
                key={favorite.id}
                favorite={favorite}
                onRemove={() => handleRemove("community", favorite.communityId!)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
