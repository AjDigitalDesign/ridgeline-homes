import { fetchOurProcessPage } from "@/lib/api";
import OurProcessPageClient from "./our-process-client";

export const dynamic = "force-dynamic";

export default async function OurProcessPage() {
  let pageData = null;

  try {
    const response = await fetchOurProcessPage();
    pageData = response.data;
  } catch (error) {
    console.error("Error fetching our process page:", error);
  }

  return <OurProcessPageClient pageData={pageData} />;
}
