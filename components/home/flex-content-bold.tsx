"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface FlexContentBoldProps {
  subtitle?: string | null;
  title?: string | null;
  description?: string | null;
  linkTitle?: string | null;
  linkUrl?: string | null;
  image?: string | null;
}

const defaultContent = {
  subtitle: "OUR APPROACH",
  title: "Uniquely Designed for What Matters to You",
  description:
    "We craft custom homes that look and feel like only you could live there. And we do it by working hand-in-hand with you throughout the entire experience.",
  linkTitle: "Discover Our Approach",
  linkUrl: "/our-process",
  image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
};

export function FlexContentBold({
  subtitle,
  title,
  description,
  linkTitle,
  linkUrl,
  image,
}: FlexContentBoldProps) {
  const displaySubtitle = subtitle || defaultContent.subtitle;
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;
  const displayLinkTitle = linkTitle || defaultContent.linkTitle;
  const displayLinkUrl = linkUrl || defaultContent.linkUrl;
  const displayImage = image || defaultContent.image;

  return (
    <section className="relative overflow-hidden">
      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Content with beige background */}
        <div className="relative lg:w-[55%] xl:w-[50%] bg-main-secondary/30 py-16 lg:py-24 xl:py-32">
          {/* Content container with proper padding */}
          <div className="px-4 lg:pl-10 xl:pl-16 2xl:pl-24 lg:pr-16 xl:pr-24 max-w-2xl lg:max-w-none lg:ml-auto">
            <AnimateOnScroll animation="fade-in-up">
              <span className="inline-block text-main-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-6">
                {displaySubtitle}
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-serif text-main-primary leading-[1.1] italic">
                {displayTitle}
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={150}>
              <p className="mt-8 text-gray-600 text-base lg:text-lg leading-relaxed max-w-xl">
                {displayDescription}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={200}>
              <div className="mt-10">
                <Link
                  href={displayLinkUrl}
                  className="inline-flex items-center justify-center px-8 py-4 bg-main-primary text-white font-medium text-sm uppercase tracking-wider rounded-full hover:bg-main-primary/90 transition-colors"
                >
                  {displayLinkTitle}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Right side - Image extending to edge */}
        <div className="relative lg:w-[45%] xl:w-[50%] min-h-[400px] lg:min-h-[500px]">
          <AnimateOnScroll animation="fade-in-right" delay={300} className="h-full">
            <div className="relative h-full w-full">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={displayTitle}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-main-primary/20" />
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

export default FlexContentBold;
