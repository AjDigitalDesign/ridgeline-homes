"use client";

import {
  Waves,
  Home,
  Dumbbell,
  Baby,
  Footprints,
  Trees,
  Car,
  ShoppingBag,
  UtensilsCrossed,
  Bike,
  Dog,
  CircleDot,
  Palmtree,
  Building2,
  Shield,
  Wifi,
  Mountain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface AmenitiesSectionProps {
  amenities: string[];
}

// Map common amenity keywords to icons
function getAmenityIcon(amenity: string): LucideIcon {
  const lowerAmenity = amenity.toLowerCase();

  if (lowerAmenity.includes("pool") || lowerAmenity.includes("swim")) return Waves;
  if (lowerAmenity.includes("clubhouse") || lowerAmenity.includes("club house")) return Home;
  if (lowerAmenity.includes("fitness") || lowerAmenity.includes("gym") || lowerAmenity.includes("workout")) return Dumbbell;
  if (lowerAmenity.includes("playground") || lowerAmenity.includes("kids") || lowerAmenity.includes("children")) return Baby;
  if (lowerAmenity.includes("trail") || lowerAmenity.includes("walking") || lowerAmenity.includes("hiking")) return Footprints;
  if (lowerAmenity.includes("park") || lowerAmenity.includes("green") || lowerAmenity.includes("nature")) return Trees;
  if (lowerAmenity.includes("garage") || lowerAmenity.includes("parking")) return Car;
  if (lowerAmenity.includes("shop") || lowerAmenity.includes("retail") || lowerAmenity.includes("store")) return ShoppingBag;
  if (lowerAmenity.includes("restaurant") || lowerAmenity.includes("dining") || lowerAmenity.includes("food")) return UtensilsCrossed;
  if (lowerAmenity.includes("bike") || lowerAmenity.includes("cycling")) return Bike;
  if (lowerAmenity.includes("dog") || lowerAmenity.includes("pet")) return Dog;
  if (lowerAmenity.includes("tennis") || lowerAmenity.includes("court") || lowerAmenity.includes("sport")) return CircleDot;
  if (lowerAmenity.includes("lake") || lowerAmenity.includes("pond") || lowerAmenity.includes("water")) return Palmtree;
  if (lowerAmenity.includes("school") || lowerAmenity.includes("education")) return Building2;
  if (lowerAmenity.includes("gate") || lowerAmenity.includes("security") || lowerAmenity.includes("guard")) return Shield;
  if (lowerAmenity.includes("wifi") || lowerAmenity.includes("internet") || lowerAmenity.includes("smart")) return Wifi;
  if (lowerAmenity.includes("view") || lowerAmenity.includes("mountain") || lowerAmenity.includes("scenic")) return Mountain;

  return Sparkles; // Default icon
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Community Amenities
        </h2>
        <p className="text-gray-600 mt-1">
          Enjoy these features and amenities
        </p>
        <div className="w-16 h-1 bg-main-secondary mt-3" />
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities.map((amenity, index) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-center size-10 bg-main-primary/5 rounded-lg shrink-0">
                <Icon className="size-5 text-main-primary" />
              </div>
              <span className="text-sm font-medium text-main-primary">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
