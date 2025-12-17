"use client";

import Link from "next/link";
import { Heart, Mail, Home } from "lucide-react";
import { NavSearch } from "./nav-search";
import { AskUsDropdown } from "./ask-us-dropdown";
import { mainNavItems, utilityNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

// Desktop Navigation - Single bar with stacked rows on right + Ask Us full height
export function DesktopNavigation({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="flex-1 flex">
      {/* Middle section: Stacked top bar and nav bar */}
      <div className="flex-1 flex flex-col">
        {/* Top row: Search | Contact | Warranty | Favorites - all aligned right */}
        <div
          className={cn(
            "flex items-center justify-end gap-6 pr-6 transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}
        >
          {/* Search Icon (opens lightbox) */}
          <NavSearch />

          {/* Utility Links */}
          {utilityNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 text-sm font-semibold text-main-primary uppercase tracking-wide hover:text-main-secondary transition-colors whitespace-nowrap"
            >
              {item.icon === "mail" && <Mail className="size-4" />}
              {item.icon === "home" && <Home className="size-4" />}
              {item.label}
            </Link>
          ))}

          {/* Favorites */}
          <Link
            href="/account/favorites"
            className="flex items-center gap-1.5 text-sm font-semibold text-main-primary uppercase tracking-wide hover:text-main-secondary transition-colors whitespace-nowrap"
          >
            <Heart className="size-4" fill="currentColor" />
            <span>Favorites</span>
          </Link>
        </div>

        {/* Bottom row: Main nav links - aligned right */}
        <div className="flex justify-end pr-6">
          <nav
            className={cn(
              "flex items-center gap-8 border-t border-gray-200 transition-all duration-300",
              isScrolled ? "py-2" : "py-3"
            )}
          >
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-main-primary uppercase tracking-wide hover:text-main-secondary transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Right side: Ask Us - Full height */}
      <AskUsDropdown />
    </div>
  );
}

// Keep these exports for backward compatibility
export function DesktopTopBar() {
  return null;
}

export function DesktopNavBar({ isScrolled }: { isScrolled: boolean }) {
  return null;
}

export default function DesktopNav() {
  return null;
}
