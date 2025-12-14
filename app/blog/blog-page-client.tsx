"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Folder, ArrowRight, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BlogPage, BlogPost, BlogCategory } from "@/lib/api";

interface BlogPageClientProps {
  blogPage: BlogPage | null;
  initialPosts: BlogPost[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: BlogCategory[];
}

// Format date helper
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Blog Post Card Component
function BlogPostCard({
  post,
  index,
  isAnimated,
}: {
  post: BlogPost;
  index: number;
  isAnimated: boolean;
}) {
  const displayDate = post.publishDate || post.createdAt;
  const primaryCategory = post.categories?.[0];

  return (
    <article
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100 + 300}ms` }}
    >
      {/* Featured Image */}
      {post.featureImage && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-[2/1] overflow-hidden bg-gray-100">
          <Image
            src={post.featureImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
          {displayDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(displayDate)}
            </span>
          )}
          {primaryCategory && (
            <Link
              href={`/blog?category=${primaryCategory.slug}`}
              className="flex items-center gap-1.5 text-main-primary hover:text-main-secondary transition-colors"
            >
              <Folder className="size-4" />
              {primaryCategory.name}
            </Link>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl lg:text-2xl font-bold text-main-primary mb-3 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-main-secondary transition-colors">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {/* Read More Button */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-main-primary text-white rounded-full text-sm font-medium hover:bg-main-primary/90 transition-colors group"
        >
          Read More
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}

// Sidebar Search Component
function SidebarSearch({
  searchQuery,
  onSearchChange,
  isAnimated,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAnimated: boolean;
}) {
  return (
    <div
      className={`bg-main-primary rounded-lg p-6 transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: "400ms" }}
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white pr-12 rounded-md border-0"
        />
        <button className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-main-primary transition-colors">
          <Search className="size-5" />
        </button>
      </div>
    </div>
  );
}

// Sidebar Categories Component
function SidebarCategories({
  categories,
  activeCategory,
  onCategoryChange,
  isAnimated,
}: {
  categories: BlogCategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
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
        <li>
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors ${
              activeCategory === ""
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder className="size-4" />
              All Posts
            </span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.slug)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors ${
                activeCategory === category.slug
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="size-4" />
                {category.name}
              </span>
              <span className="text-sm text-white/60">({category.postCount})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Sidebar Recent Posts Component
function SidebarRecentPosts({
  posts,
  isAnimated,
}: {
  posts: BlogPost[];
  isAnimated: boolean;
}) {
  const recentPosts = posts.slice(0, 3);

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

export default function BlogPageClient({
  blogPage,
  initialPosts,
  initialPagination,
  categories,
}: BlogPageClientProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [posts] = useState(initialPosts);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle search with animation
  const handleSearchChange = (query: string) => {
    setIsFiltering(true);
    setSearchQuery(query);
    setTimeout(() => setIsFiltering(false), 50);
  };

  // Handle category change with animation
  const handleCategoryChange = (slug: string) => {
    setIsFiltering(true);
    setActiveCategory(slug);
    setTimeout(() => setIsFiltering(false), 50);
  };

  // Filter posts by search query and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "" ||
      post.categories?.some((cat) => cat.slug === activeCategory);

    return matchesSearch && matchesCategory;
  });

  const heroImage = blogPage?.blogBannerImage || "";
  const heroTitle = blogPage?.blogBannerTitle || "Blog";
  const hasPosts = filteredPosts.length > 0;

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
            className={`transition-all duration-700 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              {heroTitle}
            </h1>
            <p
              className={`text-lg lg:text-xl text-white/90 mt-2 transition-all duration-700 delay-100 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              News, tips, and insights about home building
            </p>
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
          {/* Posts List - Left Side */}
          <div className="lg:flex-[2]">
            {hasPosts ? (
              <div className="space-y-8">
                {filteredPosts.map((post, index) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    isAnimated={isAnimated && !isFiltering}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                className={`text-center py-16 bg-white rounded-lg transition-all duration-500 delay-400 ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <FileText className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">
                  {searchQuery || activeCategory
                    ? "No posts found matching your criteria"
                    : "No blog posts available yet"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery || activeCategory
                    ? "Try adjusting your search or filter"
                    : "Check back later for new content"}
                </p>
                {(searchQuery || activeCategory) && (
                  <button
                    onClick={() => {
                      handleSearchChange("");
                      handleCategoryChange("");
                    }}
                    className="mt-6 px-6 py-3 bg-main-primary text-white rounded-full font-medium hover:bg-main-primary/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination (if needed) */}
            {initialPagination.totalPages > 1 && (
              <div
                className={`flex justify-center mt-8 transition-all duration-500 ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "700ms" }}
              >
                <div className="flex gap-2">
                  {Array.from({ length: initialPagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`w-10 h-10 rounded-full font-medium transition-colors ${
                          page === initialPagination.page
                            ? "bg-main-primary text-white"
                            : "bg-white text-main-primary hover:bg-main-primary/10"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:flex-1 space-y-6">
            {/* Search */}
            <SidebarSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              isAnimated={isAnimated}
            />

            {/* Categories */}
            {categories.length > 0 && (
              <SidebarCategories
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                isAnimated={isAnimated}
              />
            )}

            {/* Recent Posts */}
            <SidebarRecentPosts posts={initialPosts} isAnimated={isAnimated} />
          </div>
        </div>
      </div>
    </main>
  );
}
