import { Metadata } from "next";
import { fetchAboutPage, fetchTenant } from "@/lib/api";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import AboutPageClient from "./about-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetchAboutPage();
    const pageData = response.data;

    return generateSeoMetadata({
      title: pageData.seo?.title || "About Us | Ridgeline Homes",
      description:
        pageData.seo?.description ||
        "Learn about Ridgeline Homes and our commitment to building quality homes.",
      keywords: pageData.seo?.keywords
        ? pageData.seo.keywords.split(",").map((k) => k.trim())
        : ["about us", "home builder", "ridgeline homes"],
      image: pageData.seo?.ogImage || undefined,
      openGraph: {
        title: pageData.seo?.ogTitle || undefined,
        description: pageData.seo?.ogDescription || undefined,
        image: pageData.seo?.ogImage || undefined,
      },
    });
  } catch {
    return generateSeoMetadata({
      title: "About Us | Ridgeline Homes",
      description: "Learn about Ridgeline Homes and our commitment to building quality homes.",
    });
  }
}

async function getAboutPageData() {
  try {
    const response = await fetchAboutPage();
    return response.data;
  } catch {
    return null;
  }
}

async function getTenantData() {
  try {
    const response = await fetchTenant();
    return response.data;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const [pageData, tenant] = await Promise.all([
    getAboutPageData(),
    getTenantData(),
  ]);

  return <AboutPageClient pageData={pageData} tenant={tenant} />;
}
