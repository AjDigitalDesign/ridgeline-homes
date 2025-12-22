import { Metadata } from "next";
import { fetchBOYLLocation, fetchBOYLLocationsServer } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
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
  const { slug } = await params;
  const [location, allLocations] = await Promise.all([
    getLocationData(slug),
    getAllLocations(),
  ]);

  if (!location) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-main-primary mb-4">
              Location Not Found
            </h2>
            <p className="text-gray-600">
              Unable to load location information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <WhereWeBuildSection location={location} allLocations={allLocations} />;
}
