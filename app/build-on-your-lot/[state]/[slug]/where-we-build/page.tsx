import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBOYLLocation, fetchBOYLLocationsServer } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import BOYLHero from "../components/boyl-hero";
import BOYLDetailNavigation from "../components/boyl-detail-navigation";
import WhereWeBuildSection from "../components/where-we-build-section";

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
      title: `Where We Build - ${location.name} | Build on Your Lot`,
      description: `See our service area for building on your lot in ${location.county}, ${location.state}. We build within ${location.radiusMiles} miles of ${location.city}.`,
      keywords: [
        "where we build",
        "build on your lot",
        "service area",
        location.name,
        location.county,
        location.state,
        location.city,
      ],
    });
  } catch {
    return generateSeoMetadata({
      title: "Where We Build | Build on Your Lot",
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

async function getAllLocations() {
  try {
    const response = await fetchBOYLLocationsServer();
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

export default async function WhereWeBuildPage({ params }: PageProps) {
  const { state, slug } = await params;
  const [location, allLocations] = await Promise.all([
    getLocationData(slug),
    getAllLocations(),
  ]);

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
      <WhereWeBuildSection location={location} allLocations={allLocations} />
    </main>
  );
}
