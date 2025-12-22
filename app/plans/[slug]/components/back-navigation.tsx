"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Floorplan } from "@/lib/api";

interface BackNavigationProps {
  floorplan: Floorplan;
}

export default function BackNavigation({ floorplan }: BackNavigationProps) {
  return (
    <div className="bg-white border-b h-12 mt-0.5 xl:mt-7 ">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back To Floor Plans</span>
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hidden lg:inline">Floor Plans</span>
            <span className="hidden lg:inline">|</span>
            <span className="text-main-primary font-medium">
              {floorplan.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
