import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchCommunity, fetchFloorplans } from "@/lib/api";
import CommunityDetailClient from "./community-detail-client";
import {
  generateCommunityMetadata,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const community = (await fetchCommunity(slug)).data;
    return generateCommunityMetadata(community);
  } catch {
    return generateSeoMetadata({
      title: "Community Not Found",
      noIndex: true,
    });
  }
}

async function getCommunityData(slug: string) {
  try {
    const [communityRes, floorplansRes] = await Promise.all([
      fetchCommunity(slug),
      fetchFloorplans({ communitySlug: slug, limit: 20 }).catch(() => ({ data: [] })),
    ]);

    const community = communityRes.data;

    // Use homes from community data (already included in API response)
    // Filter to only show AVAILABLE homes
    const allHomes = Array.isArray(community?.homes) ? community.homes : [];
    const homes = allHomes.filter((home: { status: string }) => home.status === "AVAILABLE");

    // Deep clone homes to ensure proper serialization to client
    const serializedHomes = JSON.parse(JSON.stringify(homes));

    return {
      community,
      homes: serializedHomes,
      floorplans: Array.isArray(floorplansRes.data) ? floorplansRes.data : [],
    };
  } catch (err) {
    console.error("[SERVER getCommunityData] Error:", err);
    return null;
  }
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCommunityData(slug);

  if (!data || !data.community) {
    notFound();
  }

  return (
    <Suspense fallback={<CommunityDetailSkeleton />}>
      <CommunityDetailClient
        community={data.community}
        homes={data.homes}
        floorplans={data.floorplans}
      />
    </Suspense>
  );
}

function CommunityDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="h-[400px] lg:h-[500px] bg-gray-200 animate-pulse" />
      {/* Navigation Skeleton */}
      <div className="h-14 bg-white border-b sticky top-0 z-30" />
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
