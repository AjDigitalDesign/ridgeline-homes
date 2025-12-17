"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  ShoppingBag,
  GraduationCap,
  ShoppingCart,
  Cross,
  Trees,
  Navigation,
} from "lucide-react";
import type { Community } from "@/lib/api";

import "mapbox-gl/dist/mapbox-gl.css";

interface AreaMapSectionProps {
  community: Community;
}

type PlaceCategory =
  | "restaurant"
  | "shopping"
  | "school"
  | "grocery"
  | "medical"
  | "parks";

interface CategoryConfig {
  id: PlaceCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
  // SVG path for marker icon
  svgPath: string;
}

// API response structure from backend
interface ApiPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  userRatingsTotal?: number;
  isOpen?: boolean;
}

// Normalized structure for internal use
interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  isOpen?: boolean;
  distance?: number;
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    id: "restaurant",
    label: "Restaurants",
    icon: <UtensilsCrossed className="size-5" />,
    color: "#E53935",
    // Fork and knife icon
    svgPath: "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: <ShoppingBag className="size-5" />,
    color: "#8E24AA",
    // Shopping bag icon
    svgPath: "M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z",
  },
  {
    id: "school",
    label: "Schools",
    icon: <GraduationCap className="size-5" />,
    color: "#1E88E5",
    // Graduation cap icon
    svgPath: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
  },
  {
    id: "parks",
    label: "Parks & Rec",
    icon: <Trees className="size-5" />,
    color: "#43A047",
    // Tree/park icon
    svgPath: "M17 12h2L12 2 5.05 12H7l-3.9 6h6.92v4h3.96v-4H21l-4-6z",
  },
  {
    id: "medical",
    label: "Medical",
    icon: <Cross className="size-5" />,
    color: "#D81B60",
    // Medical cross icon
    svgPath: "M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z",
  },
  {
    id: "grocery",
    label: "Grocery",
    icon: <ShoppingCart className="size-5" />,
    color: "#FB8C00",
    // Shopping cart icon
    svgPath: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
  },
];

// Calculate distance between two coordinates in miles
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AreaMapSection({ community }: AreaMapSectionProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [placesCount, setPlacesCount] = useState(0);

  // Filter categories based on what's enabled for this community
  const enabledCategories = CATEGORY_CONFIG.filter((cat) =>
    community.nearbyPlaceCategories?.includes(cat.id)
  );

  const getDirectionsUrl = () => {
    if (community.latitude && community.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${community.latitude},${community.longitude}`;
    }
    const fullAddress = [
      community.address,
      community.city,
      community.state,
      community.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  };

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    setPlacesCount(0);
  }, []);

  // Fetch and display nearby places from backend API
  const fetchNearbyPlaces = useCallback(
    async (category: PlaceCategory) => {
      if (!map.current || !community.latitude || !community.longitude) return;

      setIsLoading(true);
      clearMarkers();

      try {
        const mapboxgl = (await import("mapbox-gl")).default;

        // Use nearbyPlacesRadius from community or default to 10 miles (16093 meters)
        const radius = community.nearbyPlacesRadius || 16093;

        const response = await fetch(
          `https://ridgeline-homes.forgehome.io/api/public/nearby-places?lat=${community.latitude}&lng=${community.longitude}&category=${category}&radius=${radius}`
        );

        const data = await response.json();

        if (data.places && data.places.length > 0) {
          // Normalize API response and add distance to each place, limit to 20
          const placesWithDistance = data.places
            .slice(0, 20)
            .map((apiPlace: ApiPlace) => {
              // Normalize lat/lng - backend uses latitude/longitude
              const lat = apiPlace.latitude;
              const lng = apiPlace.longitude;

              return {
                id: apiPlace.id,
                name: apiPlace.name,
                address: apiPlace.address,
                lat,
                lng,
                rating: apiPlace.rating,
                userRatingsTotal: apiPlace.userRatingsTotal,
                isOpen: apiPlace.isOpen,
                distance: calculateDistance(
                  community.latitude!,
                  community.longitude!,
                  lat,
                  lng
                ),
              } as NearbyPlace;
            })
            .filter((place: NearbyPlace) => !isNaN(place.lat) && !isNaN(place.lng))
            .sort(
              (a: NearbyPlace, b: NearbyPlace) =>
                (a.distance || 0) - (b.distance || 0)
            );

          setPlacesCount(placesWithDistance.length);

          // Get category config for color and icon
          const categoryConfig = CATEGORY_CONFIG.find((c) => c.id === category);
          const markerColor = categoryConfig?.color || "#1976D2";
          const svgPath = categoryConfig?.svgPath || "";

          // Create markers for each place
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([community.longitude!, community.latitude!]);

          placesWithDistance.forEach((place: NearbyPlace) => {
            // Create custom marker element with category-specific icon
            const markerEl = document.createElement("div");
            markerEl.className = "nearby-place-marker cursor-pointer";
            markerEl.innerHTML = `
              <div style="
                width: 36px;
                height: 36px;
                background-color: ${markerColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                border: 2px solid white;
                cursor: pointer;
                transition: transform 0.2s;
              ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="${svgPath}" />
                </svg>
              </div>
            `;

            // Add hover effect
            markerEl.addEventListener("mouseenter", () => {
              markerEl.querySelector("div")!.style.transform = "scale(1.15)";
            });
            markerEl.addEventListener("mouseleave", () => {
              markerEl.querySelector("div")!.style.transform = "scale(1)";
            });

            // Create popup content
            const popupContent = `
              <div class="p-3 min-w-[220px]">
                <p class="font-semibold text-sm text-gray-900">${place.name}</p>
                ${place.address ? `<p class="text-xs text-gray-500 mt-1">${place.address}</p>` : ""}
                <div class="flex items-center gap-2 mt-2">
                  ${
                    place.rating
                      ? `
                    <div class="flex items-center gap-1">
                      <span class="text-yellow-500">★</span>
                      <span class="text-xs font-medium">${Number(place.rating).toFixed(1)}</span>
                      ${place.userRatingsTotal ? `<span class="text-xs text-gray-400">(${place.userRatingsTotal})</span>` : ""}
                    </div>
                  `
                      : ""
                  }
                  ${
                    place.isOpen !== undefined
                      ? `
                    <span class="text-xs ${place.isOpen ? "text-green-600" : "text-red-500"}">
                      ${place.isOpen ? "Open" : "Closed"}
                    </span>
                  `
                      : ""
                  }
                </div>
                ${
                  place.distance !== undefined
                    ? `<p class="text-xs text-gray-500 mt-1">${place.distance.toFixed(1)} miles away</p>`
                    : ""
                }
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block mt-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  Get Directions →
                </a>
              </div>
            `;

            const marker = new mapboxgl.Marker({ element: markerEl })
              .setLngLat([place.lng, place.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25, closeButton: true }).setHTML(
                  popupContent
                )
              )
              .addTo(map.current!);

            markersRef.current.push(marker);
            bounds.extend([place.lng, place.lat]);
          });

          // Fit map to show all markers
          map.current.fitBounds(bounds, { padding: 80, maxZoom: 13 });
        } else {
          setPlacesCount(0);
        }
      } catch (error) {
        console.error("Error fetching nearby places:", error);
        setPlacesCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [
      community.latitude,
      community.longitude,
      community.nearbyPlacesRadius,
      clearMarkers,
    ]
  );

  // Handle category click
  const handleCategoryClick = (category: PlaceCategory) => {
    if (activeCategory === category) {
      // Deselect - clear markers and reset map
      setActiveCategory(null);
      clearMarkers();
      if (map.current && community.latitude && community.longitude) {
        map.current.flyTo({
          center: [community.longitude, community.latitude],
          zoom: 12,
        });
      }
    } else {
      setActiveCategory(category);
      fetchNearbyPlaces(category);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!community.latitude || !community.longitude || !mapContainer.current)
      return;
    if (map.current) return;

    const initMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        console.error("Mapbox token not found");
        return;
      }

      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [community.longitude!, community.latitude!],
        zoom: 12,
      });

      // Add community marker
      const markerEl = document.createElement("div");
      markerEl.className = "community-marker";
      markerEl.innerHTML = `
        <div class="w-12 h-12 bg-main-secondary rounded-lg flex items-center justify-center shadow-lg border-2 border-main-primary">
          <svg class="w-6 h-6 text-main-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      `;

      new mapboxgl.Marker({ element: markerEl })
        .setLngLat([community.longitude!, community.latitude!])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <p class="font-semibold text-sm">${community.name}</p>
              <p class="text-xs text-gray-500">Community Location</p>
            </div>
          `)
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-left");
      map.current.addControl(new mapboxgl.FullscreenControl(), "top-left");

      map.current.on("load", () => {
        setMapLoaded(true);
      });
    };

    initMap();

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [community.latitude, community.longitude, community.name, clearMarkers]);

  // Don't render if nearby places is not enabled
  if (!community.nearbyPlacesEnabled || enabledCategories.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <div className="flex flex-col lg:flex-row">
        {/* Map - Left Side */}
        <div className="lg:w-1/2 relative">
          <div
            ref={mapContainer}
            className="h-[400px] lg:h-[600px] w-full bg-gray-100"
          />
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading map...</div>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-primary"></div>
            </div>
          )}
          {/* Places count badge */}
          {activeCategory && placesCount > 0 && !isLoading && (
            <div className="absolute top-4 right-4 bg-main-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {placesCount} places found
            </div>
          )}
        </div>

        {/* Content - Right Side */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12 xl:p-16 flex flex-col">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-1 h-16 bg-main-primary" />
              <div>
                <p className="text-sm font-semibold text-main-primary uppercase tracking-wide">
                  The Neighborhood
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-main-primary uppercase tracking-wide">
                  Explore the Area
                </h2>
              </div>
            </div>
          </div>

          {/* Category Icons Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {enabledCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? "bg-main-primary text-white"
                    : "bg-gray-50 text-main-primary hover:bg-gray-100"
                }`}
              >
                {category.icon}
                <span className="font-semibold uppercase text-sm tracking-wide">
                  {category.label}
                </span>
              </button>
            ))}
          </div>

          {/* Directions Text */}
          {community.directions && (
            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed">
                {community.directions}
              </p>
            </div>
          )}

          {/* Get Directions Button */}
          <Button
            asChild
            className="bg-main-primary hover:bg-main-primary/90 text-white font-semibold uppercase tracking-wide px-8 h-12 mt-auto"
          >
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="size-4 mr-2" />
              Get Directions to Community
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
