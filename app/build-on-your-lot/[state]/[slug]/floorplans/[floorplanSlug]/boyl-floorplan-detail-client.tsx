"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BOYLFloorplan, BOYLLocation } from "@/lib/api";
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
  ArrowLeft,
  Camera,
  Calendar,
  ArrowRight,
  Calculator,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { ContactForm } from "@/components/forms";

// Section types for navigation
type FloorplanSectionId =
  | "overview"
  | "description"
  | "elevations"
  | "floorplans"
  | "virtualtour"
  | "videotour"
  | "features";

interface FloorplanSection {
  id: FloorplanSectionId;
  label: string;
  visible: boolean;
}

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

function calculateMonthlyPayment(price: number) {
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthlyRate = 0.065 / 12;
  const numPayments = 30 * 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthlyPayment);
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

interface BOYLFloorplanDetailClientProps {
  floorplan: BOYLFloorplan;
  location: BOYLLocation;
  state: string;
  locationSlug: string;
}

export default function BOYLFloorplanDetailClient({
  floorplan,
  location,
  state,
  locationSlug,
}: BOYLFloorplanDetailClientProps) {
  const [activeSection, setActiveSection] = useState<FloorplanSectionId>("overview");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalType, setContactModalType] = useState<"tour" | "info">("tour");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<FloorplanSectionId, HTMLElement | null>>({
    overview: null,
    description: null,
    elevations: null,
    floorplans: null,
    virtualtour: null,
    videotour: null,
    features: null,
  });

  // Determine which sections should be visible based on data
  const hasDescription = !!floorplan.description;
  const hasElevations = (floorplan.elevationGallery?.length ?? 0) > 0;
  const hasFloorplans = (floorplan.plansImages?.length ?? 0) > 0;
  const hasVirtualTour = !!floorplan.virtualTourUrl;
  const hasVideoTour = !!floorplan.videoUrl;
  const hasFeatures = (floorplan.features?.length ?? 0) > 0;

  const sections: FloorplanSection[] = [
    { id: "overview", label: "Overview", visible: true },
    { id: "description", label: "About", visible: hasDescription },
    { id: "elevations", label: "Elevations", visible: hasElevations },
    { id: "floorplans", label: "Floor Plans", visible: hasFloorplans },
    { id: "virtualtour", label: "Virtual Tour", visible: hasVirtualTour },
    { id: "videotour", label: "Video Tour", visible: hasVideoTour },
    { id: "features", label: "Plan Features", visible: hasFeatures },
  ];

  const visibleSections = sections.filter((s) => s.visible);

  // Back URL
  const backUrl = `/build-on-your-lot/${state.toLowerCase()}/${locationSlug}/floorplans`;

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
      <div className="bg-white border-b h-12">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <Link
              href={backUrl}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-primary transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back To Floor Plans</span>
            </Link>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden lg:inline">{location.name}</span>
              <span className="hidden lg:inline">|</span>
              <span className="text-main-primary font-medium">{floorplan.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Gallery */}
      <HeroGallery
        gallery={heroImages}
        floorplanName={floorplan.name}
        onOpenGallery={(index) => openGallery(heroImages, index, `${floorplan.name} Gallery`)}
      />

      {/* Floorplan Header - Using BOYL location-specific data */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Side - Floorplan Info */}
            <div className="flex-1">
              {/* Top Row: Name + Price */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                {/* Name */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-main-primary mb-1">
                    {floorplan.name}
                  </h1>
                  <p className="text-base text-gray-500">
                    Build on Your Lot - {location.county}, {location.state}
                  </p>
                </div>

                {/* Price Section - Location-specific price */}
                <div className="lg:text-right">
                  <p className="text-sm text-gray-500 mb-1">Starting From</p>
                  <p className="text-3xl lg:text-4xl font-bold text-main-primary">
                    {formatPrice(floorplan.price) || "Contact Us"}
                  </p>
                  {floorplan.price && (
                    <button
                      onClick={() => setCalculatorOpen(true)}
                      className="flex items-center gap-2 lg:justify-end mt-1 hover:opacity-80 transition-opacity"
                    >
                      <span className="text-sm text-gray-500">Est. Payment</span>
                      <span className="text-sm font-semibold text-main-primary">
                        {calculateMonthlyPayment(floorplan.price)} / MO
                      </span>
                      <span className="p-1 rounded">
                        <Calculator className="size-5 lg:size-6 text-tertiary" />
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Section - Location-specific stats */}
              <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  {floorplan.bedrooms && (
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                        {floorplan.bedrooms}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Beds
                      </p>
                    </div>
                  )}
                  {floorplan.bathrooms && (
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                        {floorplan.bathrooms}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Baths
                      </p>
                    </div>
                  )}
                  {floorplan.sqft && (
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                        {floorplan.sqft.toLocaleString()}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Sq Ft
                      </p>
                    </div>
                  )}
                  {floorplan.garages && (
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                        {floorplan.garages}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Car Garage
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Info */}
              <div className="flex items-center gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Location</span>
                  <br />
                  <span className="font-semibold text-main-primary">
                    {location.county}, {location.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Card */}
            <div className="lg:w-[400px] xl:w-[440px] shrink-0">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl lg:text-2xl font-bold text-main-primary mb-1">
                  Interested in the {floorplan.name}?
                </h2>
                <p className="text-sm text-gray-600 mb-5">
                  Build this floor plan on your lot in {location.county}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={openScheduleTour}
                    className="w-full bg-main-primary text-white hover:bg-main-primary/90"
                  >
                    <Calendar className="size-4 mr-2" />
                    Schedule Consultation
                  </Button>
                  <Button
                    onClick={openRequestInfo}
                    className="w-full bg-main-secondary text-main-primary hover:bg-main-secondary/80 border-0"
                  >
                    Get More Info
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Navigation */}
      <DetailNavigation
        sections={visibleSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        onScheduleTour={openScheduleTour}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        {/* 1. Description Section */}
        {hasDescription && (
          <section
            id="description"
            ref={(el) => {
              sectionRefs.current.description = el;
            }}
            className="scroll-mt-[120px] xl:scroll-mt-[176px]"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                About the {floorplan.name}
              </h2>
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
            className="scroll-mt-[120px] xl:scroll-mt-[176px] mt-12 lg:mt-16"
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
            className="scroll-mt-[120px] xl:scroll-mt-[176px] mt-12 lg:mt-16"
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

        {/* 4. Virtual Tour Section */}
        {hasVirtualTour && (
          <section
            id="virtualtour"
            ref={(el) => {
              sectionRefs.current.virtualtour = el;
            }}
            className="scroll-mt-[120px] xl:scroll-mt-[176px] mt-12 lg:mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
                Virtual Tour
              </h2>
              <p className="text-gray-600 mt-2">Explore the {floorplan.name} interactively</p>
              <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
            </div>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={floorplan.virtualTourUrl || ""}
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
            className="scroll-mt-[120px] xl:scroll-mt-[176px] mt-12 lg:mt-16"
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
            className="scroll-mt-[120px] xl:scroll-mt-[176px] mt-12 lg:mt-16"
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

        {/* Contact Section */}
        <section className="scroll-mt-[120px] xl:scroll-mt-[176px] mt-12 lg:mt-16">
          <div>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
                Contact Us
              </h2>
              <p className="text-gray-600 mt-1">
                Interested in building the {floorplan.name} on your lot? Get in touch with our team.
              </p>
              <div className="w-16 h-1 bg-main-secondary mt-3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-main-primary mb-4">
                  Send Us a Message
                </h3>
                <ContactForm
                  type="info"
                  floorplanId={floorplan.floorplanId}
                  entityName={floorplan.name}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-main-secondary rounded-xl p-6">
                  <h3 className="font-semibold text-main-primary mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={openScheduleTour}
                      className="w-full bg-main-primary hover:bg-main-primary/90"
                    >
                      <Calendar className="size-4 mr-2" />
                      Schedule a Consultation
                    </Button>
                  </div>
                </div>

                {/* Floorplan Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-main-primary mb-4">
                    Floor Plan Information
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Floor Plan</dt>
                      <dd className="font-medium text-main-primary">{floorplan.name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Location</dt>
                      <dd className="font-medium text-main-primary">
                        {location.county}, {location.state}
                      </dd>
                    </div>
                    {floorplan.sqft && (
                      <div>
                        <dt className="text-gray-500">Square Feet</dt>
                        <dd className="font-medium text-main-primary">
                          {floorplan.sqft.toLocaleString()} sq ft
                        </dd>
                      </div>
                    )}
                    {floorplan.price && (
                      <div>
                        <dt className="text-gray-500">Starting Price</dt>
                        <dd className="font-medium text-main-primary">
                          {formatPrice(floorplan.price)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
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
        <ContactForm
          type={contactModalType}
          floorplanId={floorplan.floorplanId}
          entityName={floorplan.name}
          isModal={true}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Mortgage Calculator Modal */}
      <MortgageCalculator
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        initialPrice={floorplan.price || 400000}
        propertyName={floorplan.name}
      />
    </main>
  );
}

// Hero Gallery Component
interface HeroGalleryProps {
  gallery: string[];
  floorplanName: string;
  onOpenGallery: (index: number) => void;
}

function HeroGallery({
  gallery,
  floorplanName,
  onOpenGallery,
}: HeroGalleryProps) {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="w-full h-[300px] lg:h-[500px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Get up to 5 images for the grid (1 main + 4 thumbnails)
  const mainImage = gallery[0];
  const thumbnails = gallery.slice(1, 5);
  const remainingCount = gallery.length - 5;

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3 h-[300px] lg:h-[500px]">
        {/* Main Large Image - Left Side */}
        <button
          onClick={() => onOpenGallery(0)}
          className="relative lg:col-span-2 overflow-hidden rounded-xs group"
        >
          <Image
            src={mainImage}
            alt={`${floorplanName} - Main`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Right Side - 2x2 Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-2 lg:gap-3">
          {thumbnails.map((image, index) => (
            <button
              key={index}
              onClick={() => onOpenGallery(index + 1)}
              className="relative overflow-hidden rounded-xs group"
            >
              <Image
                src={image}
                alt={`${floorplanName} - Image ${index + 2}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Show remaining count overlay on last thumbnail */}
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="size-6 mx-auto mb-1" />
                    <p className="text-sm font-semibold">
                      +{remainingCount} more
                    </p>
                  </div>
                </div>
              )}
            </button>
          ))}

          {/* Fill empty slots if less than 4 thumbnails */}
          {thumbnails.length < 4 &&
            Array.from({ length: 4 - thumbnails.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-100 rounded-lg lg:rounded-xl"
              />
            ))}
        </div>
      </div>

      {/* Photos Button */}
      <button
        onClick={() => onOpenGallery(0)}
        className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg transition-colors z-10"
      >
        <Camera className="size-4 text-main-primary" />
        <span className="text-sm font-medium text-main-primary">
          {gallery.length} Photos
        </span>
      </button>
    </div>
  );
}

// Detail Navigation Component
interface DetailNavigationProps {
  sections: FloorplanSection[];
  activeSection: FloorplanSectionId;
  onSectionClick: (sectionId: FloorplanSectionId) => void;
  onScheduleTour: () => void;
}

function DetailNavigation({
  sections,
  activeSection,
  onSectionClick,
  onScheduleTour,
}: DetailNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScrollability, 300);
  };

  return (
    <nav className="sticky top-16 xl:top-[120px] z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex items-center justify-between h-14">
          {/* Section Tabs */}
          <div className="relative flex-1 overflow-hidden">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-8 bg-white shadow-md rounded-full lg:hidden"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}

            {/* Tabs Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollability}
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-8 lg:px-0"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                    activeSection === section.id
                      ? "bg-main-primary text-white"
                      : "text-main-primary hover:bg-gray-100"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-8 bg-white shadow-md rounded-full lg:hidden"
              >
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>

          {/* Schedule Tour CTA */}
          <div className="hidden lg:block ml-4">
            <Button
              onClick={onScheduleTour}
              size="sm"
              className="bg-main-secondary text-main-primary hover:bg-main-secondary/90"
            >
              <Calendar className="size-4 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
