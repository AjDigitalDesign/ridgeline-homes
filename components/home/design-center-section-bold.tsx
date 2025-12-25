"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface DesignCenterSectionBoldProps {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  linkTitle?: string | null;
  linkUrl?: string | null;
  image?: string | null;
}

const defaultContent = {
  title: "Find a Design Studio Near You",
  subtitle: "Find Your Design Studio",
  description:
    "Our team of experts is available to design and build your dream home typically within 75 miles of our Design Studios. Find a location near you.",
  linkTitle: "Find Your Design Studio",
  linkUrl: "/design-center",
  image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
};

export function DesignCenterSectionBold({
  title,
  subtitle,
  description,
  linkTitle,
  linkUrl,
  image,
}: DesignCenterSectionBoldProps) {
  const displayTitle = title || defaultContent.title;
  const displaySubtitle = subtitle || defaultContent.subtitle;
  const displayDescription = description || defaultContent.description;
  const displayLinkTitle = linkTitle || defaultContent.linkTitle;
  const displayLinkUrl = linkUrl || defaultContent.linkUrl;
  const displayImage = image || defaultContent.image;

  return (
    <section className="py-16 lg:py-24 xl:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-10 xl:px-16 2xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center">
          {/* Image - Left side */}
          <AnimateOnScroll animation="fade-in-left">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden">
              <Image
                src={displayImage}
                alt={displayTitle}
                fill
                className="object-cover"
              />
            </div>
          </AnimateOnScroll>

          {/* Content - Right side */}
          <div className="lg:pl-4 xl:pl-8">
            <AnimateOnScroll animation="fade-in-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-serif text-main-primary leading-[1.1]">
                {displayTitle}
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <h3 className="mt-8 text-lg lg:text-xl font-semibold text-main-primary">
                {displaySubtitle}
              </h3>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={150}>
              <p className="mt-4 text-gray-600 text-base lg:text-lg leading-relaxed max-w-lg">
                {displayDescription}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={200}>
              <div className="mt-8">
                <Link
                  href={displayLinkUrl}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-main-primary text-main-primary font-medium rounded-full hover:bg-main-primary hover:text-white transition-colors"
                >
                  {displayLinkTitle}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DesignCenterSectionBold;
