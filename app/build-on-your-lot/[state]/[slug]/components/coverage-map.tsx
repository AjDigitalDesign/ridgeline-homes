"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { BOYLLocation } from "@/lib/api";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface CoverageMapProps {
  location: BOYLLocation;
  allLocations?: BOYLLocation[];
  highlightedCounty?: string | null;
  onCountyHover?: (county: string | null) => void;
}

// Helper to create a circle polygon from a center point and radius
function createCirclePolygon(
  center: [number, number],
  radiusMiles: number,
  points: number = 64
): [number, number][] {
  const radiusKm = radiusMiles * 1.60934;
  const radiusLat = radiusKm / 110.574;
  const radiusLng = radiusKm / (111.32 * Math.cos((center[1] * Math.PI) / 180));

  const coordinates: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const lng = center[0] + radiusLng * Math.cos(angle);
    const lat = center[1] + radiusLat * Math.sin(angle);
    coordinates.push([lng, lat]);
  }
  // Close the polygon
  coordinates.push(coordinates[0]);

  return coordinates;
}

// Create marker element with construction/land icon and county name
function createMarkerElement(countyName: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "county-marker";
  el.setAttribute("data-county", countyName);
  el.innerHTML = `
    <div style="
      background: #1c2d37;
      border-radius: 8px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      white-space: nowrap;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 22H22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 22V11L12 3L21 11V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 22V16C14 15.4696 13.7893 14.9609 13.4142 14.5858C13.0391 14.2107 12.5304 14 12 14C11.4696 14 10.9609 14.2107 10.5858 14.5858C10.2107 14.9609 10 15.4696 10 16V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 11V8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M17 11V8" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span style="color: white; font-size: 11px; font-weight: 600;">${countyName}</span>
    </div>
  `;
  return el;
}

function CoverageMap({
  location,
  allLocations = [],
  highlightedCounty,
  onCountyHover,
}: CoverageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [layersReady, setLayersReady] = useState(false);
  const markersRef = useRef<Map<string, any>>(new Map());
  const locationsByCountyRef = useRef<Map<string, number>>(new Map());
  const onCountyHoverRef = useRef(onCountyHover);

  // Keep ref in sync with prop
  useEffect(() => {
    onCountyHoverRef.current = onCountyHover;
  }, [onCountyHover]);

  // Use allLocations if provided, otherwise just the single location
  // Memoize to prevent unnecessary map reinitialization
  const locations = useMemo(() =>
    allLocations.length > 0 ? allLocations : [location],
    [allLocations, location]
  );

  // Handle highlighting when highlightedCounty changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || !layersReady) return;

    // Safely check if a layer exists
    const hasLayer = (layerId: string): boolean => {
      try {
        return map.getLayer && typeof map.getLayer === 'function' && !!map.getLayer(layerId);
      } catch {
        return false;
      }
    };

    // Reset all layers to default opacity
    locations.forEach((_, index) => {
      const fillLayerId = `coverage-fill-${index}`;
      const outlineLayerId = `coverage-outline-${index}`;

      if (hasLayer(fillLayerId)) {
        map.setPaintProperty(fillLayerId, 'fill-opacity', highlightedCounty ? 0.15 : 0.3);
      }
      if (hasLayer(outlineLayerId)) {
        map.setPaintProperty(outlineLayerId, 'line-width', 2);
        map.setPaintProperty(outlineLayerId, 'line-opacity', highlightedCounty ? 0.5 : 1);
      }
    });

    // Highlight the selected county
    if (highlightedCounty) {
      const locationIndex = locationsByCountyRef.current.get(highlightedCounty);
      if (locationIndex !== undefined) {
        const fillLayerId = `coverage-fill-${locationIndex}`;
        const outlineLayerId = `coverage-outline-${locationIndex}`;

        if (hasLayer(fillLayerId)) {
          map.setPaintProperty(fillLayerId, 'fill-opacity', 0.5);
        }
        if (hasLayer(outlineLayerId)) {
          map.setPaintProperty(outlineLayerId, 'line-width', 3);
          map.setPaintProperty(outlineLayerId, 'line-opacity', 1);
        }
      }
    }

    // Update marker styles
    markersRef.current.forEach((marker, county) => {
      const el = marker.getElement();
      if (el) {
        const innerDiv = el.querySelector('div');
        if (innerDiv) {
          if (highlightedCounty === county) {
            innerDiv.style.background = '#eed26e';
            innerDiv.style.transform = 'scale(1.1)';
            const span = innerDiv.querySelector('span');
            const svg = innerDiv.querySelector('svg');
            if (span) span.style.color = '#1c2d37';
            if (svg) {
              svg.querySelectorAll('path').forEach((path: SVGPathElement) => {
                path.setAttribute('stroke', '#1c2d37');
              });
            }
          } else {
            innerDiv.style.background = '#1c2d37';
            innerDiv.style.transform = 'scale(1)';
            const span = innerDiv.querySelector('span');
            const svg = innerDiv.querySelector('svg');
            if (span) span.style.color = 'white';
            if (svg) {
              svg.querySelectorAll('path').forEach((path: SVGPathElement) => {
                path.setAttribute('stroke', 'white');
              });
            }
          }
        }
      }
    });
  }, [highlightedCounty, isMapLoaded, layersReady, locations]);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    let map: any;
    let isMounted = true;

    const initMap = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (!mapContainerRef.current || !isMounted) return;

      const mapboxgl = (await import("mapbox-gl")).default;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Calculate center from all locations
      const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
      const center: [number, number] = [avgLng, avgLat];

      map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom: 7,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");
      map.addControl(new mapboxgl.FullscreenControl(), "top-left");

      mapRef.current = map;

      map.on("load", () => {
        setIsMapLoaded(true);

        const allBounds = new mapboxgl.LngLatBounds();
        locationsByCountyRef.current.clear();
        markersRef.current.clear();

        // Add coverage areas for each location
        locations.forEach((loc, index) => {
          const locCenter: [number, number] = [loc.longitude, loc.latitude];
          let coordinates: [number, number][] | null = null;

          // Store location index by county for highlighting
          locationsByCountyRef.current.set(loc.county, index);

          // Check if location has polygon data
          if (loc.polygon && loc.polygon.coordinates && loc.polygon.coordinates.length > 0) {
            // Handle both flat array [[lng, lat], ...] and nested GeoJSON format [[[lng, lat], ...]]
            const rawCoords = loc.polygon.coordinates;
            if (Array.isArray(rawCoords[0]) && Array.isArray(rawCoords[0][0])) {
              // Nested format: [[[lng, lat], [lng, lat], ...]]
              coordinates = rawCoords[0] as [number, number][];
            } else {
              // Flat format: [[lng, lat], [lng, lat], ...]
              coordinates = rawCoords as [number, number][];
            }
          }
          // Check if location has radius
          else if (loc.radiusMiles && loc.radiusMiles > 0) {
            coordinates = createCirclePolygon(locCenter, loc.radiusMiles);
          }

          // Only add coverage area if we have coordinates
          if (coordinates) {
            const sourceId = `coverage-${index}`;
            const fillLayerId = `coverage-fill-${index}`;
            const outlineLayerId = `coverage-outline-${index}`;

            // Add coverage area source
            map.addSource(sourceId, {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [coordinates],
                },
                properties: {
                  name: loc.name,
                  county: loc.county,
                },
              },
            });

            // Add fill layer
            map.addLayer({
              id: fillLayerId,
              type: "fill",
              source: sourceId,
              paint: {
                "fill-color": "#1c2d37",
                "fill-opacity": 0.3,
              },
            });

            // Add outline layer
            map.addLayer({
              id: outlineLayerId,
              type: "line",
              source: sourceId,
              paint: {
                "line-color": "#1c2d37",
                "line-width": 2,
              },
            });

            // Add cursor change on hover for the coverage area
            map.on('mouseenter', fillLayerId, () => {
              map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', fillLayerId, () => {
              map.getCanvas().style.cursor = '';
            });

            // Extend bounds with coverage area
            coordinates.forEach((coord) => {
              allBounds.extend(coord);
            });
          }

          // Add marker for each location with county name
          const markerEl = createMarkerElement(loc.county);

          // Add hover events to marker
          markerEl.addEventListener('mouseenter', () => {
            if (onCountyHoverRef.current) {
              onCountyHoverRef.current(loc.county);
            }
          });

          markerEl.addEventListener('mouseleave', () => {
            if (onCountyHoverRef.current) {
              onCountyHoverRef.current(null);
            }
          });

          const marker = new mapboxgl.Marker({ element: markerEl })
            .setLngLat(locCenter)
            .addTo(map);

          markersRef.current.set(loc.county, marker);

          // Extend bounds with marker location
          allBounds.extend(locCenter);
        });

        // Fit map to all coverage areas and markers (no animation for accessibility)
        if (!allBounds.isEmpty()) {
          map.fitBounds(allBounds, {
            padding: 50,
            maxZoom: 10,
            animate: false,
          });
        }

        // Mark layers as ready for highlighting
        setLayersReady(true);
      });
    };

    initMap();

    return () => {
      isMounted = false;
      setLayersReady(false);
      if (map) {
        map.remove();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Map requires Mapbox API token</p>
      </div>
    );
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

export default CoverageMap;
