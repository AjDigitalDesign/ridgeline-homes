"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Folder, Tag, ArrowLeft, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BlogPost, BlogCategory } from "@/lib/api";

interface BlogPostPageClientProps {
  post: BlogPost;
  recentPosts: BlogPost[];
  categories: BlogCategory[];
}

// Format date helper
function formatDate(dateString: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Sidebar Search Component
function SidebarSearch({ isAnimated }: { isAnimated: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div
      className={`bg-main-primary rounded-lg p-6 transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: "400ms" }}
    >
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white pr-12 rounded-md border-0"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-main-primary transition-colors"
        >
          <Search className="size-5" />
        </button>
      </form>
    </div>
  );
}

// Sidebar Categories Component
function SidebarCategories({
  categories,
  isAnimated,
}: {
  categories: BlogCategory[];
  isAnimated: boolean;
}) {
  return (
    <div
      className={`bg-main-primary rounded-lg p-6 transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: "500ms" }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
      <div className="h-px bg-white/20 mb-4" />
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blog?category=${category.slug}`}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Folder className="size-4" />
                {category.name}
              </span>
              <span className="text-sm text-white/60">({category.postCount})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Sidebar Recent Posts Component
function SidebarRecentPosts({
  posts,
  currentPostId,
  isAnimated,
}: {
  posts: BlogPost[];
  currentPostId: string;
  isAnimated: boolean;
}) {
  // Filter out current post
  const recentPosts = posts.filter((p) => p.id !== currentPostId).slice(0, 3);

  if (recentPosts.length === 0) return null;

  return (
    <div
      className={`bg-main-primary rounded-lg p-6 transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: "600ms" }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Recent Posts</h3>
      <div className="h-px bg-white/20 mb-4" />
      <div className="space-y-4">
        {recentPosts.map((post) => {
          const displayDate = post.publishDate || post.createdAt;
          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden bg-white/10">
                {post.featureImage ? (
                  <Image
                    src={post.featureImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="size-6 text-white/40" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-main-secondary transition-colors">
                  {post.title}
                </h4>
                {displayDate && (
                  <span className="text-xs text-white/60 flex items-center gap-1 mt-1">
                    <Calendar className="size-3" />
                    {formatDate(displayDate)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function BlogPostPageClient({
  post,
  recentPosts,
  categories,
}: BlogPostPageClientProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const heroImage = post.featureImage || "";
  const heroTitle = post.title;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[400px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            className={`object-cover transition-transform duration-1000 ${
              isAnimated ? "scale-100" : "scale-110"
            }`}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-main-primary to-main-primary/80" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div
            className={`transition-all duration-700 max-w-4xl px-4 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-3xl lg:text-5xl font-bold text-white line-clamp-3">
              {heroTitle}
            </h1>
            <div
              className={`w-24 h-1 bg-main-secondary mx-auto mt-4 transition-all duration-500 delay-200 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Post Content - Left Side */}
          <div className="lg:flex-[2]">
            <article
              className={`bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-500 ${
                isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="p-6 lg:p-8">
                {/* Back Link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-main-primary hover:text-main-secondary transition-colors mb-6"
                >
                  <ArrowLeft className="size-4" />
                  Back to Blog
                </Link>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                  {(post.publishDate || post.createdAt) && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      {formatDate(post.publishDate || post.createdAt)}
                    </span>
                  )}
                  {post.categories?.[0] && (
                    <Link
                      href={`/blog?category=${post.categories[0].slug}`}
                      className="flex items-center gap-1.5 text-main-primary hover:text-main-secondary transition-colors"
                    >
                      <Folder className="size-4" />
                      {post.categories[0].name}
                    </Link>
                  )}
                </div>

                {/* Content */}
                {post.content ? (
                  <div
                    className="prose prose-lg prose-gray max-w-none
                      prose-headings:text-main-primary prose-headings:font-bold
                      prose-p:text-gray-600 prose-p:leading-relaxed
                      prose-a:text-main-primary prose-a:no-underline hover:prose-a:text-main-secondary
                      prose-strong:text-main-primary
                      prose-ul:text-gray-600 prose-ol:text-gray-600
                      prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : post.excerpt ? (
                  <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                ) : (
                  <p className="text-gray-500 italic">No content available.</p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="size-4 text-gray-400" />
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog?tag=${tag.slug}`}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-main-primary hover:text-white transition-colors"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:flex-1 space-y-6">
            {/* Search */}
            <SidebarSearch isAnimated={isAnimated} />

            {/* Categories */}
            {categories.length > 0 && (
              <SidebarCategories categories={categories} isAnimated={isAnimated} />
            )}

            {/* Recent Posts */}
            <SidebarRecentPosts
              posts={recentPosts}
              currentPostId={post.id}
              isAnimated={isAnimated}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
