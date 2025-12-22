import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBOYLLocation } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import BOYLHero from "../components/boyl-hero";
import BOYLDetailNavigation from "../components/boyl-detail-navigation";
import BOYLFloorplansClient from "./boyl-floorplans-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    state: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const location = (await fetchBOYLLocation(slug)).data;
    return generateSeoMetadata({
      title: `Floor Plans - ${location.name} | Build on Your Lot`,
      description: `Browse ${location.floorplanCount || location.floorplans?.length || 0} available floor plans for building on your lot in ${location.county}, ${location.state}.`,
      keywords: [
        "floor plans",
        "build on your lot",
        "custom home",
        location.name,
        location.county,
        location.state,
      ],
    });
  } catch {
    return generateSeoMetadata({
      title: "Floor Plans | Build on Your Lot",
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

export default async function FloorplansPage({ params }: PageProps) {
  const { state, slug } = await params;
  const location = await getLocationData(slug);

  if (!location) {
    notFound();
  }

  const basePath = `/build-on-your-lot/${state}/${slug}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <BOYLHero location={location} />
      <BOYLDetailNavigation
        basePath={basePath}
        floorplansCount={location.floorplanCount || location.floorplans?.length || 0}
      />
      <BOYLFloorplansClient
        location={location}
        floorplans={location.floorplans || []}
      />
    </main>
  );
}
