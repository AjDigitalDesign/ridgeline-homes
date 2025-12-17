"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Home, FileText, Loader2, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchCommunities, fetchHomes, fetchFloorplans } from "@/lib/api";
import type { Community, Home as HomeType, Floorplan } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchResult {
  type: "community" | "home" | "floorplan";
  id: string;
  name: string;
  subtitle: string;
  href: string;
}

export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  // Clear state when sheet closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Search when debounced query changes
  useEffect(() => {
    async function search() {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const [communitiesRes, homesRes, floorplansRes] = await Promise.all([
          fetchCommunities({ limit: 5 }).catch(() => ({ data: [] })),
          fetchHomes({ limit: 5 }).catch(() => ({ data: [] })),
          fetchFloorplans({ limit: 5 }).catch(() => ({ data: [] })),
        ]);

        const searchLower = debouncedQuery.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Filter communities
        const communities = (communitiesRes.data || []) as Community[];
        communities
          .filter(
            (c) =>
              c.name.toLowerCase().includes(searchLower) ||
              c.city?.toLowerCase().includes(searchLower) ||
              c.state?.toLowerCase().includes(searchLower)
          )
          .slice(0, 3)
          .forEach((c) => {
            const state = c.state?.toLowerCase().replace(/\s+/g, "-") || "";
            const city = c.city?.toLowerCase().replace(/\s+/g, "-") || "";
            searchResults.push({
              type: "community",
              id: c.id,
              name: c.name,
              subtitle: [c.city, c.state].filter(Boolean).join(", "),
              href: `/communities/${state}/${city}/${c.slug}`,
            });
          });

        // Filter homes
        const homes = (homesRes.data || []) as HomeType[];
        homes
          .filter(
            (h) =>
              h.name?.toLowerCase().includes(searchLower) ||
              h.address?.toLowerCase().includes(searchLower) ||
              h.street?.toLowerCase().includes(searchLower) ||
              h.city?.toLowerCase().includes(searchLower)
          )
          .slice(0, 3)
          .forEach((h) => {
            const community = h.community;
            const state = community?.state?.toLowerCase().replace(/\s+/g, "-") || h.state?.toLowerCase().replace(/\s+/g, "-") || "";
            const city = community?.city?.toLowerCase().replace(/\s+/g, "-") || h.city?.toLowerCase().replace(/\s+/g, "-") || "";
            const communitySlug = community?.slug || "";
            searchResults.push({
              type: "home",
              id: h.id,
              name: h.street || h.address || h.name,
              subtitle: [h.city, h.state].filter(Boolean).join(", "),
              href: `/homes/${state}/${city}/${communitySlug}/${h.slug}`,
            });
          });

        // Filter floorplans
        const floorplans = (floorplansRes.data || []) as Floorplan[];
        floorplans
          .filter((f) => f.name.toLowerCase().includes(searchLower))
          .slice(0, 3)
          .forEach((f) => {
            searchResults.push({
              type: "floorplan",
              id: f.id,
              name: f.name,
              subtitle: `${f.baseBedrooms} Beds | ${f.baseBathrooms} Baths | ${f.baseSquareFeet?.toLocaleString()} Sq Ft`,
              href: `/plans/${f.slug}`,
            });
          });

        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    search();
  }, [debouncedQuery]);

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "community":
        return <MapPin className="size-4 text-main-primary" />;
      case "home":
        return <Home className="size-4 text-main-primary" />;
      case "floorplan":
        return <FileText className="size-4 text-main-primary" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex items-center justify-center size-10 rounded-full text-main-primary hover:bg-gray-100 transition-colors"
          aria-label="Search"
        >
          <Search className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="h-auto max-h-[80vh] p-0 bg-white"
      >
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="sr-only">Search</SheetTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search communities, homes, plans..."
              autoFocus
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-base text-main-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main-primary/20 focus:border-main-primary"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Results */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-main-primary" />
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-center size-10 bg-gray-100 rounded-full shrink-0">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-main-primary truncate">
                      {result.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-400 uppercase">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-12 text-center text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
