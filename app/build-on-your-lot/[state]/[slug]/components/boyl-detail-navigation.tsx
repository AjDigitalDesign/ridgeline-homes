"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BOYLDetailNavigationProps {
  basePath: string;
  floorplansCount?: number;
  isStateLevelPage?: boolean;
  locationSlug?: string;
}

export default function BOYLDetailNavigation({
  basePath,
  floorplansCount = 0,
  isStateLevelPage = false,
  locationSlug,
}: BOYLDetailNavigationProps) {
  const pathname = usePathname();

  // For state-level pages, we need to handle URLs differently
  // lot-process stays at state level, but floorplans/where-we-build go to the location
  const getHref = (itemId: string) => {
    if (isStateLevelPage && locationSlug) {
      if (itemId === "lot-process") {
        return `${basePath}/lot-process`;
      }
      // For floorplans and where-we-build, link to the actual location
      return `${basePath}/${locationSlug}/${itemId}`;
    }
    return `${basePath}/${itemId}`;
  };

  const isActive = (itemId: string) => {
    if (isStateLevelPage) {
      if (itemId === "lot-process") {
        return pathname === `${basePath}/lot-process`;
      }
      return pathname === `${basePath}/${locationSlug}/${itemId}`;
    }
    return pathname === `${basePath}/${itemId}`;
  };

  const navItems = [
    { id: "lot-process", label: "THE PROCESS" },
    { id: "floorplans", label: "FLOOR PLANS" },
    { id: "where-we-build", label: "WHERE WE BUILD" },
  ];

  return (
    <nav className="bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const active = isActive(item.id);
            const href = getHref(item.id);

            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  active
                    ? "bg-main-primary text-white"
                    : "bg-white text-main-primary border border-gray-200 hover:border-main-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
