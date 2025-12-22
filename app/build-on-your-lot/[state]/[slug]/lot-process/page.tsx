import { Metadata } from "next";
import { fetchLotProcessPage, fetchBOYLLocation } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import ProcessSection from "../components/process-section";

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
  } catch {
    return generateSeoMetadata({
      title: "The Process | Build on Your Lot",
      noIndex: true,
    });
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

export default async function LotProcessPage() {
  const processPage = await getProcessData();

  if (!processPage) {
    return (
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
    );
  }

  return <ProcessSection processPage={processPage} />;
}
