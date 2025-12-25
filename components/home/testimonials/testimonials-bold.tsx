"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  companyName?: string;
  description: string;
}

interface TestimonialsBoldProps {
  title?: string | null;
  testimonials?: Testimonial[];
  image1?: string | null;
  image2?: string | null;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jenny Muna",
    companyName: "CEO of Company",
    description:
      "There are so many wonderful things to say about Quere. Their staff genuinely cares about their clients and is competent and professional. They assisted me in locating the ideal house for my household.",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    companyName: "Business Owner",
    description:
      "The entire home buying process was seamless. From the first consultation to closing, they were there every step of the way. I couldn't be happier with my new home.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    companyName: "First-time Homebuyer",
    description:
      "As a first-time buyer, I was nervous about the process. The team made everything so easy to understand and helped me find the perfect starter home within my budget.",
    rating: 5,
  },
];

// BOLD template testimonials - Card-based with navigation arrows
export function TestimonialsBold({
  title,
  testimonials,
}: TestimonialsBoldProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayTitle = title || "Trusted by Homeowners";
  const displayTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const goToPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? displayTestimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((prev) =>
      prev === displayTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const activeTestimonial = displayTestimonials[activeIndex];

  return (
    <section className="bg-main-primary py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        {/* Header */}
        <AnimateOnScroll animation="fade-in-up" className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-white/10 text-main-secondary font-semibold text-sm uppercase tracking-wide rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            {displayTitle}
          </h2>
        </AnimateOnScroll>

        {/* Testimonial Card */}
        <AnimateOnScroll animation="fade-in-up" delay={200}>
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl p-8 lg:p-12 shadow-2xl">
              {/* Quote Icon */}
              <div className="absolute -top-6 left-8 size-12 bg-main-secondary rounded-full flex items-center justify-center">
                <Quote className="size-6 text-main-primary" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 fill-main-secondary text-main-secondary"
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
                &ldquo;{activeTestimonial.description}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="size-14 rounded-full bg-main-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-main-primary">
                      {activeTestimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-main-primary text-lg">
                      {activeTestimonial.name}
                    </p>
                    {activeTestimonial.companyName && (
                      <p className="text-gray-500">
                        {activeTestimonial.companyName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrev}
                    className="size-12 rounded-full border-2 border-main-primary/20 flex items-center justify-center text-main-primary hover:bg-main-primary hover:text-white transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="size-12 rounded-full border-2 border-main-primary/20 flex items-center justify-center text-main-primary hover:bg-main-primary hover:text-white transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-main-secondary"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
