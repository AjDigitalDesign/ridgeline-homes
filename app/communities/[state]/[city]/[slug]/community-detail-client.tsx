"use client";

import { useState, useEffect, useRef } from "react";
import type { Community, Floorplan } from "@/lib/api";
import type { CommunityHome } from "./components/homes-section";
import { Lightbox } from "@/components/ui/lightbox";

import BackNavigation from "./components/back-navigation";
import HeroGallery from "./components/hero-gallery";
import CommunityHeader from "./components/community-header";
import DetailNavigation from "./components/detail-navigation";
import OverviewSection from "./components/overview-section";
import FloorplansSection from "./components/floorplans-section";
import HomesSection from "./components/homes-section";
import SchoolsAmenitiesSection from "./components/schools-amenities-section";
import VideoSection from "./components/video-section";
import AreaMapSection from "./components/area-map-section";
import ContactSection from "./components/contact-section";
import ContactForm from "./components/contact-form";
import { ContactForm as ReusableContactForm } from "@/components/forms";

interface CommunityDetailClientProps {
  community: Community;
  homes: CommunityHome[];
  floorplans: Floorplan[];
}

interface ScheduleModalState {
  open: boolean;
  type: "home" | "floorplan" | "community";
  homeId?: string;
  floorplanId?: string;
  entityName?: string;
}

export type SectionId =
  | "description"
  | "homes"
  | "floorplans"
  | "amenities"
  | "video"
  | "area"
  | "contact";

export interface Section {
  id: SectionId;
  label: string;
  visible: boolean;
}

export default function CommunityDetailClient({
  community,
  homes,
  floorplans,
}: CommunityDetailClientProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("description");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalType, setContactModalType] = useState<"tour" | "info">(
    "tour"
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Schedule tour modal state for homes/floorplans
  const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>({
    open: false,
    type: "community",
  });

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    description: null,
    homes: null,
    floorplans: null,
    amenities: null,
    video: null,
    area: null,
    contact: null,
  });

  // Determine which sections should be visible based on data
  const hasSchools =
    community.schoolDistrict ||
    community.elementarySchool ||
    community.middleSchool ||
    community.highSchool;

  const hasAmenitiesOrSchools =
    (community.amenities?.length ?? 0) > 0 || !!hasSchools;

  const hasAreaMap =
    community.nearbyPlacesEnabled &&
    (community.nearbyPlaceCategories?.length ?? 0) > 0;

  const sections: Section[] = [
    { id: "description", label: "Description", visible: true },
    { id: "floorplans", label: "Floor Plans", visible: floorplans.length > 0 },
    { id: "homes", label: "Available Homes", visible: homes.length > 0 },
    {
      id: "amenities",
      label: "Schools & Amenities",
      visible: hasAmenitiesOrSchools,
    },
    { id: "area", label: "Area Map", visible: !!hasAreaMap },
    { id: "video", label: "Community Video", visible: !!community.videoUrl },
    { id: "contact", label: "Contact Us", visible: true },
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

  const scrollToSection = (sectionId: SectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 150; // Account for sticky nav
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
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

  const handleScheduleHomeTour = (homeId: string, homeName: string) => {
    setScheduleModal({
      open: true,
      type: "home",
      homeId,
      entityName: homeName,
    });
  };

  const handleScheduleFloorplanTour = (floorplanId: string, floorplanName: string) => {
    setScheduleModal({
      open: true,
      type: "floorplan",
      floorplanId,
      entityName: floorplanName,
    });
  };

  const closeScheduleModal = () => {
    setScheduleModal({ open: false, type: "community" });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Back Navigation */}
      <BackNavigation community={community} />

      {/* Hero Gallery - Full width image grid */}
      <div className="relative">
        <HeroGallery
          gallery={community.gallery || []}
          communityName={community.name}
          onOpenGallery={openGallery}
        />
      </div>

      {/* Community Header - Info, Price, Agent Card */}
      <CommunityHeader
        community={community}
        floorplansCount={floorplans.length}
        homesCount={homes.length}
        onScheduleTour={openScheduleTour}
        onRequestInfo={openRequestInfo}
      />

      {/* Detail Navigation */}
      <DetailNavigation
        sections={visibleSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        onScheduleTour={openScheduleTour}
        floorplansCount={floorplans.length}
        homesCount={homes.length}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        {/* 1. Description Section - Marketing headline & description */}
        <section
          id="description"
          ref={(el) => {
            sectionRefs.current.description = el;
          }}
          className="scroll-mt-[150px]"
        >
          <OverviewSection community={community} homesCount={homes.length} />
        </section>

        {/* 2. Floorplans Section */}
        {floorplans.length > 0 && (
          <section
            id="floorplans"
            ref={(el) => {
              sectionRefs.current.floorplans = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <FloorplansSection
              floorplans={floorplans}
              communitySlug={community.slug}
              onScheduleTour={handleScheduleFloorplanTour}
            />
          </section>
        )}

        {/* 3. Homes Section */}
        {homes.length > 0 && (
          <section
            id="homes"
            ref={(el) => {
              sectionRefs.current.homes = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <HomesSection
              homes={homes}
              communitySlug={community.slug}
              onScheduleTour={handleScheduleHomeTour}
            />
          </section>
        )}

        {/* 4. Schools & Amenities Section */}
        {hasAmenitiesOrSchools && (
          <section
            id="amenities"
            ref={(el) => {
              sectionRefs.current.amenities = el;
            }}
            className="scroll-mt-[150px] mt-12 lg:mt-16"
          >
            <SchoolsAmenitiesSection
              schoolDistrict={community.schoolDistrict}
              elementarySchool={community.elementarySchool}
              middleSchool={community.middleSchool}
              highSchool={community.highSchool}
              amenities={community.amenities || []}
            />
          </section>
        )}

      </div>

      {/* Area Map Section - Full Width */}
      {hasAreaMap && (
        <section
          id="area"
          ref={(el) => {
            sectionRefs.current.area = el;
          }}
          className="scroll-mt-[150px] mt-12 lg:mt-16"
        >
          <AreaMapSection community={community} />
        </section>
      )}

      {/* Video Section - Full Width */}
      {community.videoUrl && (
        <section
          id="video"
          ref={(el) => {
            sectionRefs.current.video = el;
          }}
          className="scroll-mt-[150px] mt-12 lg:mt-16"
        >
          <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
            <VideoSection
              videoUrl={community.videoUrl}
              communityName={community.name}
            />
          </div>
        </section>
      )}

      {/* Contact Section - Full Width */}
      <section
        id="contact"
        ref={(el) => {
          sectionRefs.current.contact = el;
        }}
        className="scroll-mt-20 mt-12 lg:mt-16"
      >
        <ContactSection
          community={community}
          salesTeams={community.salesTeams}
          backgroundImage={community.gallery?.[0]}
        />
      </section>

      {/* Gallery Lightbox */}
      <Lightbox
        images={community.gallery || []}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={`${community.name} Gallery`}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <ContactForm
          community={community}
          isModal={true}
          type={contactModalType}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Schedule Tour Modal for Homes/Floorplans */}
      {scheduleModal.open && (
        <ReusableContactForm
          type="tour"
          communityId={community.id}
          homeId={scheduleModal.homeId}
          floorplanId={scheduleModal.floorplanId}
          entityName={scheduleModal.entityName}
          isModal={true}
          onClose={closeScheduleModal}
        />
      )}
    </main>
  );
}
