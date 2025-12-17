import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchFloorplan } from "@/lib/api";
import FloorplanDetailClient from "./floorplan-detail-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const floorplan = (await fetchFloorplan(slug)).data;
    const title = floorplan.name;

    const description = floorplan.marketingHeadline && floorplan.showMarketingHeadline
      ? floorplan.marketingHeadline
      : floorplan.description
        ? floorplan.description.slice(0, 160)
        : `${floorplan.baseBedrooms || ""} bed, ${floorplan.baseBathrooms || ""} bath floor plan${floorplan.baseSquareFeet ? ` with ${floorplan.baseSquareFeet.toLocaleString()} sq ft` : ""}.`;

    return generateSeoMetadata({
      title,
      description,
      image: floorplan.gallery?.[0] || floorplan.elevationGallery?.[0],
    });
  } catch {
    return generateSeoMetadata({
      title: "Floor Plan Not Found",
      noIndex: true,
    });
  }
}

async function getFloorplanData(slug: string) {
  try {
    const floorplanRes = await fetchFloorplan(slug);
    return { floorplan: floorplanRes.data };
  } catch {
    return null;
  }
}

export default async function FloorplanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getFloorplanData(slug);

  if (!data || !data.floorplan) {
    notFound();
  }

  return (
    <Suspense fallback={<FloorplanDetailSkeleton />}>
      <FloorplanDetailClient floorplan={data.floorplan} />
    </Suspense>
  );
}

function FloorplanDetailSkeleton() {
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
