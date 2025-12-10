"use client";

import { GraduationCap, School, Building, BookOpen, Sparkles } from "lucide-react";
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
  type LucideIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchoolsAmenitiesSectionProps {
  schoolDistrict: string | null;
  elementarySchool: string | null;
  middleSchool: string | null;
  highSchool: string | null;
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

  return Sparkles;
}

export default function SchoolsAmenitiesSection({
  schoolDistrict,
  elementarySchool,
  middleSchool,
  highSchool,
  amenities,
}: SchoolsAmenitiesSectionProps) {
  const schools = [
    {
      level: "Elementary School",
      name: elementarySchool,
      icon: BookOpen,
      grades: "K-5",
    },
    {
      level: "Middle School",
      name: middleSchool,
      icon: School,
      grades: "6-8",
    },
    {
      level: "High School",
      name: highSchool,
      icon: Building,
      grades: "9-12",
    },
  ].filter((school) => school.name);

  const hasSchools = schools.length > 0 || !!schoolDistrict;
  const hasAmenities = amenities && amenities.length > 0;

  // Determine default tab
  const defaultTab = hasSchools ? "schools" : "amenities";

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
          Schools & Amenities
        </h2>
        <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          {hasSchools && (
            <TabsTrigger value="schools" className="text-sm font-semibold">
              Schools
            </TabsTrigger>
          )}
          {hasAmenities && (
            <TabsTrigger value="amenities" className="text-sm font-semibold">
              Amenities
            </TabsTrigger>
          )}
        </TabsList>

        {/* Schools Tab Content */}
        {hasSchools && (
          <TabsContent value="schools" className="mt-0">
            {schoolDistrict && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <GraduationCap className="size-5 text-main-primary" />
                <p className="text-gray-600">
                  <span className="font-medium text-main-primary">{schoolDistrict}</span>{" "}
                  School District
                </p>
              </div>
            )}

            {schools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {schools.map((school, index) => {
                  const Icon = school.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center size-12 bg-main-primary/5 rounded-lg">
                          <Icon className="size-6 text-main-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{school.level}</p>
                          <p className="text-xs text-gray-400">Grades {school.grades}</p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-main-primary">{school.name}</h3>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-6 text-center">
              School assignments may vary. Please verify with the school district for current boundaries.
            </p>
          </TabsContent>
        )}

        {/* Amenities Tab Content */}
        {hasAmenities && (
          <TabsContent value="amenities" className="mt-0">
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
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
