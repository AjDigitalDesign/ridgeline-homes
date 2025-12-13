"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Floorplan } from "@/lib/api";

interface BackNavigationProps {
  floorplan: Floorplan;
}

export default function BackNavigation({ floorplan }: BackNavigationProps) {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back To Floor Plans</span>
          </Link>

          {/* Breadcrumb on desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <span>Floor Plans</span>
            <span>|</span>
            <span className="text-main-primary font-medium">{floorplan.name}</span>
          </div>
        </div>

        {/* Mobile name display */}
        <div className="lg:hidden mt-2">
          <p className="text-main-primary font-semibold">{floorplan.name}</p>
          {floorplan.modelNumber && (
            <p className="text-sm text-gray-500">Model: {floorplan.modelNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}
