import { Suspense } from "react";
import { fetchHomes, fetchCommunities } from "@/lib/api";
import HomesPageClient from "./homes-page-client";

export const metadata = {
  title: "Available Homes | Ridgeline Homes",
  description: "Browse available new homes for sale in Maryland. Find move-in ready homes and quick move-in options with Ridgeline Homes.",
};

async function getInitialData() {
  const [homesRes, communitiesRes] = await Promise.all([
    fetchHomes({ status: "AVAILABLE" }).catch(() => ({ data: [] })),
    fetchCommunities({ status: "ACTIVE" }).catch(() => ({ data: [] })),
  ]);

  return {
    homes: Array.isArray(homesRes.data) ? homesRes.data : [],
    communities: Array.isArray(communitiesRes.data) ? communitiesRes.data : [],
  };
}

export default async function HomesPage() {
  const { homes, communities } = await getInitialData();

  return (
    <Suspense fallback={<HomesPageSkeleton />}>
      <HomesPageClient
        initialHomes={homes}
        communities={communities}
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
