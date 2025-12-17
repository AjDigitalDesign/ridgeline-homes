import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchHomes, fetchCommunities, fetchListingSettings } from "@/lib/api";
import HomesPageClient from "./homes-page-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: listingSettings } = await fetchListingSettings("homes");
    const seo = listingSettings?.seo;

    if (seo) {
      return generateSeoMetadata({
        title: seo.title || "Available Homes",
        description: seo.description || "Browse available new homes for sale in Maryland.",
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
    title: "Available Homes",
    description:
      "Browse available new homes for sale in Maryland. Find move-in ready homes and quick move-in options with Ridgeline Homes.",
    keywords: ["homes for sale", "quick move-in homes", "Maryland homes", "new construction"],
  });
}

async function getInitialData() {
  const [homesRes, communitiesRes, listingSettingsRes] = await Promise.all([
    fetchHomes().catch(() => ({ data: [] })),
    fetchCommunities({ status: "ACTIVE" }).catch(() => ({ data: [] })),
    fetchListingSettings("homes").catch(() => ({ data: null })),
  ]);

  return {
    homes: Array.isArray(homesRes.data) ? homesRes.data : [],
    communities: Array.isArray(communitiesRes.data) ? communitiesRes.data : [],
    listingSettings: listingSettingsRes.data || null,
  };
}

export default async function HomesPage() {
  const { homes, communities, listingSettings } = await getInitialData();

  return (
    <Suspense fallback={<HomesPageSkeleton />}>
      <HomesPageClient
        initialHomes={homes}
        communities={communities}
        listingSettings={listingSettings}
      />
    </Suspense>
  );
}

function HomesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="h-[300px] lg:h-[400px] bg-gray-200 animate-pulse" />
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
