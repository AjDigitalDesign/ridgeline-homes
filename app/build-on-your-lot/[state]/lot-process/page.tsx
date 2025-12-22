import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBOYLLocationsServer, fetchLotProcessPage } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import BOYLHero from "../[slug]/components/boyl-hero";
import BOYLDetailNavigation from "../[slug]/components/boyl-detail-navigation";
import ProcessSection from "../[slug]/components/process-section";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Map state abbreviations to full names
const STATE_NAMES: Record<string, string> = {
  al: "Alabama",
  ak: "Alaska",
  az: "Arizona",
  ar: "Arkansas",
  ca: "California",
  co: "Colorado",
  ct: "Connecticut",
  de: "Delaware",
  fl: "Florida",
  ga: "Georgia",
  hi: "Hawaii",
  id: "Idaho",
  il: "Illinois",
  in: "Indiana",
  ia: "Iowa",
  ks: "Kansas",
  ky: "Kentucky",
  la: "Louisiana",
  me: "Maine",
  md: "Maryland",
  ma: "Massachusetts",
  mi: "Michigan",
  mn: "Minnesota",
  ms: "Mississippi",
  mo: "Missouri",
  mt: "Montana",
  ne: "Nebraska",
  nv: "Nevada",
  nh: "New Hampshire",
  nj: "New Jersey",
  nm: "New Mexico",
  ny: "New York",
  nc: "North Carolina",
  nd: "North Dakota",
  oh: "Ohio",
  ok: "Oklahoma",
  or: "Oregon",
  pa: "Pennsylvania",
  ri: "Rhode Island",
  sc: "South Carolina",
  sd: "South Dakota",
  tn: "Tennessee",
  tx: "Texas",
  ut: "Utah",
  vt: "Vermont",
  va: "Virginia",
  wa: "Washington",
  wv: "West Virginia",
  wi: "Wisconsin",
  wy: "Wyoming",
  dc: "District of Columbia",
};

const getStateName = (abbr: string) => STATE_NAMES[abbr.toLowerCase()] || abbr.toUpperCase();

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

async function getFirstLocationForState(stateAbbr: string) {
  try {
    const response = await fetchBOYLLocationsServer();
    const allLocations = Array.isArray(response.data) ? response.data : [];
    return allLocations.find(
      (loc) => loc.state.toLowerCase() === stateAbbr.toLowerCase()
    );
  } catch {
    return null;
  }
}

async function getProcessData() {
  try {
    const response = await fetchLotProcessPage();
    return response.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const stateName = getStateName(state);
  const location = await getFirstLocationForState(state);

  if (location) {
    return generateSeoMetadata({
      title: `The Process - ${location.name} | Build on Your Lot`,
      description: `Learn about our build-on-your-lot process in ${location.county}, ${location.state}. See how we help you build your dream home on your land.`,
      keywords: [
        "build on your lot",
        "custom home building",
        location.name,
        location.county,
        location.state,
        "lot process",
      ],
    });
  }

  return generateSeoMetadata({
    title: `The Process - ${stateName} | Build on Your Lot`,
    description: `Learn about our build-on-your-lot process in ${stateName}. See how we help you build your dream home on your land.`,
    keywords: [
      "build on your lot",
      "custom home building",
      stateName,
      "lot process",
    ],
  });
}

export default async function StateLotProcessPage({ params }: PageProps) {
  const { state } = await params;
  const location = await getFirstLocationForState(state);

  if (!location) {
    notFound();
  }

  const processPage = await getProcessData();
  const basePath = `/build-on-your-lot/${state.toLowerCase()}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <BOYLHero location={location} />
      <BOYLDetailNavigation
        basePath={basePath}
        floorplansCount={location.floorplanCount || location.floorplans?.length || 0}
        isStateLevelPage={true}
        locationSlug={location.slug}
      />
      {processPage ? (
        <ProcessSection processPage={processPage} />
      ) : (
        <div className="py-12">
          <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-main-primary mb-4">
                Process Information Coming Soon
              </h2>
              <p className="text-gray-600">
                We&apos;re preparing detailed information about our build-on-your-lot process.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
