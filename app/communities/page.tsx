import { Suspense } from "react";
import { fetchCommunities, fetchMarketAreas } from "@/lib/api";
import CommunitiesPageClient from "./communities-page-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const metadata = generateSeoMetadata({
  title: "Communities",
  description:
    "Browse our new home communities in Maryland. Find your perfect neighborhood with Ridgeline Homes.",
  keywords: ["new home communities", "Maryland homes", "home builder", "neighborhoods"],
});

async function getInitialData() {
  const [communitiesRes, marketAreasRes] = await Promise.all([
    fetchCommunities({ status: "ACTIVE" }),
    fetchMarketAreas(),
  ]);

  return {
    communities: communitiesRes.data,
    marketAreas: marketAreasRes.data,
  };
}

export default async function CommunitiesPage() {
  const { communities, marketAreas } = await getInitialData();

  return (
    <Suspense fallback={<CommunitiesPageSkeleton />}>
      <CommunitiesPageClient
        initialCommunities={communities}
        marketAreas={marketAreas}
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
