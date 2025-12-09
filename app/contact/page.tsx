import { Metadata } from "next";
import ContactPageClient from "./contact-page-client";
import { fetchTenant } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us | Ridgeline Homes",
  description: "Get in touch with Ridgeline Homes. We're here to help you find your dream home.",
};

export default async function ContactPage() {
  const tenantRes = await fetchTenant().catch(() => ({ data: null }));
  const tenant = tenantRes.data;

  return <ContactPageClient tenant={tenant} />;
}
