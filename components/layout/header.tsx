"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MobileNav from "../header/mobile";
import MainLogo from "../main-logo";
import { DesktopNavigation } from "../header/desktop";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "shadow-lg" : ""
      )}
    >
      {/* Desktop Layout - Single nav bar */}
      <div className="hidden xl:flex bg-white">
        {/* Left: Logo */}
        <div className="flex items-center pl-4 lg:pl-10 xl:pl-20 2xl:pl-24">
          <Link href="/" className="shrink-0">
            <div
              className={cn(
                "transition-all duration-300",
                isScrolled ? "w-48" : "w-56"
              )}
            >
              <MainLogo variant="dark" />
            </div>
          </Link>
        </div>

        {/* Right: Navigation content + Ask Us */}
        <DesktopNavigation isScrolled={isScrolled} />
      </div>

      {/* Mobile Layout - Single row */}
      <div className="xl:hidden bg-main-primary">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              isScrolled ? "h-16" : "h-20"
            )}
          >
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <div
                className={cn(
                  "transition-all duration-300",
                  isScrolled ? "w-40" : "w-44"
                )}
              >
                <MainLogo />
              </div>
            </Link>

            {/* Mobile Navigation Icons */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
