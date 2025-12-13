"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Calendar,
  ArrowRight,
  Calculator,
  FileText,
  Download,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import type { Floorplan } from "@/lib/api";
import { getStateSlug, getCitySlug } from "@/lib/url";

interface FloorplanHeaderProps {
  floorplan: Floorplan;
  onScheduleTour: () => void;
  onRequestInfo: () => void;
}

function formatPrice(price: number | null) {
  if (!price) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function calculateMonthlyPayment(price: number) {
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthlyRate = 0.065 / 12;
  const numPayments = 30 * 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthlyPayment);
}

export default function FloorplanHeader({
  floorplan,
  onScheduleTour,
  onRequestInfo,
}: FloorplanHeaderProps) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Get primary sales team member
  const primaryAgent =
    floorplan.salesTeams?.find((m) => m.isPrimary)?.salesTeam ||
    floorplan.salesTeams?.[0]?.salesTeam;

  // Get first available community for contact info
  const firstCommunity = floorplan.communityFloorplans?.[0]?.community;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Side - Floorplan Info */}
          <div className="flex-1">
            {/* Top Row: Name + Price */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              {/* Name */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-main-primary mb-1">
                  {floorplan.name}
                </h1>
                {floorplan.modelNumber && (
                  <p className="text-base text-gray-500">
                    Model: {floorplan.modelNumber}
                  </p>
                )}
                {(floorplan.planTypes?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {floorplan.planTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-main-secondary text-main-primary"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="lg:text-right">
                <p className="text-sm text-gray-500 mb-1">Starting From</p>
                <p className="text-3xl lg:text-4xl font-bold text-main-primary">
                  {formatPrice(floorplan.basePrice) || "Contact Us"}
                </p>
                {floorplan.basePrice && (
                  <button
                    onClick={() => setCalculatorOpen(true)}
                    className="flex items-center gap-2 lg:justify-end mt-1 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-sm text-gray-500">Est. Payment</span>
                    <span className="text-sm font-semibold text-main-primary">
                      {calculateMonthlyPayment(floorplan.basePrice)} / MO
                    </span>
                    <span className="p-1 rounded">
                      <Calculator className="size-5 lg:size-6 text-tertiary" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats Section - Gray background box */}
            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {floorplan.baseBedrooms && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {floorplan.baseBedrooms}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Beds
                    </p>
                  </div>
                )}
                {floorplan.baseBathrooms && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {floorplan.baseBathrooms}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Baths
                    </p>
                  </div>
                )}
                {floorplan.baseSquareFeet && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {floorplan.baseSquareFeet.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Sq Ft
                    </p>
                  </div>
                )}
                {floorplan.baseStories && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {floorplan.baseStories}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stories
                    </p>
                  </div>
                )}
                {floorplan.baseGarages && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {floorplan.baseGarages}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Car Garage
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Communities Dropdown + Homes Count + Brochure */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              {floorplan.communityFloorplans.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col items-start text-left hover:opacity-80 transition-opacity">
                      <span className="text-gray-500">Available In</span>
                      <span className="font-semibold text-main-primary flex items-center gap-1">
                        {floorplan.communityFloorplans.length} {floorplan.communityFloorplans.length === 1 ? "Community" : "Communities"}
                        <ChevronDown className="size-4" />
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    {floorplan.communityFloorplans.map((cf, index) => {
                      const communityUrl = `/communities/${getStateSlug(cf.community.state)}/${getCitySlug(cf.community.city)}/${cf.community.slug}`;
                      return (
                        <DropdownMenuItem key={index} asChild>
                          <Link href={communityUrl} className="flex flex-col items-start gap-1 cursor-pointer">
                            <span className="font-semibold text-main-primary">
                              {cf.community.name}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="size-3" />
                              {[cf.community.city, cf.community.state].filter(Boolean).join(", ")}
                              {cf.price && (
                                <span className="ml-2">
                                  From {formatPrice(cf.price)}
                                </span>
                              )}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {(floorplan._count?.homes ?? 0) > 0 && (
                <div className="pl-6 border-l border-gray-300">
                  <span className="text-gray-500">Available Homes</span>
                  <br />
                  <span className="font-semibold text-main-primary">
                    {floorplan._count?.homes} {floorplan._count?.homes === 1 ? "Home" : "Homes"}
                  </span>
                </div>
              )}
              {floorplan.brochureUrl && (
                <a
                  href={floorplan.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-main-primary bg-main-primary/5 rounded-lg hover:bg-main-primary/10 transition-colors"
                >
                  <FileText className="size-4" />
                  <span>Download Brochure</span>
                  <Download className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Side - Contact Card */}
          <div className="lg:w-[400px] xl:w-[440px] shrink-0">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl lg:text-2xl font-bold text-main-primary mb-1">
                Interested in the {floorplan.name}?
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                Our Sales Team Is Here To Help You Find Your Perfect Home
              </p>

              {/* Agent + Info + Buttons Row */}
              <div className="flex items-start gap-4">
                {/* Agent Photo + Name */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative size-16 rounded-full overflow-hidden bg-gray-200 mb-1">
                    {primaryAgent?.photo ? (
                      <Image
                        src={primaryAgent.photo}
                        alt={primaryAgent.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                        {primaryAgent?.name
                          ? primaryAgent.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "RH"}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-main-primary">
                    {primaryAgent?.name?.split(" ")[0] || "Sales"}
                  </p>
                </div>

                {/* Community Info */}
                <div className="flex-1 min-w-0">
                  {firstCommunity && (
                    <>
                      <p className="font-semibold text-main-primary">
                        {firstCommunity.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {[firstCommunity.city, firstCommunity.state].filter(Boolean).join(", ")}
                      </p>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    onClick={onScheduleTour}
                    size="sm"
                    className="bg-main-primary text-white hover:bg-main-primary/90 px-4"
                  >
                    <Calendar className="size-4 mr-2" />
                    Schedule Tour
                  </Button>
                  <Button
                    onClick={onRequestInfo}
                    size="sm"
                    className="bg-main-secondary text-main-primary hover:bg-main-secondary/80 border-0 px-4"
                  >
                    Get More Info
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Phone */}
              {primaryAgent?.phone && (
                <a
                  href={`tel:${primaryAgent.phone}`}
                  className="inline-flex items-center gap-2 text-main-secondary font-semibold hover:underline mt-4"
                >
                  <Phone className="size-4" />
                  PH {primaryAgent.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mortgage Calculator Modal */}
      <MortgageCalculator
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        initialPrice={floorplan.basePrice || 400000}
        propertyName={floorplan.name}
      />
    </div>
  );
}
