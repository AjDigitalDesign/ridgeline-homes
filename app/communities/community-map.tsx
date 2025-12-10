"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, Loader2 } from "lucide-react";
import type { Community } from "@/lib/api";
import { getCommunityUrl } from "@/lib/url";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Default center (Maryland)
const DEFAULT_CENTER = {
  latitude: 39.0458,
  longitude: -76.6413,
  zoom: 8,
};

interface CommunityMapProps {
  communities: Community[];
  hoveredCommunityId: string | null;
  selectedCommunityId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerSelect: (community: Community | null) => void;
}

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

// Popup content component
function PopupContent({
  community,
  onClose,
}: {
  community: Community;
  onClose: () => void;
}) {
  const image = community.gallery?.[0] || "";
  const location = [community.city, community.state, community.zipCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-[280px] bg-white rounded-lg overflow-hidden shadow-xl">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
      >
        <X className="size-4 text-gray-600" />
      </button>

      {/* Image */}
      {image && (
        <div className="relative h-[120px]">
          <Image
            src={image}
            alt={community.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-main-primary text-sm">{community.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{location}</p>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Priced From</p>
            <p className="font-bold text-main-primary">
              {community.priceMin
                ? `${formatPrice(community.priceMin)} - ${formatPrice(community.priceMax || community.priceMin)}`
                : "Contact Us"}
            </p>
          </div>
          <Link
            href={getCommunityUrl(community)}
            className="flex items-center justify-center size-8 bg-main-secondary rounded-full hover:bg-main-secondary/80 transition-colors"
          >
            <ArrowRight className="size-4 text-main-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Map placeholder for when Mapbox isn't available
function MapPlaceholder({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
      <Loader2 className="size-8 text-main-primary animate-spin mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

export default function CommunityMap({
  communities,
  hoveredCommunityId,
  selectedCommunityId,
  onMarkerHover,
  onMarkerSelect,
}: CommunityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const popupRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const lastHoveredIdRef = useRef<string | null>(null);

  // Get the selected community from prop
  const selectedCommunity = useMemo(() => {
    if (!selectedCommunityId) return null;
    return communities.find((c) => c.id === selectedCommunityId) || null;
  }, [selectedCommunityId, communities]);

  // Filter communities with valid coordinates
  const validCommunities = useMemo(
    () => communities.filter((c) => c.latitude && c.longitude),
    [communities]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    let map: any;

    const initMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Calculate initial bounds
      let center: [number, number] = [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude];
      let zoom = DEFAULT_CENTER.zoom;

      if (validCommunities.length === 1) {
        const c = validCommunities[0];
        center = [c.longitude!, c.latitude!];
        zoom = 12;
      } else if (validCommunities.length > 1) {
        const lats = validCommunities.map((c) => c.latitude!);
        const lngs = validCommunities.map((c) => c.longitude!);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

        const latDiff = maxLat - minLat;
        const lngDiff = maxLng - minLng;
        const maxDiff = Math.max(latDiff, lngDiff);

        if (maxDiff > 2) zoom = 6;
        else if (maxDiff > 1) zoom = 7;
        else if (maxDiff > 0.5) zoom = 8;
        else if (maxDiff > 0.2) zoom = 9;
        else zoom = 10;
      }

      map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");
      map.addControl(new mapboxgl.FullscreenControl(), "top-left");

      mapRef.current = map;

      // Track user interaction with the map
      map.on("mousedown", () => setIsUserInteracting(true));
      map.on("mouseup", () => setIsUserInteracting(false));
      map.on("dragstart", () => setIsUserInteracting(true));
      map.on("dragend", () => setIsUserInteracting(false));
      map.on("zoomstart", () => setIsUserInteracting(true));
      map.on("zoomend", () => setIsUserInteracting(false));

      map.on("load", () => {
        setIsMapLoaded(true);

        // Add markers
        validCommunities.forEach((community) => {
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.innerHTML = `
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.1)); transition: transform 0.2s ease-out; transform-origin: bottom center;">
              <path d="M16 0C7.164 0 0 7.164 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.164 24.836 0 16 0Z" fill="#1c2d37" style="transition: fill 0.2s ease-out;"/>
              <circle cx="16" cy="14" r="6" fill="white"/>
            </svg>
          `;
          el.style.cursor = "pointer";
          el.dataset.communityId = community.id;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([community.longitude!, community.latitude!])
            .addTo(map);

          el.addEventListener("click", (e) => {
            e.stopPropagation();
            onMarkerSelect(community);
            map.flyTo({
              center: [community.longitude!, community.latitude!],
              zoom: 13,
              duration: 500,
            });
          });

          el.addEventListener("mouseenter", () => {
            onMarkerHover(community.id);
          });

          el.addEventListener("mouseleave", () => {
            onMarkerHover(null);
          });

          markersRef.current.set(community.id, { marker, element: el });
        });
      });
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
      markersRef.current.clear();
    };
  }, [validCommunities, onMarkerHover]);

  // Update marker styles on hover or selection
  useEffect(() => {
    markersRef.current.forEach((data, id) => {
      const svg = data.element.querySelector("svg");
      const path = data.element.querySelector("svg path");
      if (svg && path) {
        // Highlight if hovered OR selected
        const isHighlighted = id === hoveredCommunityId || id === selectedCommunityId;
        if (isHighlighted) {
          path.setAttribute("fill", "#eed26e");
          data.element.style.zIndex = "50";
          // Apply scale to SVG element, not the marker container
          svg.style.transform = "scale(1.25)";
          svg.style.transformOrigin = "bottom center";
        } else {
          path.setAttribute("fill", "#1c2d37");
          data.element.style.zIndex = "10";
          svg.style.transform = "scale(1)";
        }
      }
    });

    // Only fly to marker on hover if:
    // - There's a new hovered community
    // - No community is currently selected (popup open)
    // - User is not interacting with map
    if (
      hoveredCommunityId &&
      hoveredCommunityId !== lastHoveredIdRef.current &&
      !selectedCommunityId &&
      mapRef.current &&
      isMapLoaded &&
      !isUserInteracting
    ) {
      const community = validCommunities.find((c) => c.id === hoveredCommunityId);
      if (community?.latitude && community?.longitude) {
        mapRef.current.flyTo({
          center: [community.longitude, community.latitude],
          zoom: 12,
          duration: 500,
        });
      }
    }

    lastHoveredIdRef.current = hoveredCommunityId;
  }, [hoveredCommunityId, selectedCommunityId, validCommunities, isMapLoaded, isUserInteracting]);

  // Fly to selected community (when clicking card)
  useEffect(() => {
    if (selectedCommunity && mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [selectedCommunity.longitude, selectedCommunity.latitude],
        zoom: 13,
        duration: 500,
      });
    }
  }, [selectedCommunity, isMapLoaded]);

  // Handle popup
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    const mapboxgl = require("mapbox-gl");

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (selectedCommunity && selectedCommunity.latitude && selectedCommunity.longitude) {
      const popupContainer = document.createElement("div");
      popupContainer.className = "community-popup-content";

      const image = selectedCommunity.gallery?.[0] || "";
      const location = [selectedCommunity.city, selectedCommunity.state, selectedCommunity.zipCode]
        .filter(Boolean)
        .join(", ");

      popupContainer.innerHTML = `
        <div class="w-[280px] bg-white rounded-lg overflow-hidden shadow-xl">
          <button class="popup-close absolute top-2 right-2 z-10 p-1 bg-white/90 rounded-full hover:bg-white transition-colors">
            <svg class="size-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          ${image ? `<div class="relative h-[120px]"><img src="${image}" alt="${selectedCommunity.name}" class="w-full h-full object-cover" /></div>` : ""}
          <div class="p-3">
            <h3 class="font-bold text-[#1c2d37] text-sm">${selectedCommunity.name}</h3>
            <p class="text-xs text-gray-500 mt-0.5">${location}</p>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div>
                <p class="text-xs text-gray-500">Priced From</p>
                <p class="font-bold text-[#1c2d37] text-sm">
                  ${selectedCommunity.priceMin ? `${formatPrice(selectedCommunity.priceMin)} - ${formatPrice(selectedCommunity.priceMax || selectedCommunity.priceMin)}` : "Contact Us"}
                </p>
              </div>
              <a href="/communities/${selectedCommunity.state?.toLowerCase().slice(0, 2) || 'md'}/${selectedCommunity.city?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}/${selectedCommunity.slug}" class="flex items-center justify-center size-8 bg-[#eed26e] rounded-full hover:bg-[#eed26e]/80 transition-colors">
                <svg class="size-4 text-[#1c2d37]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 45,
        className: "community-popup",
      })
        .setLngLat([selectedCommunity.longitude, selectedCommunity.latitude])
        .setDOMContent(popupContainer)
        .addTo(mapRef.current);

      popupContainer.querySelector(".popup-close")?.addEventListener("click", () => {
        onMarkerSelect(null);
      });

      popupRef.current = popup;
    }
  }, [selectedCommunity, isMapLoaded, onMarkerSelect]);

  if (!MAPBOX_TOKEN) {
    return <MapPlaceholder message="Map requires Mapbox API token" />;
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="size-8 text-main-primary animate-spin" />
        </div>
      )}
    </div>
  );
}
