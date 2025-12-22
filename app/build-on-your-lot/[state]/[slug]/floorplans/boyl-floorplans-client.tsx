"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  Camera,
  ArrowRight,
  Calendar,
  Share2,
  Home,
  Layers,
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
import type { BOYLFloorplan, BOYLLocation } from "@/lib/api";

interface BOYLFloorplansClientProps {
  location: BOYLLocation;
  floorplans: BOYLFloorplan[];
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

function formatPrice(price: number | null | undefined) {
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
  basePath,
}: {
  floorplan: BOYLFloorplan;
  basePath: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const image = floorplan.elevationGallery?.[0] || floorplan.gallery?.[0] || "";
  const galleryImages = [
    ...(floorplan.elevationGallery || []),
    ...(floorplan.gallery || []),
    ...(floorplan.plansImages || []),
  ];

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (galleryImages.length > 0) {
      setLightboxOpen(true);
    }
  };

  const detailUrl = `${basePath}/${floorplan.slug}`;

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
            itemId={floorplan.floorplanId}
            className="absolute top-4 right-4"
          />
          {/* Bottom Actions */}
          <div className="absolute left-4 bottom-4 flex items-center gap-2">
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
        </div>

        {/* Content */}
        <div className="p-4 lg:p-5">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-bold text-main-primary group-hover:text-main-primary/80 transition-colors truncate">
                {floorplan.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-gray-500">From</p>
              <p className="text-base lg:text-lg font-bold text-main-primary">
                {formatPrice(floorplan.price)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 lg:gap-4 mt-4 pt-4 border-t border-gray-100">
            {floorplan.bedrooms && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.bedrooms}
                </p>
                <p className="text-xs text-gray-500">Beds</p>
              </div>
            )}
            {floorplan.bathrooms && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.bathrooms}
                </p>
                <p className="text-xs text-gray-500">Baths</p>
              </div>
            )}
            {floorplan.sqft && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.sqft.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">SQ FT</p>
              </div>
            )}
            {floorplan.garages && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {floorplan.garages}
                </p>
                <p className="text-xs text-gray-500">Garage</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3 mt-4">
            <Button
              asChild
              size="sm"
              className="flex-1 bg-main-secondary text-main-primary hover:bg-main-secondary/90 text-xs lg:text-sm"
            >
              <Link href={`${detailUrl}?schedule=true`}>
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
              <Link href={detailUrl}>
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

// Filter Sheet for More Filters
function FiltersSheet({
  filters,
  onFiltersChange,
}: {
  filters: {
    priceRange: number;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    garages: string;
  };
  onFiltersChange: (filters: any) => void;
}) {
  const bedroomOptions = ["any", "2", "3", "4", "5"];
  const bathroomOptions = ["any", "2", "3", "4"];
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
        <div className="container mx-auto px-6">
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
                  priceRange: 0,
                  bedrooms: "any",
                  bathrooms: "any",
                  sqft: "any",
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
  activeFiltersCount,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  activeFiltersCount: number;
}) {
  const bedroomOptions = ["any", "2", "3", "4", "5"];
  const bathroomOptions = ["any", "2", "3", "4"];
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
    <div className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-sm border-b overflow-x-auto">
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
        <SheetContent side="bottom" className="h-[85vh] flex flex-col">
          <SheetHeader className="px-4">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="flex flex-col gap-6 py-4">
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
                <label className="text-sm font-medium text-gray-700 mb-3 block">
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
                <label className="text-sm font-medium text-gray-700 mb-3 block">
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
                <label className="text-sm font-medium text-gray-700 mb-3 block">
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

              {/* Garages */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
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
          </div>

          {/* Fixed bottom buttons */}
          <div className="flex gap-3 p-4 border-t bg-white">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onFiltersChange({
                  priceRange: 0,
                  bedrooms: "any",
                  bathrooms: "any",
                  sqft: "any",
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
  onRemoveFilter,
  onClearAll,
}: {
  filters: {
    priceRange: number;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    garages: string;
  };
  onRemoveFilter: (key: string, value: any) => void;
  onClearAll: () => void;
}) {
  const activeFilters: { key: string; label: string; value: any }[] = [];

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

export default function BOYLFloorplansClient({
  location,
  floorplans,
}: BOYLFloorplansClientProps) {
  const params = useParams();
  const state = params.state as string;
  const slug = params.slug as string;
  const basePath = `/build-on-your-lot/${state}/${slug}/floorplans`;

  const [filters, setFilters] = useState({
    priceRange: 0,
    bedrooms: "any",
    bathrooms: "any",
    sqft: "any",
    garages: "any",
  });
  const [sortBy, setSortBy] = useState("featured");

  // Filter and sort floorplans
  const filteredFloorplans = useMemo(() => {
    let result = [...floorplans];

    // Filter by price range
    const priceRange = PRICE_RANGES[filters.priceRange];
    if (priceRange && filters.priceRange > 0) {
      result = result.filter((fp) => {
        if (!fp.price) return true;
        return fp.price >= priceRange.min && fp.price <= priceRange.max;
      });
    }

    // Filter by bedrooms
    if (filters.bedrooms !== "any") {
      const minBeds = parseInt(filters.bedrooms);
      result = result.filter((fp) => fp.bedrooms && fp.bedrooms >= minBeds);
    }

    // Filter by bathrooms
    if (filters.bathrooms !== "any") {
      const minBaths = parseInt(filters.bathrooms);
      result = result.filter((fp) => fp.bathrooms && fp.bathrooms >= minBaths);
    }

    // Filter by square feet
    if (filters.sqft !== "any") {
      const minSqft = parseInt(filters.sqft);
      result = result.filter((fp) => fp.sqft && fp.sqft >= minSqft);
    }

    // Filter by garages
    if (filters.garages !== "any") {
      const minGarages = parseInt(filters.garages);
      result = result.filter((fp) => fp.garages && fp.garages >= minGarages);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "sqft-asc":
        result.sort((a, b) => (a.sqft || 0) - (b.sqft || 0));
        break;
      case "sqft-desc":
        result.sort((a, b) => (b.sqft || 0) - (a.sqft || 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [floorplans, filters, sortBy]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange > 0) count++;
    if (filters.bedrooms !== "any") count++;
    if (filters.bathrooms !== "any") count++;
    if (filters.sqft !== "any") count++;
    if (filters.garages !== "any") count++;
    return count;
  }, [filters]);

  // Calculate price ranges with counts
  const priceRangesWithCounts = useMemo(() => {
    return PRICE_RANGES.map((range, index) => {
      if (index === 0) {
        return { ...range, count: floorplans.length, index };
      }
      const count = floorplans.filter((fp) => {
        if (!fp.price) return false;
        return fp.price >= range.min && fp.price <= range.max;
      }).length;
      return { ...range, count, index };
    });
  }, [floorplans]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

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
      priceRange: 0,
      bedrooms: "any",
      bathrooms: "any",
      sqft: "any",
      garages: "any",
    });
  }, [handleFiltersChange]);

  return (
    <div className="bg-gray-50 min-h-[50vh]">
      {/* Desktop Filters Bar */}
      <div className="hidden lg:block bg-white/95 backdrop-blur-sm border-b sticky top-[calc(4rem+3.5rem)] xl:top-[calc(6rem+3.5rem)] z-30">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="flex items-center justify-between py-4">
            {/* Left Filters */}
            <div className="flex items-center gap-3">
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
                            range.count === 0 ? "text-gray-300" : "text-gray-500"
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
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredFloorplans.map((floorplan) => (
            <FloorplanCard
              key={floorplan.floorplanId}
              floorplan={floorplan}
              basePath={basePath}
            />
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
    </div>
  );
}
