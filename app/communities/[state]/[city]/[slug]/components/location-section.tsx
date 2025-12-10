"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Phone, Clock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Community } from "@/lib/api";

import "mapbox-gl/dist/mapbox-gl.css";

interface LocationSectionProps {
  community: Community;
}

export default function LocationSection({ community }: LocationSectionProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const fullAddress = [
    community.address,
    community.city,
    community.state,
    community.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  const getDirectionsUrl = () => {
    if (community.latitude && community.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${community.latitude},${community.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(fullAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  useEffect(() => {
    if (!community.latitude || !community.longitude || !mapContainer.current) return;
    if (map.current) return;

    const initMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      // CSS is imported via the existing community-map which loads the stylesheet globally

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
        zoom: 14,
      });

      // Add marker
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      markerEl.innerHTML = `
        <div class="w-10 h-10 bg-main-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-main-primary">
          <svg class="w-5 h-5 text-main-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      `;

      new mapboxgl.Marker({ element: markerEl })
        .setLngLat([community.longitude!, community.latitude!])
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setMapLoaded(true);
      });
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [community.latitude, community.longitude]);

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Location & Directions
        </h2>
        <p className="text-gray-600 mt-1">Find us and plan your visit</p>
        <div className="w-16 h-1 bg-main-secondary mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div
            ref={mapContainer}
            className="h-[300px] lg:h-[400px] rounded-xl overflow-hidden bg-gray-100"
          />
          {!mapLoaded && (
            <div className="h-[300px] lg:h-[400px] rounded-xl bg-gray-100 flex items-center justify-center -mt-[300px] lg:-mt-[400px]">
              <div className="animate-pulse text-gray-400">Loading map...</div>
            </div>
          )}
        </div>

        {/* Location Info */}
        <div className="space-y-4">
          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 bg-main-primary/5 rounded-lg shrink-0">
                <MapPin className="size-5 text-main-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium text-main-primary">{fullAddress}</p>
                <button
                  onClick={copyAddress}
                  className="mt-2 text-sm text-main-primary hover:underline flex items-center gap-1"
                >
                  {addressCopied ? (
                    <>
                      <Check className="size-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" /> Copy address
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Phone */}
          {community.phoneNumber && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center size-10 bg-main-primary/5 rounded-lg shrink-0">
                  <Phone className="size-5 text-main-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sales Office</p>
                  <a
                    href={`tel:${community.phoneNumber}`}
                    className="font-medium text-main-primary hover:underline"
                  >
                    {community.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Sales Office Hours */}
          {community.salesOfficeHours && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center size-10 bg-main-primary/5 rounded-lg shrink-0">
                  <Clock className="size-5 text-main-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Office Hours</p>
                  <div className="text-sm text-main-primary">
                    {typeof community.salesOfficeHours === "string" ? (
                      <p>{community.salesOfficeHours}</p>
                    ) : (
                      <div className="space-y-1">
                        {Object.entries(community.salesOfficeHours).map(([day, hours]) => (
                          <p key={day}>
                            <span className="font-medium">{day}:</span> {String(hours)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Get Directions Button */}
          <Button asChild className="w-full bg-main-primary hover:bg-main-primary/90">
            <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
              <Navigation className="size-4 mr-2" />
              Get Directions
            </a>
          </Button>
        </div>
      </div>

      {/* Directions Text */}
      {community.directions && (
        <div className="mt-6 p-5 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-main-primary mb-2">Driving Directions</h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {community.directions}
          </p>
        </div>
      )}
    </div>
  );
}
