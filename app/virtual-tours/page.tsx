import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchVirtualToursPage } from "@/lib/api";
import VirtualToursPageClient from "./virtual-tours-page-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: virtualToursPage } = await fetchVirtualToursPage();
    const seo = virtualToursPage?.seo;

    if (seo) {
      return generateSeoMetadata({
        title: seo.title ? `Virtual Tours | ${seo.title}` : "Virtual Tours",
        description: seo.description || "Take virtual tours of our beautiful homes and communities.",
      });
    }
  } catch {
    // Fall back to default metadata
  }

  return generateSeoMetadata({
    title: "Virtual Tours",
    description: "Take interactive virtual tours of our beautiful homes and communities.",
    keywords: ["virtual tours", "3D tours", "home tours", "Maryland homes"],
  });
}

async function getInitialData() {
  const virtualToursPageRes = await fetchVirtualToursPage().catch(() => ({ data: null }));

  return {
    virtualToursPage: virtualToursPageRes.data || null,
  };
}

export default async function VirtualToursPage() {
  const { virtualToursPage } = await getInitialData();

  return (
    <Suspense fallback={<VirtualToursPageSkeleton />}>
      <VirtualToursPageClient virtualToursPage={virtualToursPage} />
    </Suspense>
  );
}

function VirtualToursPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[300px] lg:h-[400px] bg-gray-200 animate-pulse" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Tour Player Skeleton */}
          <div className="lg:flex-2">
            <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
            <div className="mt-4 h-8 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
          {/* Tour List Skeleton */}
          <div className="lg:flex-1 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-40 aspect-video bg-gray-200 rounded animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
