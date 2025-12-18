"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Community } from "@/lib/api";

interface BackNavigationProps {
  community: Community;
}

export default function BackNavigation({ community }: BackNavigationProps) {
  return (
    <div className="bg-white border-b mt-0.5 xl:mt-7 ">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/communities"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back To Communities</span>
          </Link>

          {/* Breadcrumb on desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <span>Communities</span>
            <span>|</span>
            <span>{community.state}</span>
            <span>|</span>
            <span>{community.city}</span>
            <span>|</span>
            <span className="text-main-primary font-medium">
              {community.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
