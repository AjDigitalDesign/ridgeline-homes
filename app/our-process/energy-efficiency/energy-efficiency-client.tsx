"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Compass, Palette, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Process Sub-Navigation
function ProcessSubNav({
  activeTab,
  isAnimated,
}: {
  activeTab: string;
  isAnimated?: boolean;
}) {
  const tabs = [
    { label: "OUR PROCESS", href: "/our-process", value: "our-process", icon: Compass },
    { label: "DESIGN CENTER", href: "/our-process/design-center", value: "design-center", icon: Palette },
    { label: "ENERGY EFFICIENCY", href: "/our-process/energy-efficiency", value: "energy-efficiency", icon: Zap },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center gap-2 bg-white py-4 border-b">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.value
                ? "bg-main-primary text-white"
                : "bg-white text-main-primary border border-gray-200 hover:border-main-primary hover:scale-105"
            } ${
              isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${index * 50 + 300}ms` }}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

// Mobile Process Sub-Navigation
function MobileProcessSubNav() {
  return (
    <div className="lg:hidden bg-white border-b">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-4 text-main-primary font-semibold">
            OUR PROCESS MENU
            <ChevronDown className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Our Process</SheetTitle>
          </SheetHeader>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-2 py-4">
              <Link
                href="/our-process"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
              >
                <Compass className="size-5" />
                Our Process
              </Link>
              <Link
                href="/our-process/design-center"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg font-medium text-main-primary"
              >
                <Palette className="size-5" />
                Design Center
              </Link>
              <Link
                href="/our-process/energy-efficiency"
                className="flex items-center gap-2 px-4 py-3 bg-main-primary text-white rounded-lg font-medium"
              >
                <Zap className="size-5" />
                Energy Efficiency
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function EnergyEfficiencyPageClient() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const heroTitle = "Energy Efficiency";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-main-primary to-main-primary/80" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div
            className={`transition-all duration-700 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              {heroTitle}
            </h1>
            <p
              className={`text-lg lg:text-xl text-white/90 mt-2 transition-all duration-700 delay-100 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Sustainable homes built for the future
            </p>
            <div
              className={`w-24 h-1 bg-main-secondary mx-auto mt-4 transition-all duration-500 delay-200 ${
                isAnimated ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Process Sub-Navigation */}
      <ProcessSubNav activeTab="energy-efficiency" isAnimated={isAnimated} />
      <MobileProcessSubNav />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-8 lg:py-12">
        <div
          className={`transition-all duration-500 delay-300 ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl font-bold text-main-primary mb-2">Energy Efficiency</h2>
          <p className="text-gray-500 text-sm mb-8">
            Learn about our energy-efficient building practices
          </p>
        </div>

        {/* Empty State */}
        <div
          className={`text-center py-16 transition-all duration-500 delay-400 ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Zap className="size-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">Energy Efficiency information coming soon</p>
          <p className="text-sm text-gray-400 mt-1">
            Check back later for details about our sustainable building practices
          </p>
          <Link
            href="/our-process"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-main-primary text-white rounded-full font-medium hover:bg-main-primary/90 transition-colors"
          >
            <Compass className="size-4" />
            View Our Process
          </Link>
        </div>
      </div>
    </main>
  );
}
