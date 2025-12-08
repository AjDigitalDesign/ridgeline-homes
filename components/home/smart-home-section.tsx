"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export default function SmartHomeSection() {
  return (
    <section className="relative bg-main-primary overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[6rem] lg:text-[10rem] xl:text-[14rem] font-bold text-white/5 select-none uppercase tracking-wider">
          PROOF
        </span>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Image */}
          <AnimateOnScroll animation="fade-in-left" className="w-full lg:w-1/2">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Couple reviewing home plans"
                fill
                className="object-cover"
              />
            </div>
          </AnimateOnScroll>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl leading-7 font-outfit font-bold text-white">
                FUTURE PROOF
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={200}>
              <p className="mt-6 text-white/70 text-base lg:text-lg max-w-lg">
                At Ridgeline Homes, every home is designed around the way people
                live today—not the outdated floorplans of the past. We believe
                you shouldn&apos;t have to settle for spaces you&apos;ll never
                use or layouts that no longer fit modern life. Our smart,
                healthy, and thoughtfully crafted homes are built to support
                your real lifestyle. As the world has changed, so has the way we
                live, work, and gather at home. That&apos;s why we&apos;ve
                reimagined traditional layouts to include flexible spaces like
                dedicated home offices, pocket workstations, study nooks for
                kids, and even personalized areas for pets. Ridgeline Homes
                gives you a home that adapts to you—today, tomorrow, and every
                day after.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-up" delay={300}>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Button
                  asChild
                  className="group h-auto rounded-md bg-main-secondary px-6 py-3 text-base font-medium text-main-primary hover:bg-main-secondary/90"
                >
                  <Link href="/smart-home">
                    Get Started
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
