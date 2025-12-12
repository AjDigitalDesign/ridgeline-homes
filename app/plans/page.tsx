import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchFloorplans, fetchCommunities, fetchListingSettings } from "@/lib/api";
import PlansPageClient from "./plans-page-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: listingSettings } = await fetchListingSettings("floorplans");
    const seo = listingSettings?.seo;

    if (seo) {
      return generateSeoMetadata({
        title: seo.title || "Floor Plans",
        description: seo.description || "Browse our collection of floor plans.",
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
    title: "Floor Plans",
    description:
      "Browse our collection of floor plans. Find the perfect layout for your new home with Ridgeline Homes.",
    keywords: ["floor plans", "home designs", "new home layouts", "home builder"],
  });
}

async function getInitialData() {
  const [floorplansRes, communitiesRes, listingSettingsRes] = await Promise.all([
    fetchFloorplans().catch(() => ({ data: [] })),
    fetchCommunities({ status: "ACTIVE" }).catch(() => ({ data: [] })),
    fetchListingSettings("floorplans").catch(() => ({ data: null })),
  ]);

  return {
    floorplans: Array.isArray(floorplansRes.data) ? floorplansRes.data : [],
    communities: Array.isArray(communitiesRes.data) ? communitiesRes.data : [],
    listingSettings: listingSettingsRes.data || null,
  };
}

export default async function PlansPage() {
  const { floorplans, communities, listingSettings } = await getInitialData();

  return (
    <Suspense fallback={<PlansPageSkeleton />}>
      <PlansPageClient
        initialFloorplans={floorplans}
        communities={communities}
        listingSettings={listingSettings}
      />
    </Suspense>
  );
}

function PlansPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="h-[300px] lg:h-[450px] bg-gray-200 animate-pulse" />
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
