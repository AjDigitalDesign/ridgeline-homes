"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Square, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Home, Community } from "@/lib/api";

interface HomesPageClientProps {
  initialHomes: Home[];
  communities: Community[];
}

export default function HomesPageClient({
  initialHomes,
  communities,
}: HomesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [bedroomsFilter, setBedroomsFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredHomes = useMemo(() => {
    return initialHomes.filter((home) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = home.name?.toLowerCase().includes(query);
        const matchesAddress = home.address?.toLowerCase().includes(query);
        const matchesCity = home.city?.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesCity) return false;
      }

      // Community filter
      if (selectedCommunity && home.community?.id !== selectedCommunity) {
        return false;
      }

      // Price filter
      if (home.price) {
        if (home.price < priceRange[0] || home.price > priceRange[1]) {
          return false;
        }
      }

      // Bedrooms filter
      if (bedroomsFilter && home.bedrooms !== bedroomsFilter) {
        return false;
      }

      return true;
    });
  }, [initialHomes, searchQuery, selectedCommunity, priceRange, bedroomsFilter]);

  const formatPrice = (price: number | null) => {
    if (!price) return "Price TBD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCommunity("");
    setPriceRange([0, 2000000]);
    setBedroomsFilter(null);
  };

  const hasActiveFilters = searchQuery || selectedCommunity || bedroomsFilter || priceRange[0] > 0 || priceRange[1] < 2000000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[400px] bg-main-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-main-primary to-main-primary/80" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            Available Homes
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl">
            Find your perfect home from our selection of move-in ready and quick move-in homes.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-0 z-30 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, address, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Community Filter */}
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none bg-white"
            >
              <option value="">All Communities</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="size-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-main-primary text-white text-xs rounded-full px-2 py-0.5">
                  Active
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600"
              >
                <X className="size-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  {[null, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num ?? "all"}
                      onClick={() => setBedroomsFilter(num)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        bedroomsFilter === num
                          ? "bg-main-primary text-white border-main-primary"
                          : "bg-white text-gray-700 border-gray-200 hover:border-main-primary"
                      }`}
                    >
                      {num ?? "All"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ""}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 2000000 ? "" : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 2000000])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredHomes.length} {filteredHomes.length === 1 ? "home" : "homes"} found
          </p>
        </div>

        {filteredHomes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="size-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No homes found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHomes.map((home) => (
              <article
                key={home.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={home.gallery?.[0] || "/placeholder-home.jpg"}
                    alt={home.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    aria-label="Add to favorites"
                  >
                    <Heart className="size-5 text-gray-600 hover:text-red-500" />
                  </button>
                  {home.status && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-main-secondary text-main-primary px-3 py-1 rounded-full text-sm font-medium">
                        {home.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-main-primary transition-colors">
                      {home.name}
                    </h3>
                    <span className="text-lg font-bold text-main-primary">
                      {formatPrice(home.price)}
                    </span>
                  </div>

                  {home.community && (
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="size-4" />
                      {home.community.name}
                      {home.community.city && `, ${home.community.city}`}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {home.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="size-4" />
                        {home.bedrooms} Beds
                      </span>
                    )}
                    {home.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="size-4" />
                        {home.bathrooms} Baths
                      </span>
                    )}
                    {home.squareFeet && (
                      <span className="flex items-center gap-1">
                        <Square className="size-4" />
                        {home.squareFeet.toLocaleString()} SF
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/homes/${home.slug}`}
                    className="block w-full text-center py-2.5 bg-main-primary text-white rounded-lg hover:bg-main-primary/90 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
