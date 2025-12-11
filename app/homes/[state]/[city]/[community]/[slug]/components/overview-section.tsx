"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, ExternalLink } from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";
import type { Home as HomeType } from "@/lib/api";

interface OverviewSectionProps {
  home: HomeType;
}

export default function OverviewSection({ home }: OverviewSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const address = home.address || home.street || home.name;
  const homeFloorPlanImages = home.floorPlanGallery || [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
          About This Home
        </h2>

        {/* Marketing Headline */}
        {home.marketingHeadline && home.showMarketingHeadline && (
          <p className="text-xl lg:text-2xl text-main-primary/80 font-medium mb-4">
            {home.marketingHeadline}
          </p>
        )}

        {/* Underline */}
        <div className="w-16 h-1 bg-main-secondary mx-auto" />
      </div>

      {/* Description */}
      <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed text-center mb-10">
        {home.description ? (
          <div dangerouslySetInnerHTML={{ __html: home.description }} />
        ) : (
          <>
            <p>
              Welcome to {address}
              {home.community && ` in ${home.community.name}`}
              {home.city && home.state && `, ${home.city}, ${home.state}`}.
              {home.floorplan && ` This beautiful ${home.floorplan.name} floor plan`}
              {home.squareFeet && ` features ${home.squareFeet.toLocaleString()} square feet of living space`}
              {home.bedrooms && `, ${home.bedrooms} bedrooms`}
              {home.bathrooms && `, ${home.bathrooms} bathrooms`}
              {home.garages && `, and a ${home.garages}-car garage`}.
              {home.status === "MOVE_IN_READY" && " This home is move-in ready!"}
              {home.status === "UNDER_CONSTRUCTION" && home.estimatedCompletion && ` Estimated completion: ${new Date(home.estimatedCompletion).toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`}
            </p>
            <p className="mt-4">
              Contact us today to schedule a showing and discover everything this home has to offer.
            </p>
          </>
        )}
      </div>

      {/* Home Floor Plan Gallery */}
      {homeFloorPlanImages.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
              Floor Plan
            </h3>
            <div className="w-16 h-1 bg-main-secondary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeFloorPlanImages.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <Image
                  src={image}
                  alt={`${home.floorplan?.name || "Floor"} Plan ${index + 1}`}
                  fill
                  className="object-contain p-4"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg">
                    <ZoomIn className="size-6 text-main-primary" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Floor Plan Link */}
          {home.interactiveFloorPlanUrl && (
            <div className="mt-6 text-center">
              <a
                href={home.interactiveFloorPlanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-main-secondary text-main-primary font-semibold rounded-lg hover:bg-main-secondary/80 transition-colors"
              >
                <ExternalLink className="size-5" />
                View Interactive Floor Plan
              </a>
            </div>
          )}
        </div>
      )}

      {/* Lightbox for Floor Plan Images */}
      <Lightbox
        images={homeFloorPlanImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={`${home.floorplan?.name || "Floor"} Plan`}
      />
    </div>
  );
}
