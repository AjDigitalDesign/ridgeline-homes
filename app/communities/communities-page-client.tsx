"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  SlidersHorizontal,
  Map,
  LayoutGrid,
  X,
  Camera,
  MapPin,
  ArrowRight,
  Calendar,
  Share2,
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
import { MortgageCalculator } from "@/components/mortgage-calculator";
import CommunityMap from "./community-map";
import type { Community, MarketArea } from "@/lib/api";
import { getCommunityUrl, getCommunityUrlWithParams } from "@/lib/url";
import { Calculator } from "lucide-react";

interface CommunitiesPageClientProps {
  initialCommunities: Community[];
  marketAreas: MarketArea[];
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
  { label: "Newest", value: "newest" },
  { label: "Name A-Z", value: "name-asc" },
];

type ViewMode = "list" | "map";

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMonthlyPayment(price: number | null) {
  if (!price) return null;
  const monthlyRate = 0.065 / 12;
  const numPayments = 360;
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthly =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthly);
}

// Community Card Component
function CommunityCard({
  community,
  onHover,
  onClick,
  isHighlighted,
}: {
  community: Community;
  onHover?: (id: string | null) => void;
  onClick?: (community: Community) => void;
  isHighlighted?: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const image = community.gallery?.[0] || "";
  const location = [community.city, community.state].filter(Boolean).join(", ");
  const galleryImages = community.gallery || [];

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (galleryImages.length > 0) {
      setLightboxOpen(true);
    }
  };

  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalculatorOpen(true);
  };

  return (
    <>
      <div
        className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer ${
          isHighlighted ? "ring-2 ring-main-secondary shadow-lg" : ""
        }`}
        onMouseEnter={() => onHover?.(community.id)}
        onMouseLeave={() => onHover?.(null)}
        onClick={() => onClick?.(community)}
      >
        {/* Image */}
        <div className="relative h-[200px] lg:h-[220px] overflow-hidden">
          <Image
            src={image}
            alt={community.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-main-primary text-white text-xs font-semibold uppercase rounded-full">
              {community.status === "ACTIVE" ? "Active" : community.status}
            </span>
          </div>
          {/* Favorite Icon */}
          <FavoriteButton
            type="community"
            itemId={community.id}
            className="absolute top-4 right-4"
          />
          {/* Bottom Actions */}
          <div
            className={`absolute left-4 flex items-center gap-2 ${
              community.marketingHeadline && community.showMarketingHeadline
                ? "bottom-12"
                : "bottom-4"
            }`}
          >
            <button
              onClick={handleGalleryClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/90 hover:bg-main-primary text-white text-xs rounded-full transition-colors"
            >
              <Camera className="size-3.5" />
              {galleryImages.length} Photos
            </button>
            <span className="flex items-center justify-center size-8 bg-main-secondary rounded-full">
              <MapPin className="size-4 text-main-primary" />
            </span>
          </div>
          {/* Marketing Headline Banner */}
          {community.marketingHeadline && community.showMarketingHeadline && (
            <div className="absolute bottom-0 left-0 right-0 bg-main-secondary px-4 py-2">
              <p className="text-sm font-medium text-main-primary truncate">
                {community.marketingHeadline}
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
                {community.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{location}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base lg:text-lg font-bold text-main-primary">
                {community.priceMin
                  ? `${formatPrice(community.priceMin)}+`
                  : "Contact Us"}
              </p>
              {community.priceMin && (
                <button
                  onClick={handleCalculatorClick}
                  className="text-xs text-gray-500 flex items-center gap-1 justify-end hover:text-main-primary transition-colors"
                >
                  {formatMonthlyPayment(community.priceMin)}/mo
                  <Calculator className="size-4.5 text-tertiary" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 lg:gap-4 mt-4 pt-4 border-t border-gray-100">
            {community.bedsMin && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {community.bedsMin}
                  {community.bedsMax && community.bedsMax !== community.bedsMin
                    ? `-${community.bedsMax}`
                    : ""}
                </p>
                <p className="text-xs text-gray-500">Beds</p>
              </div>
            )}
            {community.bathsMin && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {community.bathsMin}
                  {community.bathsMax &&
                  community.bathsMax !== community.bathsMin
                    ? `-${community.bathsMax}`
                    : ""}
                </p>
                <p className="text-xs text-gray-500">Baths</p>
              </div>
            )}
            {community.sqftMin && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {community.sqftMin.toLocaleString()}+
                </p>
                <p className="text-xs text-gray-500">SQ FT</p>
              </div>
            )}
            {community.garagesMin && (
              <div className="text-center">
                <p className="text-sm font-semibold text-main-primary">
                  {community.garagesMin}-
                  {community.garagesMax || community.garagesMin}
                </p>
                <p className="text-xs text-gray-500">Stories</p>
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
              <Link
                href={getCommunityUrlWithParams(community, {
                  schedule: "true",
                })}
              >
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
              <Link href={getCommunityUrl(community)}>
                Detail
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
        title={`${community.name} Gallery`}
      />

      {/* Mortgage Calculator */}
      <MortgageCalculator
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        initialPrice={community.priceMin || 400000}
        propertyName={community.name}
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
              className="px-4 py-3 bg-main-primary text-white rounded-lg font-medium"
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
              className="px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
            >
              Floor Plans
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Filter Sheet for More Filters - Button style options
function FiltersSheet({
  filters,
  onFiltersChange,
}: {
  filters: {
    city: string;
    priceRange: number;
    bedrooms: string;
    bathrooms: string;
  };
  onFiltersChange: (filters: any) => void;
}) {
  const bedroomOptions = ["any", "2", "3", "4", "5"];
  const bathroomOptions = ["any", "2", "3", "4"];
  const sqftOptions = [
    { value: "any", label: "Any" },
    { value: "1500", label: "1,500+" },
    { value: "2000", label: "2,000+" },
    { value: "2500", label: "2,500+" },
    { value: "3000", label: "3,000+" },
  ];
  const storyOptions = [
    { value: "any", label: "Any" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3+" },
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
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>More Filters</SheetTitle>
        </SheetHeader>
        <div className="container max-auto px-4">
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
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-main-primary hover:bg-gray-200 transition-all"
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
                {storyOptions.map((option) => (
                  <button
                    key={option.value}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-main-primary hover:bg-gray-200 transition-all"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onFiltersChange({
                  city: "all",
                  priceRange: 0,
                  bedrooms: "any",
                  bathrooms: "any",
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
  marketAreas,
  activeFiltersCount,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  marketAreas: MarketArea[];
  activeFiltersCount: number;
}) {
  return (
    <div className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border-b overflow-x-auto">
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
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 py-6 overflow-y-auto">
            {/* City */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                City
              </label>
              <Select
                value={filters.city}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, city: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {marketAreas.map((area) => (
                    <SelectItem key={area.id} value={area.slug}>
                      {area.name}
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
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onFiltersChange({
                  city: "all",
                  priceRange: 0,
                  bedrooms: "any",
                  bathrooms: "any",
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

// Market Area Content Footer
function MarketAreaContent({ marketArea }: { marketArea: MarketArea | null }) {
  if (!marketArea) return null;

  const image = marketArea.featureImage || marketArea.image;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
              {marketArea.name}
              {marketArea.state && `, ${marketArea.state}`}
            </h2>
            <p className="text-lg text-main-primary/70 mt-2">
              New Home Communities
            </p>
            <div className="w-16 h-1 bg-main-secondary mt-4" />
            {marketArea.description && (
              <div
                className="mt-6 text-gray-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: marketArea.description }}
              />
            )}
          </div>

          {/* Image */}
          {image && (
            <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
              <Image
                src={image}
                alt={marketArea.name}
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

// Active Filter Tags Component
function ActiveFilterTags({
  filters,
  selectedMarketArea,
  onRemoveFilter,
  onClearAll,
}: {
  filters: {
    city: string;
    priceRange: number;
    bedrooms: string;
    bathrooms: string;
  };
  selectedMarketArea: MarketArea | null;
  onRemoveFilter: (key: string, value: any) => void;
  onClearAll: () => void;
}) {
  const activeFilters: { key: string; label: string; value: any }[] = [];

  if (filters.city !== "all" && selectedMarketArea) {
    activeFilters.push({
      key: "city",
      label: selectedMarketArea.name,
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

export default function CommunitiesPageClient({
  initialCommunities,
  marketAreas,
}: CommunitiesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State - default to map on desktop, list on mobile
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [hoveredCommunityId, setHoveredCommunityId] = useState<string | null>(
    null
  );
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null
  );
  const [isAnimated, setIsAnimated] = useState(false);

  // Set initial view mode based on screen size and trigger animations
  useEffect(() => {
    // Scroll to top on mount to prevent jump to bottom
    window.scrollTo(0, 0);

    const isDesktop = window.innerWidth >= 1024;
    setViewMode(isDesktop ? "map" : "list");
    // Trigger animations after mount
    const animateTimer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => {
      clearTimeout(animateTimer);
    };
  }, []);

  const [filters, setFilters] = useState({
    city: searchParams.get("marketArea") || "all",
    priceRange: 0,
    bedrooms: "any",
    bathrooms: "any",
  });
  const [sortBy, setSortBy] = useState("featured");

  // Get selected market area
  const selectedMarketArea = useMemo(() => {
    if (filters.city === "all") return null;
    return marketAreas.find((area) => area.slug === filters.city) || null;
  }, [filters.city, marketAreas]);

  // Filter and sort communities
  const filteredCommunities = useMemo(() => {
    let result = [...initialCommunities];

    // Filter by city/market area
    if (filters.city !== "all") {
      result = result.filter((c) => c.marketArea?.slug === filters.city);
    }

    // Filter by price range
    const priceRange = PRICE_RANGES[filters.priceRange];
    if (priceRange && filters.priceRange > 0) {
      result = result.filter((c) => {
        if (!c.priceMin) return true;
        return c.priceMin >= priceRange.min && c.priceMin <= priceRange.max;
      });
    }

    // Filter by bedrooms
    if (filters.bedrooms !== "any") {
      const minBeds = parseInt(filters.bedrooms);
      result = result.filter((c) => c.bedsMin && c.bedsMin >= minBeds);
    }

    // Filter by bathrooms
    if (filters.bathrooms !== "any") {
      const minBaths = parseInt(filters.bathrooms);
      result = result.filter((c) => c.bathsMin && c.bathsMin >= minBaths);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.priceMin || 0) - (a.priceMin || 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        // Assuming newer communities have higher IDs
        result.reverse();
        break;
    }

    return result;
  }, [initialCommunities, filters, sortBy]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.city !== "all") count++;
    if (filters.priceRange > 0) count++;
    if (filters.bedrooms !== "any") count++;
    if (filters.bathrooms !== "any") count++;
    return count;
  }, [filters]);

  // Calculate price ranges with counts (based on current city filter only)
  const priceRangesWithCounts = useMemo(() => {
    // Filter communities by city first (to show relevant price ranges)
    let baseCommunities = [...initialCommunities];
    if (filters.city !== "all") {
      baseCommunities = baseCommunities.filter(
        (c) => c.marketArea?.slug === filters.city
      );
    }

    return PRICE_RANGES.map((range, index) => {
      if (index === 0) {
        // "Any Price" shows all
        return { ...range, count: baseCommunities.length, index };
      }
      const count = baseCommunities.filter((c) => {
        if (!c.priceMin) return false;
        return c.priceMin >= range.min && c.priceMin <= range.max;
      }).length;
      return { ...range, count, index };
    });
  }, [initialCommunities, filters.city]);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      // Update URL params
      const params = new URLSearchParams();
      if (newFilters.city !== "all") {
        params.set("marketArea", newFilters.city);
      }
      router.push(
        `/communities${params.toString() ? `?${params.toString()}` : ""}`
      );
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
      city: "all",
      priceRange: 0,
      bedrooms: "any",
      bathrooms: "any",
    });
  }, [handleFiltersChange]);

  // Handle card click to select community and open popup on map
  const handleCardClick = useCallback((community: Community) => {
    setSelectedCommunityId(community.id);
  }, []);

  // Handle marker select from map
  const handleMarkerSelect = useCallback((community: Community | null) => {
    setSelectedCommunityId(community?.id || null);
  }, []);

  // Hero background image
  const heroImage =
    selectedMarketArea?.featureImage ||
    initialCommunities[0]?.gallery?.[0] ||
    "";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[450px] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt={selectedMarketArea?.name || "Communities"}
            fill
            className={`object-cover transition-transform duration-1000 ${
              isAnimated ? "scale-100" : "scale-110"
            }`}
            priority
          />
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
              {selectedMarketArea?.name || "Maryland"}
              {selectedMarketArea?.state ? `, ${selectedMarketArea.state}` : ""}
            </h1>
            <p
              className={`text-lg lg:text-xl text-white/90 mt-2 uppercase tracking-wider transition-all duration-700 delay-100 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Communities
            </p>
            <div
              className={`w-24 h-1 bg-main-secondary mx-auto mt-4 transition-all duration-500 delay-200 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Quick Links Navigation */}
      <QuickLinksNav activeTab="communities" isAnimated={isAnimated} />
      <MobileQuickLinks />

      {/* Desktop Filters Bar */}
      <div className="hidden lg:block bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="flex items-center justify-between py-4">
            {/* Left Filters */}
            <div className="flex items-center gap-3">
              {/* City Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm font-medium transition-colors ${
                      filters.city !== "all"
                        ? "border-main-primary bg-main-primary/5 text-main-primary"
                        : "border-gray-200 text-main-primary hover:border-main-primary"
                    }`}
                  >
                    {filters.city !== "all"
                      ? selectedMarketArea?.name || "City"
                      : "City"}
                    <ChevronDown className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <div className="p-2 border-b">
                    <button
                      onClick={() =>
                        handleFiltersChange({ ...filters, city: "all" })
                      }
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        filters.city === "all"
                          ? "bg-main-primary/10 text-main-primary font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      All Cities
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2">
                    {marketAreas.map((area) => (
                      <button
                        key={area.id}
                        onClick={() =>
                          handleFiltersChange({ ...filters, city: area.slug })
                        }
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                          filters.city === area.slug
                            ? "bg-main-primary/10 text-main-primary font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {area.featureImage && (
                          <div className="relative size-10 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={area.featureImage}
                              alt={area.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="text-left">
                          <span className="block font-medium">{area.name}</span>
                          {area._count?.communities && (
                            <span className="text-xs text-gray-500">
                              {area._count.communities} communities
                            </span>
                          )}
                        </div>
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

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-main-primary text-white"
                      : "text-main-primary hover:bg-gray-50"
                  }`}
                >
                  <Map className="size-4" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-main-primary text-white"
                      : "text-main-primary hover:bg-gray-50"
                  }`}
                >
                  <LayoutGrid className="size-4" />
                  List
                </button>
              </div>
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
        marketAreas={marketAreas}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Mobile View Toggle */}
      <div className="lg:hidden flex items-center justify-end gap-2 px-4 py-2 bg-white border-b">
        <button
          onClick={() => setViewMode("map")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            viewMode === "map"
              ? "bg-main-primary text-white"
              : "border border-gray-200 text-main-primary"
          }`}
        >
          <Map className="size-4" />
          Map
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            viewMode === "list"
              ? "bg-main-primary text-white"
              : "border border-gray-200 text-main-primary"
          }`}
        >
          <LayoutGrid className="size-4" />
          List
        </button>
      </div>

      {/* Results Count - Mobile */}
      <div className="bg-gray-100 py-3 px-4 lg:hidden">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold text-main-primary">
            {filteredCommunities.length}
          </span>{" "}
          Communities
        </p>
        <ActiveFilterTags
          filters={filters}
          selectedMarketArea={selectedMarketArea}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>

      {/* Main Content */}
      {viewMode === "map" ? (
        /* Map View - Split Layout */
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] lg:h-[calc(100vh-180px)]">
          {/* Map - Expands to fill available space */}
          <div className="h-1/2 lg:h-full lg:flex-1 relative">
            <CommunityMap
              communities={filteredCommunities}
              hoveredCommunityId={hoveredCommunityId}
              selectedCommunityId={selectedCommunityId}
              onMarkerHover={setHoveredCommunityId}
              onMarkerSelect={handleMarkerSelect}
            />
          </div>

          {/* Cards - Fixed width on desktop */}
          <div className="h-1/2 lg:h-full lg:w-[580px] xl:w-[640px] lg:shrink-0 overflow-y-auto bg-gray-50 p-4">
            <div className="hidden lg:block mb-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-bold text-main-primary">
                  {filteredCommunities.length}
                </span>{" "}
                Communities
              </p>
              <ActiveFilterTags
                filters={filters}
                selectedMarketArea={selectedMarketArea}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCommunities.map((community, index) => (
                <div
                  key={community.id}
                  className={`transition-all duration-500 ${
                    isAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
                >
                  <CommunityCard
                    community={community}
                    onHover={setHoveredCommunityId}
                    onClick={handleCardClick}
                    isHighlighted={
                      hoveredCommunityId === community.id ||
                      selectedCommunityId === community.id
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8">
          <div className="hidden lg:block mb-6">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-bold text-main-primary">
                {filteredCommunities.length}
              </span>{" "}
              Communities
            </p>
            <ActiveFilterTags
              filters={filters}
              selectedMarketArea={selectedMarketArea}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredCommunities.map((community, index) => (
              <div
                key={community.id}
                className={`transition-all duration-500 ${
                  isAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${Math.min(index * 75, 600)}ms` }}
              >
                <CommunityCard community={community} />
              </div>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">
                No communities found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  handleFiltersChange({
                    city: "all",
                    priceRange: 0,
                    bedrooms: "any",
                    bathrooms: "any",
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Market Area Content Footer */}
      <MarketAreaContent marketArea={selectedMarketArea} />
    </main>
  );
}
