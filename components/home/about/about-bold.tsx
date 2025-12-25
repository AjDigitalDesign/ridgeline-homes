"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface AboutBoldProps {
  title?: string | null;
  content?: string | null;
  linkTitle?: string | null;
  linkUrl?: string | null;
  image?: string | null;
  // Additional props for second image
  image2?: string | null;
  subheading?: string | null;
}

const defaultContent = {
  subheading: "Quality Home Builder",
  title: "Built with Quality",
  content:
    "Our commitment to you is that every aspect of the home you purchase has been thoroughly researched, thoughtfully designed, planned and built with excellence in mind by a family-owned builder with over a century of experience.",
  linkTitle: "Explore Our Homes",
  linkUrl: "/about-us",
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  image2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
};

// BOLD template about section - Full-bleed images with centered content
export function AboutBold({
  title,
  content,
  linkTitle,
  linkUrl,
  image,
  image2,
  subheading,
}: AboutBoldProps) {
  const displaySubheading = subheading || defaultContent.subheading;
  const displayTitle = title || defaultContent.title;
  const displayContent = content || defaultContent.content;
  const displayLinkTitle = linkTitle || defaultContent.linkTitle;
  const displayLinkUrl = linkUrl || defaultContent.linkUrl;
  const displayImage = image || defaultContent.image;
  const displayImage2 = image2 || defaultContent.image2;

  return (
    <section className="py-16 lg:py-24 xl:py-32 overflow-hidden bg-white">
      {/* Three Column Layout - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[500px] lg:min-h-[600px]">
        {/* Left Image - Full Bleed */}
        <AnimateOnScroll animation="fade-in-left" className="hidden lg:block lg:col-span-3 h-full">
          <div className="relative h-full min-h-[500px]">
            {/* Gold frame - offset inward */}
            <div className="absolute top-8 left-8 right-0 bottom-8 border-2 border-main-secondary pointer-events-none z-10" />
            {/* Image - extends to edge */}
            <div className="absolute inset-0">
              <Image
                src={displayImage}
                alt="About our homes"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </AnimateOnScroll>

        {/* Center Content */}
        <div className="lg:col-span-6 text-center px-6 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-0">
          <AnimateOnScroll animation="fade-in-up">
            <span className="inline-block text-main-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-4 lg:mb-6">
              {displaySubheading}
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" delay={100}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-main-primary leading-tight mb-6 lg:mb-8">
              {displayTitle}
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" delay={200}>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 max-w-xl mx-auto">
              {displayContent}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" delay={300}>
            <Link
              href={displayLinkUrl}
              className="inline-flex items-center gap-2 bg-main-primary text-white px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-main-primary/90 transition-colors group"
            >
              {displayLinkTitle}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimateOnScroll>
        </div>

        {/* Right Image - Full Bleed */}
        <AnimateOnScroll animation="fade-in-right" className="hidden lg:block lg:col-span-3 h-full">
          <div className="relative h-full min-h-[500px]">
            {/* Gold frame - offset inward */}
            <div className="absolute top-8 left-0 right-8 bottom-8 border-2 border-main-secondary pointer-events-none z-10" />
            {/* Image - extends to edge */}
            <div className="absolute inset-0">
              <Image
                src={displayImage2}
                alt="Quality homes"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Mobile: Show images in a row below content */}
      <div className="lg:hidden mt-8 px-4">
        <div className="grid grid-cols-2 gap-4">
          <AnimateOnScroll animation="fade-in-left">
            <div className="relative">
              <div className="absolute top-3 left-3 right-0 bottom-3 border-2 border-main-secondary pointer-events-none z-10" />
              <div className="relative aspect-3/4 overflow-hidden">
                <Image
                  src={displayImage}
                  alt="About our homes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-in-right">
            <div className="relative">
              <div className="absolute top-3 left-0 right-3 bottom-3 border-2 border-main-secondary pointer-events-none z-10" />
              <div className="relative aspect-3/4 overflow-hidden">
                <Image
                  src={displayImage2}
                  alt="Quality homes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
