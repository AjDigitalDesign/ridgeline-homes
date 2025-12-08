"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare, Mail, Phone } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export default function QuestionsSection() {
  return (
    <section className="bg-white py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Content */}
          <AnimateOnScroll animation="fade-in-left" className="w-full lg:w-1/3">
            <div className="flex items-start gap-6">
              {/* Sales Person Image */}
              <div className="relative size-24 lg:size-32 rounded-full overflow-hidden shrink-0 border-4 border-[#C0CDD1]">
                <Image
                  src="/sales-person.png"
                  alt="Sales representative"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Text */}
              <div>
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-main-primary leading-tight">
                  When You
                  <br />
                  Have
                  <br />
                  Questions
                </h2>
                <p className="text-main-secondary font-medium mt-2">
                  Our Sales Team is here to Help You Through the Homebuying
                  Process
                </p>
                <div className="w-16 h-1 bg-main-primary mt-4" />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right Content - Contact Cards */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {/* Call Now Card */}
              <AnimateOnScroll animation="fade-in-up" delay={0}>
                <Link
                  href="tel:2020231-1234"
                  className="group bg-main-primary rounded-xl p-6 lg:p-8 text-center hover:bg-main-primary/90 transition-colors block"
                >
                  <div className="flex justify-center mb-6">
                    <div className="size-16 lg:size-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                      <Phone className="size-7 lg:size-8 text-main-secondary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Call Now</h3>
                  <p className="text-main-secondary font-medium mt-1">
                    (202) 0231-1234
                  </p>
                  <div className="flex justify-center mt-4">
                    <ArrowRight className="size-5 text-main-secondary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </AnimateOnScroll>

              {/* Let's Talk Card */}
              <AnimateOnScroll animation="fade-in-up" delay={100}>
                <Link
                  href="/contact?chat=true"
                  className="group bg-main-primary rounded-xl p-6 lg:p-8 text-center hover:bg-main-primary/90 transition-colors block"
                >
                  <div className="flex justify-center mb-6">
                    <div className="size-16 lg:size-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                      <MessageSquare className="size-7 lg:size-8 text-main-secondary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Let&apos;s Talk
                  </h3>
                  <p className="text-main-secondary font-medium mt-1 uppercase text-sm tracking-wide">
                    Chat Now
                  </p>
                  <div className="flex justify-center mt-4">
                    <ArrowRight className="size-5 text-main-secondary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </AnimateOnScroll>

              {/* Send Message Card */}
              <AnimateOnScroll animation="fade-in-up" delay={200}>
                <Link
                  href="/contact"
                  className="group bg-main-primary rounded-xl p-6 lg:p-8 text-center hover:bg-main-primary/90 transition-colors block"
                >
                  <div className="flex justify-center mb-6">
                    <div className="size-16 lg:size-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                      <Mail className="size-7 lg:size-8 text-main-secondary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Send</h3>
                  <p className="text-main-secondary font-medium mt-1 uppercase text-sm tracking-wide">
                    A Message
                  </p>
                  <div className="flex justify-center mt-4">
                    <ArrowRight className="size-5 text-main-secondary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
