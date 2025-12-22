"use client";

import Image from "next/image";
import type { BOYLLocation } from "@/lib/api";

interface BOYLHeroProps {
  location: BOYLLocation;
}

export default function BOYLHero({ location }: BOYLHeroProps) {
  return (
    <section className="relative h-[300px] lg:h-[450px] overflow-hidden bg-main-primary">
      {/* Background Image */}
      {location.featuredImage && (
        <Image
          src={location.featuredImage}
          alt={location.name}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white uppercase tracking-wide">
            {location.state}
          </h1>
          <p className="text-lg lg:text-xl text-white/90 mt-2 uppercase tracking-widest">
            Communities
          </p>
          <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
        </div>
      </div>
    </section>
  );
}
