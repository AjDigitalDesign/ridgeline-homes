import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBOYLLocation } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import BOYLFloorplanDetailClient from "./boyl-floorplan-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    state: string;
    slug: string;
    floorplanSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, floorplanSlug } = await params;

  try {
    const location = (await fetchBOYLLocation(slug)).data;
    const floorplan = location.floorplans?.find((fp) => fp.slug === floorplanSlug);

    if (!floorplan) {
      return generateSeoMetadata({
        title: "Floor Plan Not Found",
        noIndex: true,
      });
    }

    return generateSeoMetadata({
      title: `${floorplan.name} - ${location.name} | Build on Your Lot`,
      description: floorplan.description || `View the ${floorplan.name} floor plan available for building on your lot in ${location.county}, ${location.state}. ${floorplan.bedrooms} beds, ${floorplan.bathrooms} baths, ${floorplan.sqft?.toLocaleString()} sq ft.`,
      keywords: [
        floorplan.name,
        "floor plan",
        "build on your lot",
        "custom home",
        location.name,
        location.county,
        location.state,
      ],
    });
  } catch {
    return generateSeoMetadata({
      title: "Floor Plan | Build on Your Lot",
      noIndex: true,
    });
  }
}

async function getLocationData(slug: string) {
  try {
    const response = await fetchBOYLLocation(slug);
    return response.data;
  } catch {
    return null;
  }
}

export default async function BOYLFloorplanDetailPage({ params }: PageProps) {
  const { state, slug, floorplanSlug } = await params;
  const location = await getLocationData(slug);

  if (!location) {
    notFound();
  }

  const floorplan = location.floorplans?.find((fp) => fp.slug === floorplanSlug);

  if (!floorplan) {
    notFound();
  }

  return (
    <BOYLFloorplanDetailClient
      floorplan={floorplan}
      location={location}
      state={state}
      locationSlug={slug}
    />
  );
}
