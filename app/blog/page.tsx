import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchBlogPosts, fetchBlogCategories, fetchBlogPage } from "@/lib/api";
import BlogPageClient from "./blog-page-client";
import { generateBlogPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: blogPage } = await fetchBlogPage();
    return generateBlogPageMetadata({ seo: blogPage?.seo });
  } catch {
    return generateBlogPageMetadata({});
  }
}

async function getInitialData() {
  const [blogPageRes, postsRes, categoriesRes] = await Promise.all([
    fetchBlogPage().catch(() => ({ data: null })),
    fetchBlogPosts({ limit: 10 }).catch(() => ({ data: { posts: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } } })),
    fetchBlogCategories().catch(() => ({ data: [] })),
  ]);

  return {
    blogPage: blogPageRes.data || null,
    initialPosts: postsRes.data?.posts || [],
    pagination: postsRes.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    categories: categoriesRes.data || [],
  };
}

export default async function BlogPage() {
  const { blogPage, initialPosts, pagination, categories } = await getInitialData();

  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageClient
        blogPage={blogPage}
        initialPosts={initialPosts}
        initialPagination={pagination}
        categories={categories}
      />
    </Suspense>
  );
}

function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[300px] lg:h-[400px] bg-gray-200 animate-pulse" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts List Skeleton */}
          <div className="lg:flex-[2] space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                </div>
              </div>
            ))}
          </div>
          {/* Sidebar Skeleton */}
          <div className="lg:flex-1 space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
