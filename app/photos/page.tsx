import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchGalleryPage, fetchGalleryImages } from "@/lib/api";
import GalleryPageClient from "./gallery-page-client";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: pages } = await fetchGalleryPage();
    const galleryPage = pages?.[0];
    const seo = galleryPage?.seo;

    if (seo) {
      return generateSeoMetadata({
        title: seo.title || "Photo Gallery",
        description: seo.description || "Browse our photo gallery of beautiful homes and communities.",
        keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : [],
        openGraph: {
          title: seo.ogTitle || seo.title || undefined,
          description: seo.ogDescription || seo.description || undefined,
          image: seo.ogImage || undefined,
        },
      });
    }
  } catch {
    // Fall back to default metadata
  }

  return generateSeoMetadata({
    title: "Photo Gallery",
    description: "Browse our photo gallery of beautiful homes, communities, and floor plans.",
    keywords: ["home gallery", "home photos", "community photos", "Maryland homes"],
  });
}

async function getInitialData() {
  const [galleryPageRes, galleryImagesRes] = await Promise.all([
    fetchGalleryPage().catch(() => ({ data: [] })),
    fetchGalleryImages().catch(() => ({ data: { images: [], tags: [] } })),
  ]);

  return {
    galleryPage: Array.isArray(galleryPageRes.data) ? galleryPageRes.data[0] || null : null,
    images: galleryImagesRes.data?.images || [],
    tags: galleryImagesRes.data?.tags || [],
  };
}

export default async function GalleryPage() {
  const { galleryPage, images, tags } = await getInitialData();

  return (
    <Suspense fallback={<GalleryPageSkeleton />}>
      <GalleryPageClient
        galleryPage={galleryPage}
        initialImages={images}
        tags={tags}
      />
    </Suspense>
  );
}

function GalleryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="h-[300px] lg:h-[400px] bg-gray-200 animate-pulse" />
      {/* Sub-nav Skeleton */}
      <div className="h-16 bg-white border-b animate-pulse" />
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-gray-200 rounded animate-pulse mb-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
