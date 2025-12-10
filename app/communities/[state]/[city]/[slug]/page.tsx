import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchCommunity, fetchHomes, fetchFloorplans } from "@/lib/api";
import CommunityDetailClient from "./community-detail-client";
import {
  generateCommunityMetadata,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo";

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
    const [communityRes, homesRes, floorplansRes] = await Promise.all([
      fetchCommunity(slug),
      fetchHomes({ communitySlug: slug, limit: 12 }).catch(() => ({ data: [] })),
      fetchFloorplans({ communitySlug: slug, limit: 20 }).catch(() => ({ data: [] })),
    ]);

    return {
      community: communityRes.data,
      homes: Array.isArray(homesRes.data) ? homesRes.data : [],
      floorplans: Array.isArray(floorplansRes.data) ? floorplansRes.data : [],
    };
  } catch {
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
