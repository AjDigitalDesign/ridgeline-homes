import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchCommunities, fetchMarketAreas, fetchListingSettings } from "@/lib/api";
import CommunitiesPageClient from "./communities-page-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: listingSettings } = await fetchListingSettings("communities");
    const seo = listingSettings?.seo;

    if (seo) {
      return generateSeoMetadata({
        title: seo.title || "Communities",
        description: seo.description || "Browse our new home communities in Maryland.",
        keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : [],
        canonical: seo.canonicalUrl || undefined,
        noIndex: !seo.index,
        openGraph: {
          title: seo.ogTitle || seo.title || undefined,
          description: seo.ogDescription || seo.description || undefined,
          image: seo.ogImage || undefined,
        },
        twitter: {
          title: seo.twitterTitle || seo.ogTitle || seo.title || undefined,
          description: seo.twitterDescription || seo.ogDescription || seo.description || undefined,
          image: seo.twitterImage || seo.ogImage || undefined,
        },
      });
    }
  } catch {
    // Fall back to default metadata
  }

  return generateSeoMetadata({
    title: "Communities",
    description:
      "Browse our new home communities in Maryland. Find your perfect neighborhood with Ridgeline Homes.",
    keywords: ["new home communities", "Maryland homes", "home builder", "neighborhoods"],
  });
}

async function getInitialData() {
  const [communitiesRes, marketAreasRes, listingSettingsRes] = await Promise.all([
    fetchCommunities({ status: "ACTIVE" }).catch(() => ({ data: [] })),
    fetchMarketAreas().catch(() => ({ data: [] })),
    fetchListingSettings("communities").catch(() => ({ data: null })),
  ]);

  return {
    communities: Array.isArray(communitiesRes.data) ? communitiesRes.data : [],
    marketAreas: Array.isArray(marketAreasRes.data) ? marketAreasRes.data : [],
    listingSettings: listingSettingsRes.data || null,
  };
}

export default async function CommunitiesPage() {
  const { communities, marketAreas, listingSettings } = await getInitialData();

  return (
    <Suspense fallback={<CommunitiesPageSkeleton />}>
      <CommunitiesPageClient
        initialCommunities={communities}
        marketAreas={marketAreas}
        listingSettings={listingSettings}
      />
    </Suspense>
  );
}

function CommunitiesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="h-[400px] lg:h-[500px] bg-gray-200 animate-pulse" />
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
