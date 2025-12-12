"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  Camera,
  MapPin,
  ArrowRight,
  Calendar,
  Share2,
  Bed,
  Bath,
  Square,
  Car,
  Layers,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lightbox } from "@/components/ui/lightbox";
import { FavoriteButton } from "@/components/ui/favorite-button";
import type { Floorplan, Community, ListingSettings } from "@/lib/api";
import { getStateSlug, getCitySlug } from "@/lib/url";

interface PlansPageClientProps {
  initialFloorplans: Floorplan[];
  communities: Community[];
  listingSettings: ListingSettings | null;
}

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under $300,000", min: 0, max: 300000 },
  { label: "$300,000 - $400,000", min: 300000, max: 400000 },
  { label: "$400,000 - $500,000", min: 400000, max: 500000 },
  { label: "$500,000 - $600,000", min: 500000, max: 600000 },
  { label: "$600,000 - $800,000", min: 600000, max: 800000 },
  { label: "$800,000+", min: 800000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Sq Ft: Low to High", value: "sqft-asc" },
  { label: "Sq Ft: High to Low", value: "sqft-desc" },
  { label: "Name A-Z", value: "name-asc" },
];

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

// Floorplan Card Component
function FloorplanCard({
  floorplan,
  communities,
}: {
  floorplan: Floorplan;
  communities: Community[];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const image = floorplan.elevationGallery?.[0] || floorplan.gallery?.[0] || "";
  const galleryImages = [
    ...(floorplan.elevationGallery || []),
    ...(floorplan.gallery || []),
    ...(floorplan.plansImages || []),
  ];

  // Get available communities for this floorplan with full community data
  const availableCommunities = floorplan.communityFloorplans?.map(cf => {
    const fullCommunity = communities.find(c => c.id === cf.community.id);
    return {
      id: cf.community.id,
      name: cf.community.name,
      slug: cf.community.slug,
      state: fullCommunity?.state || null,
      city: fullCommunity?.city || null,
    };
  }) || [];

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (galleryImages.length > 0) {
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
        {/* Image */}
        <div className="relative h-[200px] lg:h-[220px] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={floorplan.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Home className="size-12 text-gray-400" />
            </div>
          )}
          {/* Favorite Icon */}
          <FavoriteButton
            type="floorplan"
            itemId={floorplan.id}
            className="absolute top-4 right-4"
          />
          {/* Bottom Actions */}
          <div
            className={`absolute left-4 flex items-center gap-2 ${
              floorplan.marketingHeadline && floorplan.showMarketingHeadline
                ? "bottom-12"
                : "bottom-4"
            }`}
          >
            {galleryImages.length > 0 && (
              <button
                onClick={handleGalleryClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/90 hover:bg-main-primary text-white text-xs rounded-full transition-colors"
              >
                <Camera className="size-3.5" />
                {galleryImages.length} Photos
              </button>
            )}
          </div>
          {/* Marketing Headline Banner */}
          {floorplan.marketingHeadline && floorplan.showMarketingHeadline && (
            <div className="absolute bottom-0 left-0 right-0 bg-main-secondary px-4 py-2">
              <p className="text-sm font-medium text-main-primary truncate">
                {floorplan.marketingHeadline}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 lg:p-5">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-bold text-main-primary group-hover:text-main-primary/80 transition-colors truncate">
                {floorplan.name}
              </h3>
              {floorplan.modelNumber && (
                <p className="text-xs text-gray-500">Model #{floorplan.modelNumber}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-gray-500">From</p>
              <p className="text-base lg:text-lg font-bold text-main-primary">
                {formatPrice(floorplan.basePrice)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 lg:gap-4 mt-4 pt-4 border-t border-gray-100">
            {floorplan.baseBedrooms && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.baseBedrooms}
                </p>
                <p className="text-xs text-gray-500">Beds</p>
              </div>
            )}
            {floorplan.baseBathrooms && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.baseBathrooms}
                </p>
                <p className="text-xs text-gray-500">Baths</p>
              </div>
            )}
            {floorplan.baseSquareFeet && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.baseSquareFeet.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">SQ FT</p>
              </div>
            )}
            {floorplan.baseStories && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.baseStories}
                </p>
                <p className="text-xs text-gray-500">Stories</p>
              </div>
            )}
            {floorplan.baseGarages && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.baseGarages}
                </p>
                <p className="text-xs text-gray-500">Garage</p>
              </div>
            )}
          </div>

          {/* Available In Communities */}
          {availableCommunities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Select>
                <SelectTrigger className="w-full h-9 text-xs border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-gray-400" />
                    <span className="text-gray-500">Available in</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="w-full">
                  {availableCommunities.map((community) => {
                    const url = `/communities/${getStateSlug(community.state)}/${getCitySlug(community.city)}/${community.slug}`;
                    return (
                      <Link
                        key={community.id}
                        href={url}
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-main-primary transition-colors cursor-pointer"
                      >
                        <MapPin className="size-4 shrink-0 text-gray-400" />
                        <span className="truncate">{community.name}</span>
                      </Link>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3 mt-4">
            <Button
              asChild
              size="sm"
              className="flex-1 bg-main-secondary text-main-primary hover:bg-main-secondary/90 text-xs lg:text-sm"
            >
              <Link href={`/plans/${floorplan.slug}?schedule=true`}>
                <Calendar className="size-3.5 lg:size-4 mr-1" />
                Schedule Tour
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="flex-1 border-main-primary text-main-primary hover:bg-main-primary hover:text-white text-xs lg:text-sm"
            >
              <Link href={`/plans/${floorplan.slug}`}>
                View Plan
                <ArrowRight className="size-3.5 lg:size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Lightbox */}
      <Lightbox
        images={galleryImages}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={`${floorplan.name} Gallery`}
      />
    </>
  );
}

// Quick Links Navigation
function QuickLinksNav({
  activeTab,
  isAnimated,
}: {
  activeTab: string;
  isAnimated?: boolean;
}) {
  const tabs = [
    { label: "COMMUNITIES", href: "/communities", value: "communities" },
    { label: "QUICK MOVE-IN HOMES", href: "/homes", value: "homes" },
    { label: "FLOOR PLANS", href: "/plans", value: "plans" },
    { label: "BUILD ON YOUR LOT", href: "/build-on-your-lot", value: "build" },
    { label: "SPECIAL OFFERS", href: "/special-offers", value: "offers" },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center gap-2 bg-white py-4 border-b">
      {tabs.map((tab, index) => (
        <Link
          key={tab.value}
          href={tab.href}
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeTab === tab.value
              ? "bg-main-primary text-white"
              : "bg-white text-main-primary border border-gray-200 hover:border-main-primary hover:scale-105"
          } ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 50 + 300}ms` }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

// Mobile Quick Links Dropdown
function MobileQuickLinks() {
  return (
    <div className="lg:hidden bg-white border-b">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-4 text-main-primary font-semibold">
            FIND YOUR HOME MENU
            <ChevronDown className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Find Your Home</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 py-4">
            <Link
              href="/communities"
              className="px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
            >
              Communities
            </Link>
            <Link
              href="/homes"
              className="px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
            >
              Quick Move-In Homes
            </Link>
            <Link
              href="/plans"
              className="px-4 py-3 bg-main-primary text-white rounded-lg font-medium"
            >
              Floor Plans
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Filter Sheet for More Filters
function FiltersSheet({
  filters,
  onFiltersChange,
  communities,
}: {
  filters: {
    community: string;
    priceRange: number;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    stories: string;
    garages: string;
  };
  onFiltersChange: (filters: any) => void;
  communities: Community[];
}) {
  const bedroomOptions = ["any", "2", "3", "4", "5"];
  const bathroomOptions = ["any", "2", "3", "4"];
  const storiesOptions = ["any", "1", "2", "3"];
  const garagesOptions = ["any", "1", "2", "3"];
  const sqftOptions = [
    { value: "any", label: "Any" },
    { value: "1500", label: "1,500+" },
    { value: "2000", label: "2,000+" },
    { value: "2500", label: "2,500+" },
    { value: "3000", label: "3,000+" },
    { value: "3500", label: "3,500+" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-main-primary hover:border-main-primary transition-colors">
          <SlidersHorizontal className="size-4" />
          More Filters
          <ChevronDown className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>More Filters</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8 py-6">
          {/* Bedrooms */}
          <div>
            <label className="text-sm font-semibold text-main-primary mb-3 block">
              Bedrooms
            </label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    onFiltersChange({ ...filters, bedrooms: option })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.bedrooms === option
                      ? "bg-main-primary text-white"
                      : "bg-gray-100 text-main-primary hover:bg-gray-200"
                  }`}
                >
                  {option === "any" ? "Any" : `${option}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="text-sm font-semibold text-main-primary mb-3 block">
              Bathrooms
            </label>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    onFiltersChange({ ...filters, bathrooms: option })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.bathrooms === option
                      ? "bg-main-primary text-white"
                      : "bg-gray-100 text-main-primary hover:bg-gray-200"
                  }`}
                >
                  {option === "any" ? "Any" : `${option}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Square Feet */}
          <div>
            <label className="text-sm font-semibold text-main-primary mb-3 block">
              Square Feet
            </label>
            <div className="flex flex-wrap gap-2">
              {sqftOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, sqft: option.value })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.sqft === option.value
                      ? "bg-main-primary text-white"
                      : "bg-gray-100 text-main-primary hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stories */}
          <div>
            <label className="text-sm font-semibold text-main-primary mb-3 block">
              Stories
            </label>
            <div className="flex flex-wrap gap-2">
              {storiesOptions.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    onFiltersChange({ ...filters, stories: option })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.stories === option
                      ? "bg-main-primary text-white"
                      : "bg-gray-100 text-main-primary hover:bg-gray-200"
                  }`}
                >
                  {option === "any" ? "Any" : option}
                </button>
              ))}
            </div>
          </div>

          {/* Garages */}
          <div>
            <label className="text-sm font-semibold text-main-primary mb-3 block">
              Garage
            </label>
            <div className="flex flex-wrap gap-2">
              {garagesOptions.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    onFiltersChange({ ...filters, garages: option })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.garages === option
                      ? "bg-main-primary text-white"
                      : "bg-gray-100 text-main-primary hover:bg-gray-200"
                  }`}
                >
                  {option === "any" ? "Any" : `${option}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              onFiltersChange({
                community: "all",
                priceRange: 0,
                bedrooms: "any",
                bathrooms: "any",
                sqft: "any",
                stories: "any",
                garages: "any",
              })
            }
          >
            Clear All
          </Button>
          <SheetClose asChild>
            <Button className="flex-1 bg-main-primary">Apply Filters</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile Filters
function MobileFilters({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  communities,
  activeFiltersCount,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  communities: Community[];
  activeFiltersCount: number;
}) {
  return (
    <div className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-sm border-b overflow-x-auto sticky top-20 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <button className="relative flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium shrink-0">
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 size-5 bg-main-secondary text-main-primary text-xs font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <SlidersHorizontal className="size-4" />
            Filters
            <ChevronDown className="size-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 py-6">
            {/* Community */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Community
              </label>
              <Select
                value={filters.community}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, community: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Communities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
                  {communities.map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Price Range
              </label>
              <Select
                value={String(filters.priceRange)}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, priceRange: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map((range, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Bedrooms
              </label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, bedrooms: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Bathrooms
              </label>
              <Select
                value={filters.bathrooms}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, bathrooms: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Square Feet */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Square Feet
              </label>
              <Select
                value={filters.sqft}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, sqft: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1500">1,500+ SF</SelectItem>
                  <SelectItem value="2000">2,000+ SF</SelectItem>
                  <SelectItem value="2500">2,500+ SF</SelectItem>
                  <SelectItem value="3000">3,000+ SF</SelectItem>
                  <SelectItem value="3500">3,500+ SF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stories */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Stories
              </label>
              <Select
                value={filters.stories}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, stories: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1 Story</SelectItem>
                  <SelectItem value="2">2 Stories</SelectItem>
                  <SelectItem value="3">3 Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Garages */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Garage
              </label>
              <Select
                value={filters.garages}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, garages: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+ Car</SelectItem>
                  <SelectItem value="2">2+ Car</SelectItem>
                  <SelectItem value="3">3+ Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onFiltersChange({
                  community: "all",
                  priceRange: 0,
                  bedrooms: "any",
                  bathrooms: "any",
                  sqft: "any",
                  stories: "any",
                  garages: "any",
                })
              }
            >
              Clear All
            </Button>
            <SheetClose asChild>
              <Button className="flex-1 bg-main-primary">Apply Filters</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium shrink-0">
            Sort
            <ChevronDown className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                sortBy === option.value
                  ? "bg-main-primary/10 text-main-primary font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Active Filter Tags Component
function ActiveFilterTags({
  filters,
  selectedCommunity,
  onRemoveFilter,
  onClearAll,
}: {
  filters: {
    community: string;
    priceRange: number;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    stories: string;
    garages: string;
  };
  selectedCommunity: Community | null;
  onRemoveFilter: (key: string, value: any) => void;
  onClearAll: () => void;
}) {
  const activeFilters: { key: string; label: string; value: any }[] = [];

  if (filters.community !== "all" && selectedCommunity) {
    activeFilters.push({
      key: "community",
      label: selectedCommunity.name,
      value: "all",
    });
  }

  if (filters.priceRange > 0) {
    activeFilters.push({
      key: "priceRange",
      label: PRICE_RANGES[filters.priceRange].label,
      value: 0,
    });
  }

  if (filters.bedrooms !== "any") {
    activeFilters.push({
      key: "bedrooms",
      label: `${filters.bedrooms}+ Beds`,
      value: "any",
    });
  }

  if (filters.bathrooms !== "any") {
    activeFilters.push({
      key: "bathrooms",
      label: `${filters.bathrooms}+ Baths`,
      value: "any",
    });
  }

  if (filters.sqft !== "any") {
    activeFilters.push({
      key: "sqft",
      label: `${parseInt(filters.sqft).toLocaleString()}+ SF`,
      value: "any",
    });
  }

  if (filters.stories !== "any") {
    activeFilters.push({
      key: "stories",
      label: `${filters.stories} ${filters.stories === "1" ? "Story" : "Stories"}`,
      value: "any",
    });
  }

  if (filters.garages !== "any") {
    activeFilters.push({
      key: "garages",
      label: `${filters.garages}+ Car Garage`,
      value: "any",
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onRemoveFilter(filter.key, filter.value)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/10 text-main-primary text-sm rounded-full hover:bg-main-primary/20 transition-colors"
        >
          {filter.label}
          <X className="size-3.5" />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-main-primary hover:underline ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

// Listing Settings Footer Content
function ListingSettingsFooter({
  listingSettings,
}: {
  listingSettings: ListingSettings | null;
}) {
  if (!listingSettings?.footerContent && !listingSettings?.footerImage) {
    return null;
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
              Maryland
            </h2>
            <p className="text-lg text-main-primary/70 mt-2">
              Floor Plans
            </p>
            <div className="w-16 h-1 bg-main-secondary mt-4" />
            {listingSettings.footerContent && (
              <div
                className="mt-6 text-gray-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: listingSettings.footerContent }}
              />
            )}
          </div>

          {/* Image */}
          {listingSettings.footerImage && (
            <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
              <Image
                src={listingSettings.footerImage}
                alt="Maryland Floor Plans"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PlansPageClient({
  initialFloorplans,
  communities,
  listingSettings,
}: PlansPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animations
  useEffect(() => {
    window.scrollTo(0, 0);
    const animateTimer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => {
      clearTimeout(animateTimer);
    };
  }, []);

  const [filters, setFilters] = useState({
    community: searchParams.get("community") || "all",
    priceRange: 0,
    bedrooms: "any",
    bathrooms: "any",
    sqft: "any",
    stories: "any",
    garages: "any",
  });
  const [sortBy, setSortBy] = useState("featured");

  // Get selected community
  const selectedCommunity = useMemo(() => {
    if (filters.community === "all") return null;
    return communities.find((c) => c.id === filters.community) || null;
  }, [filters.community, communities]);

  // Filter and sort floorplans
  const filteredFloorplans = useMemo(() => {
    let result = [...initialFloorplans];

    // Filter by community
    if (filters.community !== "all") {
      result = result.filter((fp) =>
        fp.communityFloorplans?.some((cf) => cf.community.id === filters.community)
      );
    }

    // Filter by price range
    const priceRange = PRICE_RANGES[filters.priceRange];
    if (priceRange && filters.priceRange > 0) {
      result = result.filter((fp) => {
        if (!fp.basePrice) return true;
        return fp.basePrice >= priceRange.min && fp.basePrice <= priceRange.max;
      });
    }

    // Filter by bedrooms
    if (filters.bedrooms !== "any") {
      const minBeds = parseInt(filters.bedrooms);
      result = result.filter((fp) => fp.baseBedrooms && fp.baseBedrooms >= minBeds);
    }

    // Filter by bathrooms
    if (filters.bathrooms !== "any") {
      const minBaths = parseInt(filters.bathrooms);
      result = result.filter((fp) => fp.baseBathrooms && fp.baseBathrooms >= minBaths);
    }

    // Filter by square feet
    if (filters.sqft !== "any") {
      const minSqft = parseInt(filters.sqft);
      result = result.filter((fp) => fp.baseSquareFeet && fp.baseSquareFeet >= minSqft);
    }

    // Filter by stories
    if (filters.stories !== "any") {
      const stories = parseInt(filters.stories);
      result = result.filter((fp) => fp.baseStories === stories);
    }

    // Filter by garages
    if (filters.garages !== "any") {
      const minGarages = parseInt(filters.garages);
      result = result.filter((fp) => fp.baseGarages && fp.baseGarages >= minGarages);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        break;
      case "sqft-asc":
        result.sort((a, b) => (a.baseSquareFeet || 0) - (b.baseSquareFeet || 0));
        break;
      case "sqft-desc":
        result.sort((a, b) => (b.baseSquareFeet || 0) - (a.baseSquareFeet || 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [initialFloorplans, filters, sortBy]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.community !== "all") count++;
    if (filters.priceRange > 0) count++;
    if (filters.bedrooms !== "any") count++;
    if (filters.bathrooms !== "any") count++;
    if (filters.sqft !== "any") count++;
    if (filters.stories !== "any") count++;
    if (filters.garages !== "any") count++;
    return count;
  }, [filters]);

  // Calculate price ranges with counts
  const priceRangesWithCounts = useMemo(() => {
    let baseFloorplans = [...initialFloorplans];
    if (filters.community !== "all") {
      baseFloorplans = baseFloorplans.filter((fp) =>
        fp.communityFloorplans?.some((cf) => cf.community.id === filters.community)
      );
    }

    return PRICE_RANGES.map((range, index) => {
      if (index === 0) {
        return { ...range, count: baseFloorplans.length, index };
      }
      const count = baseFloorplans.filter((fp) => {
        if (!fp.basePrice) return false;
        return fp.basePrice >= range.min && fp.basePrice <= range.max;
      }).length;
      return { ...range, count, index };
    });
  }, [initialFloorplans, filters.community]);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (newFilters.community !== "all") {
        params.set("community", newFilters.community);
      }
      router.push(`/plans${params.toString() ? `?${params.toString()}` : ""}`);
    },
    [router]
  );

  // Handle removing a single filter
  const handleRemoveFilter = useCallback(
    (key: string, value: any) => {
      handleFiltersChange({ ...filters, [key]: value });
    },
    [filters, handleFiltersChange]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    handleFiltersChange({
      community: "all",
      priceRange: 0,
      bedrooms: "any",
      bathrooms: "any",
      sqft: "any",
      stories: "any",
      garages: "any",
    });
  }, [handleFiltersChange]);

  // Hero background image - use listing settings banner, then first floorplan
  const heroImage =
    listingSettings?.bannerImage ||
    initialFloorplans[0]?.elevationGallery?.[0] ||
    initialFloorplans[0]?.gallery?.[0] ||
    "";

  // Hero title - use listing settings banner title
  const heroTitle = listingSettings?.bannerTitle || "Floor Plans";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[450px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Floor Plans"
            fill
            className={`object-cover transition-transform duration-1000 ${
              isAnimated ? "scale-100" : "scale-110"
            }`}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-main-primary" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div
            className={`transition-all duration-700 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              {heroTitle}
            </h1>
            <div
              className={`w-24 h-1 bg-main-secondary mx-auto mt-4 transition-all duration-500 delay-200 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Quick Links Navigation */}
      <QuickLinksNav activeTab="plans" isAnimated={isAnimated} />
      <MobileQuickLinks />

      {/* Desktop Filters Bar */}
      <div className="hidden lg:block bg-white/95 backdrop-blur-sm border-b sticky top-20 z-30">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="flex items-center justify-between py-4">
            {/* Left Filters */}
            <div className="flex items-center gap-3">
              {/* Community Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm font-medium transition-colors ${
                      filters.community !== "all"
                        ? "border-main-primary bg-main-primary/5 text-main-primary"
                        : "border-gray-200 text-main-primary hover:border-main-primary"
                    }`}
                  >
                    {filters.community !== "all" && selectedCommunity
                      ? selectedCommunity.name
                      : "Community"}
                    <ChevronDown className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <button
                    onClick={() =>
                      handleFiltersChange({ ...filters, community: "all" })
                    }
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      filters.community === "all"
                        ? "bg-main-primary/10 text-main-primary font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    All Communities
                  </button>
                  <div className="max-h-[300px] overflow-y-auto">
                    {communities.map((community) => (
                      <button
                        key={community.id}
                        onClick={() =>
                          handleFiltersChange({ ...filters, community: community.id })
                        }
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          filters.community === community.id
                            ? "bg-main-primary/10 text-main-primary font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {community.name}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Price Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm font-medium transition-colors ${
                      filters.priceRange > 0
                        ? "border-main-primary bg-main-primary/5 text-main-primary"
                        : "border-gray-200 text-main-primary hover:border-main-primary"
                    }`}
                  >
                    {filters.priceRange > 0
                      ? PRICE_RANGES[filters.priceRange].label
                      : "Price Range"}
                    <ChevronDown className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  {priceRangesWithCounts.map((range) => (
                    <button
                      key={range.index}
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          priceRange: range.index,
                        })
                      }
                      disabled={range.count === 0 && range.index !== 0}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                        filters.priceRange === range.index
                          ? "bg-main-primary/10 text-main-primary font-medium"
                          : range.count === 0 && range.index !== 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>{range.label}</span>
                      {range.index !== 0 && (
                        <span
                          className={`text-xs ${
                            range.count === 0
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          ({range.count})
                        </span>
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              {/* More Filters */}
              <FiltersSheet
                filters={filters}
                onFiltersChange={handleFiltersChange}
                communities={communities}
              />

              {/* Share Search */}
              <button className="text-sm text-main-primary hover:underline flex items-center gap-1">
                <Share2 className="size-4" />
                Share This Search
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-main-primary hover:border-main-primary transition-colors">
                    Sort Results
                    <ChevronDown className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        sortBy === option.value
                          ? "bg-main-primary/10 text-main-primary font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <MobileFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        communities={communities}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Results Count - Mobile */}
      <div className="bg-gray-100 py-3 px-4 lg:hidden">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold text-main-primary">
            {filteredFloorplans.length}
          </span>{" "}
          {filteredFloorplans.length === 1 ? "Floor Plan" : "Floor Plans"}
        </p>
        <ActiveFilterTags
          filters={filters}
          selectedCommunity={selectedCommunity}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8">
        <div className="hidden lg:block mb-6">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-bold text-main-primary">
              {filteredFloorplans.length}
            </span>{" "}
            {filteredFloorplans.length === 1 ? "Floor Plan" : "Floor Plans"}
          </p>
          <ActiveFilterTags
            filters={filters}
            selectedCommunity={selectedCommunity}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredFloorplans.map((floorplan, index) => (
            <div
              key={floorplan.id}
              className={`transition-all duration-500 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${Math.min(index * 75, 600)}ms` }}
            >
              <FloorplanCard floorplan={floorplan} communities={communities} />
            </div>
          ))}
        </div>

        {filteredFloorplans.length === 0 && (
          <div className="text-center py-16">
            <Layers className="size-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-500">
              No floor plans found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleClearAllFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer Content */}
      <ListingSettingsFooter listingSettings={listingSettings} />
    </main>
  );
}
