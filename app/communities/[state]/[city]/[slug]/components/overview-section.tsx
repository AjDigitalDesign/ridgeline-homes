"use client";

import type { Community } from "@/lib/api";

interface OverviewSectionProps {
  community: Community;
  homesCount: number;
}

export default function OverviewSection({
  community,
}: OverviewSectionProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Section Title */}
      <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-2">
        About {community.name}
      </h2>

      {/* Headline */}
      {community.headline && (
        <p className="text-xl lg:text-2xl text-main-primary/80 font-medium mb-4">
          {community.headline}
        </p>
      )}

      {/* Underline */}
      <div className="w-16 h-1 bg-main-secondary mx-auto mb-8" />

      {/* Description */}
      {community.description ? (
        <div
          className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed mx-auto"
          dangerouslySetInnerHTML={{ __html: community.description }}
        />
      ) : (
        <p className="text-lg text-gray-600">
          Welcome to {community.name}, a beautiful new home community in{" "}
          {community.city}, {community.state}. Contact us to learn more about
          available homes and floor plans.
        </p>
      )}
    </div>
  );
}
