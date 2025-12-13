"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, Loader2, Bed, Bath, Square } from "lucide-react";
import type { Home } from "@/lib/api";
import { getHomeUrl } from "@/lib/url";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Default center (Maryland)
const DEFAULT_CENTER = {
  latitude: 39.0458,
  longitude: -76.6413,
  zoom: 8,
};

interface HomesMapProps {
  homes: Home[];
  hoveredHomeId: string | null;
  selectedHomeId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerSelect: (home: Home | null) => void;
}

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
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

export default function HomesMap({
  homes,
  hoveredHomeId,
  selectedHomeId,
  onMarkerHover,
  onMarkerSelect,
}: HomesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const popupRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const lastHoveredIdRef = useRef<string | null>(null);

  // Get the selected home from prop
  const selectedHome = useMemo(() => {
    if (!selectedHomeId) return null;
    return homes.find((h) => h.id === selectedHomeId) || null;
  }, [selectedHomeId, homes]);

  // Filter homes with valid coordinates
  const validHomes = useMemo(
    () => homes.filter((h) => h.latitude && h.longitude),
    [homes]
  );

  // Initialize map
  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    let map: any;
    let isMounted = true;

    const initMap = async () => {
      // Wait for next tick to ensure DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Check if container is available and component is still mounted
      if (!mapContainerRef.current || !isMounted) return;

      const mapboxgl = (await import("mapbox-gl")).default;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Calculate initial bounds
      let center: [number, number] = [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude];
      let zoom = DEFAULT_CENTER.zoom;

      if (validHomes.length === 1) {
        const h = validHomes[0];
        center = [h.longitude!, h.latitude!];
        zoom = 14;
      } else if (validHomes.length > 1) {
        const lats = validHomes.map((h) => h.latitude!);
        const lngs = validHomes.map((h) => h.longitude!);
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
        validHomes.forEach((home) => {
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.innerHTML = `
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.1)); transition: transform 0.2s ease-out; transform-origin: bottom center;">
              <path d="M16 0C7.164 0 0 7.164 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.164 24.836 0 16 0Z" fill="#1c2d37" style="transition: fill 0.2s ease-out;"/>
              <circle cx="16" cy="14" r="6" fill="white"/>
            </svg>
          `;
          el.style.cursor = "pointer";
          el.dataset.homeId = home.id;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([home.longitude!, home.latitude!])
            .addTo(map);

          el.addEventListener("click", (e) => {
            e.stopPropagation();
            onMarkerSelect(home);
            map.flyTo({
              center: [home.longitude!, home.latitude!],
              zoom: 15,
              duration: 500,
            });
          });

          el.addEventListener("mouseenter", () => {
            onMarkerHover(home.id);
          });

          el.addEventListener("mouseleave", () => {
            onMarkerHover(null);
          });

          markersRef.current.set(home.id, { marker, element: el });
        });
      });
    };

    initMap();

    return () => {
      isMounted = false;
      if (map) {
        map.remove();
      }
      markersRef.current.clear();
    };
  }, [validHomes, onMarkerHover]);

  // Update marker styles on hover or selection
  useEffect(() => {
    markersRef.current.forEach((data, id) => {
      const svg = data.element.querySelector("svg");
      const path = data.element.querySelector("svg path");
      if (svg && path) {
        const isHighlighted = id === hoveredHomeId || id === selectedHomeId;
        if (isHighlighted) {
          path.setAttribute("fill", "#eed26e");
          data.element.style.zIndex = "50";
          svg.style.transform = "scale(1.25)";
          svg.style.transformOrigin = "bottom center";
        } else {
          path.setAttribute("fill", "#1c2d37");
          data.element.style.zIndex = "10";
          svg.style.transform = "scale(1)";
        }
      }
    });

    if (
      hoveredHomeId &&
      hoveredHomeId !== lastHoveredIdRef.current &&
      !selectedHomeId &&
      mapRef.current &&
      isMapLoaded &&
      !isUserInteracting
    ) {
      const home = validHomes.find((h) => h.id === hoveredHomeId);
      if (home?.latitude && home?.longitude) {
        mapRef.current.flyTo({
          center: [home.longitude, home.latitude],
          zoom: 14,
          duration: 500,
        });
      }
    }

    lastHoveredIdRef.current = hoveredHomeId;
  }, [hoveredHomeId, selectedHomeId, validHomes, isMapLoaded, isUserInteracting]);

  // Fly to selected home (when clicking card)
  useEffect(() => {
    if (selectedHome && mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [selectedHome.longitude, selectedHome.latitude],
        zoom: 15,
        duration: 500,
      });
    }
  }, [selectedHome, isMapLoaded]);

  // Handle popup
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    const mapboxgl = require("mapbox-gl");

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (selectedHome && selectedHome.latitude && selectedHome.longitude) {
      const popupContainer = document.createElement("div");
      popupContainer.className = "home-popup-content";

      const image = selectedHome.gallery?.[0] || "";
      const location = selectedHome.community
        ? `${selectedHome.community.name}${selectedHome.community.city ? `, ${selectedHome.community.city}` : ""}`
        : [selectedHome.city, selectedHome.state].filter(Boolean).join(", ");

      popupContainer.innerHTML = `
        <div class="w-[280px] bg-white rounded-lg overflow-hidden shadow-xl">
          <button class="popup-close absolute top-2 right-2 z-10 p-1 bg-white/90 rounded-full hover:bg-white transition-colors">
            <svg class="size-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          ${image ? `<div class="relative h-[120px]"><img src="${image}" alt="${selectedHome.name}" class="w-full h-full object-cover" /></div>` : ""}
          <div class="p-3">
            <h3 class="font-bold text-[#1c2d37] text-sm">${selectedHome.name}</h3>
            <p class="text-xs text-gray-500 mt-0.5">${location}</p>
            <div class="flex items-center gap-3 mt-2 text-xs text-gray-600">
              ${selectedHome.bedrooms ? `<span class="flex items-center gap-1"><svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>${selectedHome.bedrooms} Beds</span>` : ""}
              ${selectedHome.bathrooms ? `<span class="flex items-center gap-1"><svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/></svg>${selectedHome.bathrooms} Baths</span>` : ""}
              ${selectedHome.squareFeet ? `<span class="flex items-center gap-1"><svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>${selectedHome.squareFeet.toLocaleString()} SF</span>` : ""}
            </div>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div>
                <p class="font-bold text-[#1c2d37]">${formatPrice(selectedHome.price)}</p>
              </div>
              <a href="${getHomeUrl(selectedHome)}" class="flex items-center justify-center size-8 bg-[#eed26e] rounded-full hover:bg-[#eed26e]/80 transition-colors">
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
        className: "home-popup",
      })
        .setLngLat([selectedHome.longitude, selectedHome.latitude])
        .setDOMContent(popupContainer)
        .addTo(mapRef.current);

      popupContainer.querySelector(".popup-close")?.addEventListener("click", () => {
        onMarkerSelect(null);
      });

      popupRef.current = popup;
    }
  }, [selectedHome, isMapLoaded, onMarkerSelect]);

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
