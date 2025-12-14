import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogPost, fetchBlogPosts, fetchBlogCategories } from "@/lib/api";
import BlogPostPageClient from "./blog-post-page-client";
import { generateBlogPostMetadata, generateBlogPostJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: post } = await fetchBlogPost(slug);

    if (!post) {
      return generateBlogPostMetadata({ title: "Blog Post" });
    }

    return generateBlogPostMetadata({
      title: post.title,
      excerpt: post.excerpt,
      featureImage: post.featureImage,
      categories: post.categories,
      seo: post.seo,
    });
  } catch {
    return generateBlogPostMetadata({ title: "Blog Post" });
  }
}

async function getInitialData(slug: string) {
  const [postRes, postsRes, categoriesRes] = await Promise.all([
    fetchBlogPost(slug).catch(() => ({ data: null })),
    fetchBlogPosts({ limit: 5 }).catch(() => ({ data: { posts: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } } })),
    fetchBlogCategories().catch(() => ({ data: [] })),
  ]);

  return {
    post: postRes.data || null,
    recentPosts: postsRes.data?.posts || [],
    categories: categoriesRes.data || [],
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { post, recentPosts, categories } = await getInitialData(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateBlogPostJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    featureImage: post.featureImage,
    publishDate: post.publishDate,
    createdAt: post.createdAt,
    slug: post.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<BlogPostPageSkeleton />}>
        <BlogPostPageClient
          post={post}
          recentPosts={recentPosts}
          categories={categories}
        />
      </Suspense>
    </>
  );
}

function BlogPostPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-[300px] lg:h-[400px] bg-gray-200 animate-pulse" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Post Content Skeleton */}
          <div className="lg:flex-[2]">
            <div className="bg-white rounded-lg p-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-8" />
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          {/* Sidebar Skeleton */}
          <div className="lg:flex-1 space-y-6">
            <div className="bg-gray-200 rounded-lg h-48 animate-pulse" />
            <div className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
