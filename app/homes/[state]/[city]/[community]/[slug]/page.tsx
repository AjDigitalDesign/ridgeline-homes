import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchHome } from "@/lib/api";
import HomeDetailClient from "./home-detail-client";
import {
  generateHomeMetadata,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
    community: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const home = (await fetchHome(slug)).data;
    return generateHomeMetadata(home);
  } catch {
    return generateSeoMetadata({
      title: "Home Not Found",
      noIndex: true,
    });
  }
}

async function getHomeData(slug: string) {
  try {
    const homeRes = await fetchHome(slug);
    return { home: homeRes.data };
  } catch {
    return null;
  }
}

export default async function HomeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getHomeData(slug);

  if (!data || !data.home) {
    notFound();
  }

  return (
    <Suspense fallback={<HomeDetailSkeleton />}>
      <HomeDetailClient home={data.home} />
    </Suspense>
  );
}

function HomeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="h-[400px] lg:h-[500px] bg-gray-200 animate-pulse" />
      {/* Header Skeleton */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
      {/* Navigation Skeleton */}
      <div className="h-14 bg-white border-b sticky top-0 z-30" />
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
