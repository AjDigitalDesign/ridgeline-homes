import { notFound } from "next/navigation";
import { fetchBOYLLocation } from "@/lib/api";
import BOYLHero from "./components/boyl-hero";
import BOYLDetailNavigation from "./components/boyl-detail-navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    state: string;
    slug: string;
  }>;
}

async function getBOYLLocation(slug: string) {
  try {
    const response = await fetchBOYLLocation(slug);
    return response.data;
  } catch {
    return null;
  }
}

export default async function BOYLLocationLayout({
  children,
  params,
}: LayoutProps) {
  const { state, slug } = await params;
  const location = await getBOYLLocation(slug);

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
      {children}
    </main>
  );
}
