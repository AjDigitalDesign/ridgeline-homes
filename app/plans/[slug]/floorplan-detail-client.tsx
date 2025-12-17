"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Floorplan } from "@/lib/api";
import { Lightbox } from "@/components/ui/lightbox";
import {
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
  MapPin,
  ArrowRight,
  Camera,
  Calendar,
  Calculator,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { getStateSlug, getCitySlug } from "@/lib/url";
import { getHomeStatusBadge } from "@/lib/home-status";

import BackNavigation from "./components/back-navigation";
import HeroGallery from "./components/hero-gallery";
import FloorplanHeader from "./components/floorplan-header";
import DetailNavigation, {
  type FloorplanSectionId,
  type FloorplanSection,
} from "./components/detail-navigation";
import SalesTeamSection from "./components/sales-team-section";
import FloorplanContactForm from "./components/contact-form";

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

function formatPrice(price: number | null) {
  if (!price) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMonthlyPayment(price: number | null) {
  if (!price) return null;
  const monthlyRate = 0.065 / 12;
  const numPayments = 360;
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthly =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthly);
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

interface FloorplanDetailClientProps {
  floorplan: Floorplan;
}

export default function FloorplanDetailClient({
  floorplan,
}: FloorplanDetailClientProps) {
  const [activeSection, setActiveSection] = useState<FloorplanSectionId>("overview");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalType, setContactModalType] = useState<"tour" | "info">("tour");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorPrice, setCalculatorPrice] = useState(0);
  const [calculatorName, setCalculatorName] = useState("");

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<FloorplanSectionId, HTMLElement | null>>({
    overview: null,
    description: null,
    elevations: null,
    floorplans: null,
    virtualtour: null,
    videotour: null,
    features: null,
    homes: null,
  });

  // Determine which sections should be visible based on data
  const hasDescription = !!floorplan.description;
  const hasElevations = (floorplan.elevationGallery?.length ?? 0) > 0;
  const hasFloorplans = (floorplan.plansImages?.length ?? 0) > 0;
  const hasVirtualTour = !!floorplan.virtualTourUrl || !!floorplan.interactivePlanUrl;
  const hasVideoTour = !!floorplan.videoUrl;
  const hasFeatures = (floorplan.features?.length ?? 0) > 0;
  const hasHomes = (floorplan.homes?.length ?? 0) > 0;
  const hasSalesTeam = (floorplan.salesTeams?.length ?? 0) > 0;

  const sections: FloorplanSection[] = [
    { id: "overview", label: "Overview", visible: true },
    { id: "description", label: "About", visible: hasDescription },
    { id: "elevations", label: "Elevations", visible: hasElevations },
    { id: "floorplans", label: "Floor Plans", visible: hasFloorplans },
    { id: "virtualtour", label: "Virtual Tour", visible: hasVirtualTour },
    { id: "videotour", label: "Video Tour", visible: hasVideoTour },
    { id: "features", label: "Plan Features", visible: hasFeatures },
    { id: "homes", label: "Available Homes", visible: hasHomes },
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
          rootMargin: "-150px 0px -50% 0px",
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [visibleSections]);

  const scrollToSection = (sectionId: FloorplanSectionId) => {
    if (sectionId === "overview") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 150;
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

  const openGallery = (images: string[], index: number = 0, title: string) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  // Combine all images for the main hero gallery
  const heroImages = floorplan.gallery?.length > 0
    ? floorplan.gallery
    : floorplan.elevationGallery?.length > 0
      ? floorplan.elevationGallery
      : [];

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Back Navigation */}
      <BackNavigation floorplan={floorplan} />

      {/* Hero Gallery - Full width image grid */}
      <div className="relative">
        <HeroGallery
          gallery={heroImages}
          floorplanName={floorplan.name}
          onOpenGallery={(index) => openGallery(heroImages, index, `${floorplan.name} Gallery`)}
        />
      </div>

      {/* Floorplan Header - Info, Price, CTA */}
      <FloorplanHeader
        floorplan={floorplan}
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
        {/* 1. Description Section (About This Floor Plan) */}
        {hasDescription && (
          <section
            id="description"
            ref={(el) => {
              sectionRefs.current.description = el;
            }}
            className="scroll-mt-[150px]"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                About the {floorplan.name}
              </h2>
              {floorplan.headline && (
                <p className="text-lg text-gray-600">{floorplan.headline}</p>
              )}
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed">
                {stripHtml(floorplan.description)}
              </p>
            </div>
          </section>
        )}

        {/* 2. Elevations Gallery Section */}
        {hasElevations && (
          <section
            id="elevations"
            ref={(el) => {
              sectionRefs.current.elevations = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                Elevations
              </h2>
              <p className="text-gray-600 mt-2">Exterior design options for the {floorplan.name}</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {floorplan.elevationGallery?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openGallery(floorplan.elevationGallery!, index, `${floorplan.name} Elevations`)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`${floorplan.name} Elevation ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. Floor Plans Images Section */}
        {hasFloorplans && (
          <section
            id="floorplans"
            ref={(el) => {
              sectionRefs.current.floorplans = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                Floor Plan Layouts
              </h2>
              <p className="text-gray-600 mt-2">View the layout options for the {floorplan.name}</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className={`grid gap-6 ${
              (floorplan.plansImages?.length ?? 0) === 1
                ? "grid-cols-1 max-w-2xl mx-auto"
                : "grid-cols-1 md:grid-cols-2"
            }`}>
              {floorplan.plansImages?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openGallery(floorplan.plansImages!, index, `${floorplan.name} Floor Plans`)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`${floorplan.name} Floor Plan ${index + 1}`}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 4. Virtual Tour / Interactive Plan Section */}
        {hasVirtualTour && (
          <section
            id="virtualtour"
            ref={(el) => {
              sectionRefs.current.virtualtour = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                {floorplan.interactivePlanUrl ? "Interactive Floor Plan" : "Virtual Tour"}
              </h2>
              <p className="text-gray-600 mt-2">Explore the {floorplan.name} interactively</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={floorplan.interactivePlanUrl || floorplan.virtualTourUrl || ""}
                title={`${floorplan.name} Virtual Tour`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* 5. Video Tour Section */}
        {hasVideoTour && floorplan.videoUrl && (
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
              <p className="text-gray-600 mt-2">Watch a walkthrough of the {floorplan.name}</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={(() => {
                  const url = floorplan.videoUrl!;
                  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
                })()}
                title={`${floorplan.name} Video Tour`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </section>
        )}

        {/* 6. Features Section */}
        {hasFeatures && (
          <section
            id="features"
            ref={(el) => {
              sectionRefs.current.features = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
                Plan Features
              </h2>
              <p className="text-gray-600 mt-2">Included features with the {floorplan.name}</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {floorplan.features?.map((feature, index) => {
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
          </section>
        )}

        {/* 7. Available Homes Section */}
        {hasHomes && (
          <section
            id="homes"
            ref={(el) => {
              sectionRefs.current.homes = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
                Available Homes
              </h2>
              <p className="text-gray-600 mt-2">Homes available with the {floorplan.name} floor plan</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className={`grid gap-6 ${
              (floorplan.homes?.length ?? 0) === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {floorplan.homes?.map((home, index) => {
                const homeUrl = home.community
                  ? `/homes/${getStateSlug(home.community.state)}/${getCitySlug(home.community.city)}/${home.community.slug}/${home.slug}`
                  : `/homes/${home.slug}`;
                const location = home.community
                  ? `${home.community.name}${home.community.city ? `, ${home.community.city}` : ""}`
                  : [home.city, home.state].filter(Boolean).join(", ");
                const galleryImages = home.gallery || [];

                return (
                  <div
                    key={index}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    <div className="relative h-[200px] lg:h-[220px] overflow-hidden">
                      {home.gallery?.[0] ? (
                        <Image
                          src={home.gallery[0]}
                          alt={home.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <MapPin className="size-12 text-gray-400" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 text-xs font-semibold uppercase rounded-full ${getHomeStatusBadge(home.status).className}`}>
                          {getHomeStatusBadge(home.status).label}
                        </span>
                      </div>
                      {/* Favorite Icon */}
                      <FavoriteButton
                        type="home"
                        itemId={home.id}
                        className="absolute top-4 right-4"
                      />
                      {/* Bottom Actions */}
                      <div
                        className={`absolute left-4 flex items-center gap-2 ${
                          home.marketingHeadline && home.showMarketingHeadline
                            ? "bottom-12"
                            : "bottom-4"
                        }`}
                      >
                        {galleryImages.length > 0 && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/90 text-white text-xs rounded-full">
                            <Camera className="size-3.5" />
                            {galleryImages.length} Photos
                          </span>
                        )}
                        <span className="flex items-center justify-center size-8 bg-main-secondary rounded-full">
                          <MapPin className="size-4 text-main-primary" />
                        </span>
                      </div>
                      {/* Marketing Headline Banner */}
                      {home.marketingHeadline && home.showMarketingHeadline && (
                        <div className="absolute bottom-0 left-0 right-0 bg-main-secondary px-4 py-2">
                          <p className="text-sm font-medium text-main-primary truncate">
                            {home.marketingHeadline}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 lg:p-5">
                      {/* Title & Price */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base lg:text-lg font-bold text-main-primary group-hover:text-main-primary/80 transition-colors truncate">
                            {home.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">{location}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base lg:text-lg font-bold text-main-primary">
                            {formatPrice(home.price) || "Contact for Price"}
                          </p>
                          {home.price && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalculatorPrice(home.price!);
                                setCalculatorName(home.name);
                                setCalculatorOpen(true);
                              }}
                              className="text-xs text-gray-500 flex items-center gap-1 justify-end hover:text-main-primary transition-colors"
                            >
                              {formatMonthlyPayment(home.price)}/mo
                              <Calculator className="size-4 text-tertiary" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 lg:gap-4 mt-4 pt-4 border-t border-gray-100">
                        {home.bedrooms && (
                          <div className="text-center">
                            <p className="text-sm font-semibold text-main-primary">
                              {home.bedrooms}
                            </p>
                            <p className="text-xs text-gray-500">Beds</p>
                          </div>
                        )}
                        {home.bathrooms && (
                          <div className="text-center">
                            <p className="text-sm font-semibold text-main-primary">
                              {home.bathrooms}
                            </p>
                            <p className="text-xs text-gray-500">Baths</p>
                          </div>
                        )}
                        {home.squareFeet && (
                          <div className="text-center">
                            <p className="text-sm font-semibold text-main-primary">
                              {home.squareFeet.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">SQ FT</p>
                          </div>
                        )}
                        {home.garages && (
                          <div className="text-center">
                            <p className="text-sm font-semibold text-main-primary">
                              {home.garages}
                            </p>
                            <p className="text-xs text-gray-500">Garage</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 lg:gap-3 mt-4">
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 bg-main-secondary text-main-primary hover:bg-main-secondary/90 text-xs lg:text-sm"
                        >
                          <Link href={`${homeUrl}?schedule=true`}>
                            <Calendar className="size-3.5 lg:size-4 mr-1" />
                            Schedule Tour
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1 border-main-primary text-main-primary hover:bg-main-primary hover:text-white text-xs lg:text-sm"
                        >
                          <Link href={homeUrl}>
                            Detail
                            <ArrowRight className="size-3.5 lg:size-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Sales Team Section */}
        {hasSalesTeam && floorplan.salesTeams && (
          <section className="mt-12 lg:mt-16">
            <SalesTeamSection salesTeams={floorplan.salesTeams} />
          </section>
        )}

        {/* Contact Section */}
        <section className="scroll-mt-[150px] mt-12 lg:mt-16">
          <FloorplanContactForm
            floorplan={floorplan}
            isModal={false}
            type="info"
            onClose={() => {}}
          />
        </section>
      </div>

      {/* Gallery Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={lightboxTitle}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <FloorplanContactForm
          floorplan={floorplan}
          isModal={true}
          type={contactModalType}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Mortgage Calculator Modal */}
      <MortgageCalculator
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        initialPrice={calculatorPrice}
        propertyName={calculatorName}
      />
    </main>
  );
}
