"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export default function DesignCenterSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
          alt="Luxury home exterior"
          fill
          className="object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[8rem] lg:text-[12rem] xl:text-[16rem] font-bold text-white/5 select-none uppercase tracking-wider">
          Design
        </span>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-20 lg:py-32">
        <div className="max-w-2xl text-left">
          <AnimateOnScroll animation="fade-in-up">
            <h2 className="text-3xl lg:text-4xl xl:text-4xl traci font-bold text-white leading-7 font-outfit">
              Build Your Dream Home, Your Way
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" delay={150}>
            <p className="mt-6 text-white/80 text-base lg:text-lg max-w-xl">
              Personalize every detail in our state-of-the-art Design Center.
              Choose from premium finishes, fixtures, and features to create a
              home that&apos;s uniquely yours.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" delay={300}>
            <div className="mt-8">
              <Button
                asChild
                className="group h-auto rounded-md bg-main-secondary px-6 py-3 text-base font-medium text-main-primary hover:bg-main-secondary/90"
              >
                <Link href="/design-center">
                  Explore Design Center
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
