"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface AboutSectionProps {
  title?: string | null;
  content?: string | null;
  linkTitle?: string | null;
  linkUrl?: string | null;
  image?: string | null;
}

const defaultContent = {
  title: "The Future of Homebuilding in Maryland",
  content:
    "A cornerstone is the first stone set—the foundation everything else builds upon. At Cornerstone Communities, we understand that a home is more than walls and windows; it's where your family's story unfolds. That's why we build neighborhoods where connections happen naturally, where morning walks lead to lifelong friendships, and where your home's foundation is matched only by the foundation of community around it.",
  linkTitle: "Start Your Home Search",
  linkUrl: "/homes",
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
};

export function AboutClassic({
  title,
  content,
  linkTitle,
  linkUrl,
  image,
}: AboutSectionProps) {
  const displayTitle = title || defaultContent.title;
  const displayContent = content || defaultContent.content;
  const displayLinkTitle = linkTitle || defaultContent.linkTitle;
  const displayLinkUrl = linkUrl || defaultContent.linkUrl;
  const displayImage = image || defaultContent.image;

  return (
    <section className="bg-main-primary py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            {/* Accent Line */}
            <AnimateOnScroll animation="fade-in-left" duration={500}>
              <div className="w-12 h-1 bg-main-secondary mb-6" />
            </AnimateOnScroll>

            {/* Tagline */}
            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <p className="text-main-secondary font-semibold uppercase tracking-wide text-sm mb-3">
                Breaking New Ground
              </p>
            </AnimateOnScroll>

            {/* Title */}
            <AnimateOnScroll animation="fade-in-up" delay={200}>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                {displayTitle}
              </h2>
            </AnimateOnScroll>

            {/* Description */}
            <AnimateOnScroll animation="fade-in-up" delay={300}>
              <p className="text-neutral-100 text-base lg:text-lg mb-6 max-w-lg">
                {displayContent}
              </p>
            </AnimateOnScroll>

            {/* CTA Button */}
            <AnimateOnScroll animation="fade-in-up" delay={400}>
              <div>
                <Button
                  asChild
                  className="group h-auto rounded-full bg-main-secondary px-8 py-4 text-base font-medium text-main-primary hover:bg-main-secondary/90 uppercase tracking-wide"
                >
                  <Link href={displayLinkUrl}>
                    {displayLinkTitle}
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Content - Image */}
          <AnimateOnScroll
            animation="fade-in-right"
            delay={200}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-4/3 lg:aspect-3/4 xl:aspect-4/3 rounded-xl overflow-hidden">
              <Image
                src={displayImage}
                alt="Modern home exterior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
