"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNav from "../header/mobile";
import MainLogo from "../main-logo";
import DesktopNav from "../header/desktop";
import { UserMenu } from "../auth/user-menu";
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
        isScrolled
          ? "bg-main-primary shadow-lg py-2 lg:mt-0"
          : "bg-main-primary backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-20" : "h-20"
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "transition-all duration-300",
              isScrolled ? "w-36 lg:w-60" : "w-44 lg:w-56 xl:w-64"
            )}
          >
            <MainLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <DesktopNav />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <UserMenu />
            {/* Have a Question CTA */}
            <Link
              href="/contact"
              className="hidden xl:flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="relative size-10 rounded-full overflow-hidden border-2 border-main-secondary">
                <Image
                  src="/sales-person.png"
                  alt="Sales representative"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-medium text-white">
                Have a Question?
              </span>
            </Link>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
