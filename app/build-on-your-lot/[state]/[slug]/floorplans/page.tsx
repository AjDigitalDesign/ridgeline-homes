import { Metadata } from "next";
import { fetchBOYLLocation } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
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
  const { slug } = await params;
  const location = await getLocationData(slug);

  if (!location) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-main-primary mb-4">
              Floor Plans Not Found
            </h2>
            <p className="text-gray-600">
              Unable to load floor plans for this location.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BOYLFloorplansClient
      location={location}
      floorplans={location.floorplans || []}
    />
  );
}
