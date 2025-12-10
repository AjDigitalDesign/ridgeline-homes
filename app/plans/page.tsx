import { Suspense } from "react";
import { fetchFloorplans, fetchCommunities } from "@/lib/api";
import PlansPageClient from "./plans-page-client";

export const metadata = {
  title: "Floor Plans | Ridgeline Homes",
  description: "Browse our collection of floor plans. Find the perfect layout for your new home with Ridgeline Homes.",
};

async function getInitialData() {
  const [floorplansRes, communitiesRes] = await Promise.all([
    fetchFloorplans().catch(() => ({ data: [] })),
    fetchCommunities({ status: "ACTIVE" }).catch(() => ({ data: [] })),
  ]);

  return {
    floorplans: Array.isArray(floorplansRes.data) ? floorplansRes.data : [],
    communities: Array.isArray(communitiesRes.data) ? communitiesRes.data : [],
  };
}

export default async function PlansPage() {
  const { floorplans, communities } = await getInitialData();

  return (
    <Suspense fallback={<PlansPageSkeleton />}>
      <PlansPageClient
        initialFloorplans={floorplans}
        communities={communities}
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
