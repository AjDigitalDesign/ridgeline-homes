"use client";

import { useState, useEffect, useRef } from "react";
import type { Home } from "@/lib/api";
import { Lightbox } from "@/components/ui/lightbox";
import {
  GraduationCap,
  School,
  Building,
  BookOpen,
  Sparkles,
  Waves,
  Home as HomeIcon,
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

import BackNavigation from "./components/back-navigation";
import HeroGallery from "./components/hero-gallery";
import HomeHeader from "./components/home-header";
import DetailNavigation, {
  type HomeSectionId,
  type HomeSection,
} from "./components/detail-navigation";
import OverviewSection from "./components/overview-section";
import FloorplanSection from "./components/floorplan-section";
import LocationSection from "./components/location-section";
import SalesTeamSection from "./components/sales-team-section";
import HomeContactForm from "./components/contact-form";

// Map common feature keywords to icons
function getFeatureIcon(feature: string): LucideIcon {
  const lowerFeature = feature.toLowerCase();

  if (lowerFeature.includes("pool") || lowerFeature.includes("swim")) return Waves;
  if (lowerFeature.includes("clubhouse") || lowerFeature.includes("club house")) return HomeIcon;
  if (lowerFeature.includes("fitness") || lowerFeature.includes("gym") || lowerFeature.includes("workout")) return Dumbbell;
  if (lowerFeature.includes("playground") || lowerFeature.includes("kids") || lowerFeature.includes("children")) return Baby;
  if (lowerFeature.includes("trail") || lowerFeature.includes("walking") || lowerFeature.includes("hiking")) return Footprints;
  if (lowerFeature.includes("park") || lowerFeature.includes("green") || lowerFeature.includes("nature")) return Trees;
  if (lowerFeature.includes("garage") || lowerFeature.includes("parking")) return Car;
  if (lowerFeature.includes("shop") || lowerFeature.includes("retail") || lowerFeature.includes("store")) return ShoppingBag;
  if (lowerFeature.includes("restaurant") || lowerFeature.includes("dining") || lowerFeature.includes("food")) return UtensilsCrossed;
  if (lowerFeature.includes("bike") || lowerFeature.includes("cycling")) return Bike;
  if (lowerFeature.includes("dog") || lowerFeature.includes("pet")) return Dog;
  if (lowerFeature.includes("tennis") || lowerFeature.includes("court") || lowerFeature.includes("sport")) return CircleDot;
  if (lowerFeature.includes("lake") || lowerFeature.includes("pond") || lowerFeature.includes("water")) return Palmtree;
  if (lowerFeature.includes("school") || lowerFeature.includes("education")) return Building2;
  if (lowerFeature.includes("gate") || lowerFeature.includes("security") || lowerFeature.includes("guard")) return Shield;
  if (lowerFeature.includes("wifi") || lowerFeature.includes("internet") || lowerFeature.includes("smart")) return Wifi;
  if (lowerFeature.includes("view") || lowerFeature.includes("mountain") || lowerFeature.includes("scenic")) return Mountain;

  return Sparkles;
}

interface HomeDetailClientProps {
  home: Home;
}

export default function HomeDetailClient({
  home,
}: HomeDetailClientProps) {
  const [activeSection, setActiveSection] = useState<HomeSectionId>("overview");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalType, setContactModalType] = useState<"tour" | "info">("tour");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<HomeSectionId, HTMLElement | null>>({
    overview: null,
    description: null,
    floorplan: null,
    virtualtour: null,
    videotour: null,
    details: null,
    gallery: null,
    specifications: null,
    location: null,
  });

  // Determine which sections should be visible based on data
  const hasFloorplan = (home.floorPlanGallery?.length ?? 0) > 0;
  const hasVirtualTour = !!home.virtualTourUrl;
  const hasVideoTour = !!home.videoUrl;
  const hasFeatures = (home.features?.length ?? 0) > 0;
  const hasSchools = !!(
    home.elementarySchool ||
    home.middleSchool ||
    home.highSchool ||
    home.schoolDistrict
  );
  const hasDetails = hasFeatures || hasSchools;
  const hasLocation = !!(home.latitude && home.longitude);
  const hasSalesTeam = (home.salesTeams?.length ?? 0) > 0;

  // Determine default tab for details section
  const defaultDetailsTab = hasSchools ? "schools" : "features";

  const sections: HomeSection[] = [
    { id: "overview", label: "Overview", visible: true },
    { id: "description", label: "Description", visible: true },
    { id: "floorplan", label: "Floor Plan", visible: hasFloorplan },
    { id: "virtualtour", label: "Virtual Tour", visible: hasVirtualTour },
    { id: "details", label: "Home Details", visible: hasDetails },
    { id: "videotour", label: "Video Tour", visible: hasVideoTour },
    { id: "location", label: "Location & Directions", visible: hasLocation },
  ];

  const visibleSections = sections.filter((s) => s.visible);

  // Scroll tracking with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    visibleSections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              setActiveSection(section.id);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "-150px 0px -50% 0px", // Account for fixed header (80px) + sticky detail nav (56px) + padding
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [visibleSections]);

  const scrollToSection = (sectionId: HomeSectionId) => {
    // Overview scrolls to top of page (header section)
    if (sectionId === "overview") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 150; // Account for fixed header (80px) + sticky detail nav (56px) + padding
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const openScheduleTour = () => {
    setContactModalType("tour");
    setShowContactModal(true);
  };

  const openRequestInfo = () => {
    setContactModalType("info");
    setShowContactModal(true);
  };

  const openGallery = (index: number = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const homeName = home.address || home.street || home.name;

  // Build schools array for tabs
  const schools = [
    {
      level: "Elementary School",
      name: home.elementarySchool,
      icon: BookOpen,
      grades: "K-5",
    },
    {
      level: "Middle School",
      name: home.middleSchool,
      icon: School,
      grades: "6-8",
    },
    {
      level: "High School",
      name: home.highSchool,
      icon: Building,
      grades: "9-12",
    },
  ].filter((school) => school.name);

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Back Navigation */}
      <BackNavigation home={home} />

      {/* Hero Gallery - Full width image grid */}
      <div className="relative">
        <HeroGallery
          gallery={home.gallery || []}
          homeName={homeName}
          onOpenGallery={openGallery}
        />
      </div>

      {/* Home Header - Info, Price, CTA */}
      <HomeHeader
        home={home}
        onScheduleTour={openScheduleTour}
        onRequestInfo={openRequestInfo}
      />

      {/* Detail Navigation */}
      <DetailNavigation
        sections={visibleSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        onScheduleTour={openScheduleTour}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        {/* 1. Description Section (About This Home) */}
        <section
          id="description"
          ref={(el) => {
            sectionRefs.current.description = el;
          }}
          className="scroll-mt-[150px]"
        >
          <OverviewSection home={home} />
        </section>

        {/* 2. Floor Plan Section */}
        {hasFloorplan && (
          <section
            id="floorplan"
            ref={(el) => {
              sectionRefs.current.floorplan = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <FloorplanSection home={home} />
          </section>
        )}

        {/* 3. Virtual Tour Section */}
        {hasVirtualTour && home.virtualTourUrl && (
          <section
            id="virtualtour"
            ref={(el) => {
              sectionRefs.current.virtualtour = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                Virtual Tour
              </h2>
              <p className="text-gray-600 mt-2">Explore {homeName} from anywhere</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={home.virtualTourUrl}
                title={`${homeName} Virtual Tour`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* 4. Details Section (Features & Schools Tabs) */}
        {hasDetails && (
          <section
            id="details"
            ref={(el) => {
              sectionRefs.current.details = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
                Home Details
              </h2>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue={defaultDetailsTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                {hasSchools && (
                  <TabsTrigger value="schools" className="text-sm font-semibold">
                    Schools
                  </TabsTrigger>
                )}
                {hasFeatures && (
                  <TabsTrigger value="features" className="text-sm font-semibold">
                    Features
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Schools Tab Content */}
              {hasSchools && (
                <TabsContent value="schools" className="mt-0">
                  {home.schoolDistrict && (
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <GraduationCap className="size-5 text-main-primary" />
                      <p className="text-gray-600">
                        <span className="font-medium text-main-primary">{home.schoolDistrict}</span>{" "}
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

              {/* Features Tab Content */}
              {hasFeatures && (
                <TabsContent value="features" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {home.features?.map((feature, index) => {
                      const Icon = getFeatureIcon(feature);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center justify-center size-10 bg-main-primary/5 rounded-lg shrink-0">
                            <Icon className="size-5 text-main-primary" />
                          </div>
                          <span className="text-sm font-medium text-main-primary">
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </section>
        )}

        {/* 5. Video Tour Section */}
        {hasVideoTour && home.videoUrl && (
          <section
            id="videotour"
            ref={(el) => {
              sectionRefs.current.videotour = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                Video Tour
              </h2>
              <p className="text-gray-600 mt-2">Watch a walkthrough of {homeName}</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={(() => {
                  const url = home.videoUrl!;
                  // Convert YouTube watch URLs to embed URLs
                  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
                })()}
                title={`${homeName} Video Tour`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </section>
        )}

        {/* 6. Map & Directions Section */}
        {hasLocation && (
          <section
            id="location"
            ref={(el) => {
              sectionRefs.current.location = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <LocationSection home={home} />
          </section>
        )}

        {/* Sales Team Section */}
        {hasSalesTeam && home.salesTeams && (
          <section className="mt-12 lg:mt-16">
            <SalesTeamSection salesTeams={home.salesTeams} />
          </section>
        )}

        {/* Contact Section */}
        <section className="scroll-mt-[150px] mt-12 lg:mt-16">
          <HomeContactForm
            home={home}
            isModal={false}
            type="info"
            onClose={() => {}}
          />
        </section>
      </div>

      {/* Gallery Lightbox */}
      <Lightbox
        images={home.gallery || []}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={`${homeName} Gallery`}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <HomeContactForm
          home={home}
          isModal={true}
          type={contactModalType}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </main>
  );
}
