"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Star } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

import "swiper/css";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  content: string;
  image?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jenny Muna",
    title: "CEO of Company",
    content:
      "There are so many wonderful things to say about Quere. Their staff genuinely cares about their clients and is competent and professional. They assisted me in locating the ideal house for my household.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Business Owner",
    content:
      "The entire home buying process was seamless. From the first consultation to closing, they were there every step of the way. I couldn't be happier with my new home.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    title: "First-time Homebuyer",
    content:
      "As a first-time buyer, I was nervous about the process. The team made everything so easy to understand and helped me find the perfect starter home within my budget.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
  },
  {
    id: "4",
    name: "David Williams",
    title: "Real Estate Investor",
    content:
      "I've worked with many builders over the years, but Ridgeline Homes stands out for their attention to detail and customer service. Highly recommend!",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <section className="bg-[#C0CDD1] py-16 lg:py-24 overflow-hidden relative">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[4rem] lg:text-[8rem] xl:text-[10rem] font-bold text-main-primary/5 select-none uppercase tracking-wider whitespace-nowrap">
          Testimonials
        </span>
      </div>

      <div className="relative container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <AnimateOnScroll animation="fade-in-up">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-main-primary">
                What Our Clients Say
              </h2>
            </AnimateOnScroll>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              className="mt-8"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-5 fill-main-secondary text-main-secondary"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-main-primary/80 text-base lg:text-lg leading-relaxed">
                    {testimonial.content}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mt-6">
                    {testimonial.image && (
                      <div className="relative size-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-main-primary">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-main-primary/60">
                          {testimonial.title}
                        </p>
                      </div>
                      {/* Quote Mark */}
                      <span className="text-6xl font-serif text-main-primary/20 leading-none">
                        &rdquo;&rdquo;
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-main-primary"
                      : "w-6 bg-main-primary/30 hover:bg-main-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Stacked Images */}
          <AnimateOnScroll
            animation="fade-in-right"
            delay={200}
            className="w-full lg:w-1/2 relative hidden lg:block"
          >
            <div className="relative h-[400px] lg:h-[450px]">
              {/* Back Image (larger, with angled corner) */}
              <div
                className="absolute top-0 left-0 w-[75%] h-[85%] overflow-hidden shadow-lg border-4 border-white "
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 50px) 0, 100% 50px, 100% 100%, 0 100%)",
                }}
              >
                <Image
                  src={galleryImages[0]}
                  alt="Modern home exterior"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Front Image */}
              <div className="absolute bottom-0 right-0 w-[65%] h-[55%] rounded-xl overflow-hidden shadow-lg border-4 border-white z-10">
                <Image
                  src={galleryImages[1]}
                  alt="Luxury home interior"
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
