"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, MapPin, Home, FileText, Loader2, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SearchResult {
  type: "community" | "home" | "floorplan";
  id: string;
  name: string;
  subtitle: string;
  href: string;
}

export function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
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
        // Use the server-side API route to avoid CORS issues
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        setResults(data.results || []);
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

  const handleResultClick = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 text-sm font-semibold text-main-primary uppercase tracking-wide hover:text-main-secondary transition-colors"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-main-primary">
            Find Your New Home
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search communities, homes, plans..."
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-lg text-base text-main-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main-primary/20 focus:border-main-primary"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
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
                  onClick={handleResultClick}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-center size-12 bg-gray-100 rounded-full shrink-0">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-main-primary truncate">
                      {result.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-400 uppercase px-2 py-1 bg-gray-100 rounded">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-12 text-center text-gray-500">
              <Search className="size-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">
                Try searching for a different term
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Search className="size-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Search for your dream home</p>
              <p className="text-sm mt-1">
                Type at least 2 characters to search
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
