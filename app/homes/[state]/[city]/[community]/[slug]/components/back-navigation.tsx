"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Home } from "@/lib/api";
import { getStateSlug, getCitySlug } from "@/lib/url";

interface BackNavigationProps {
  home: Home;
}

export default function BackNavigation({ home }: BackNavigationProps) {
  const address = home.address || home.street || home.name;
  const location = [home.city, home.state, home.zipCode].filter(Boolean).join(", ");

  // Build community URL using url utilities
  const communityUrl = home.community
    ? `/communities/${getStateSlug(home.community.state)}/${getCitySlug(home.community.city)}/${home.community.slug}`
    : null;

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/homes"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back To Homes</span>
          </Link>

          {/* Address breadcrumb on desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <span>Homes</span>
            {home.community && communityUrl && (
              <>
                <span>|</span>
                <Link
                  href={communityUrl}
                  className="hover:text-main-primary transition-colors"
                >
                  {home.community.name}
                </Link>
              </>
            )}
            <span>|</span>
            <span className="text-main-primary font-medium">{address}</span>
          </div>
        </div>

        {/* Mobile address display */}
        <div className="lg:hidden mt-2">
          <p className="text-main-primary font-semibold">{address}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
        </div>
      </div>
    </div>
  );
}
