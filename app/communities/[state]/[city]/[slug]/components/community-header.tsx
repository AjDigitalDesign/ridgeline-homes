"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Calendar, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import type { Community } from "@/lib/api";

interface SalesTeamMember {
  isPrimary: boolean;
  displayOrder: number;
  salesTeam: {
    id: string;
    name: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
  };
}

interface CommunityHeaderProps {
  community: Community;
  floorplansCount: number;
  homesCount: number;
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

function calculateMonthlyPayment(price: number): string {
  // Rough estimate: 30-year mortgage at ~7% interest, 20% down
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthlyInterest = 0.07 / 12;
  const numberOfPayments = 30 * 12;
  const monthlyPayment =
    (loanAmount *
      (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments))) /
    (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthlyPayment);
}

export default function CommunityHeader({
  community,
  floorplansCount,
  homesCount,
  onScheduleTour,
  onRequestInfo,
}: CommunityHeaderProps) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const addressLine1 = community.address || "";
  const addressLine2 = [community.city, community.state, community.zipCode]
    .filter(Boolean)
    .join(", ");

  // Get primary sales team member
  const primaryAgent =
    community.salesTeams?.find((m: SalesTeamMember) => m.isPrimary)
      ?.salesTeam || community.salesTeams?.[0]?.salesTeam;

  return (
    <div className="bg-white">
      {/* Main Header Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Side - Community Info */}
          <div className="lg:col-span-3">
            {/* Top Row: Name + Price */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              {/* Community Name & Address */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-main-primary mb-3">
                  {community.name}
                </h1>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Sales Office
                  </p>
                  <p className="text-base text-main-primary font-medium">
                    {addressLine1}
                  </p>
                  <p className="text-base text-main-primary">{addressLine2}</p>
                </div>
              </div>

              {/* Price Section */}
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Base Price
                </p>
                <p className="text-3xl lg:text-4xl font-bold text-main-primary">
                  {formatPrice(community.priceMin) || "Contact Us"}
                </p>
                {community.priceMin && (
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <button
                      onClick={() => setCalculatorOpen(true)}
                      className="flex items-center gap-2 hover:text-main-primary transition-colors"
                    >
                      <span className="text-sm text-gray-500">
                        Est. Payment
                      </span>
                      <span className="text-sm font-semibold text-main-primary">
                        {calculateMonthlyPayment(community.priceMin)}/MO
                      </span>
                      <span className="p-1  rounded hover:bg-gray-200 transition-colors">
                        <Calculator className="size-6 lg:size-6.5 text-tertiary" />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Section with bottom border */}
            <div className="py-4 border-b border-gray-200 mb-4">
              <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                {/* Sq Ft */}
                {community.sqftMin && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {community.sqftMin.toLocaleString()}
                      {community.sqftMax &&
                      community.sqftMax !== community.sqftMin
                        ? ` - ${community.sqftMax.toLocaleString()}`
                        : "+"}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Sq Ft
                    </p>
                  </div>
                )}

                {/* Beds */}
                {community.bedsMin && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {community.bedsMin}
                      {community.bedsMax &&
                      community.bedsMax !== community.bedsMin
                        ? ` - ${community.bedsMax}`
                        : "+"}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Beds
                    </p>
                  </div>
                )}

                {/* Baths */}
                {community.bathsMin && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {community.bathsMin}
                      {community.bathsMax &&
                      community.bathsMax !== community.bathsMin
                        ? ` - ${community.bathsMax}`
                        : "+"}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Baths
                    </p>
                  </div>
                )}

                {/* Garages */}
                {community.garagesMin && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {community.garagesMin}
                      {community.garagesMax &&
                      community.garagesMax !== community.garagesMin
                        ? ` - ${community.garagesMax}`
                        : "+"}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Garage
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3">
              {floorplansCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
                  <span className="text-lg font-bold text-main-primary">
                    {floorplansCount}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Floor Plans
                  </span>
                </div>
              )}

              {homesCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
                  <span className="text-lg font-bold text-main-primary">
                    {homesCount}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Available Homes
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                className="border-main-primary text-main-primary hover:bg-main-primary hover:text-white uppercase text-xs font-semibold tracking-wider"
              >
                Available Now
              </Button>
            </div>
          </div>

          {/* Right Side - Contact Card */}
          <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl lg:text-2xl font-bold text-main-primary mb-1">
              Interested in this Community?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              The Ridgeline Homes Sales Team Is Here To Help You Through the
              Homebuying Process
            </p>

            {/* Agent Info Row */}
            <div className="flex items-start gap-4 mb-4">
              {/* Agent Photo + Name */}
              {primaryAgent && (
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative size-16 rounded-full overflow-hidden bg-gray-200 mb-2">
                    {primaryAgent.photo ? (
                      <Image
                        src={primaryAgent.photo}
                        alt={primaryAgent.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                        {primaryAgent.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-main-primary">
                    {primaryAgent.name.split(" ")[0]}
                  </p>
                </div>
              )}

              {/* Community Info + Buttons */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-main-primary">
                  {community.name}
                </p>
                <p className="text-sm text-gray-600">{addressLine1}</p>
                <p className="text-sm text-gray-600">{addressLine2}</p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    onClick={onScheduleTour}
                    size="sm"
                    className="w-full bg-main-primary text-white hover:bg-main-primary/90"
                  >
                    <Calendar className="size-4 mr-2" />
                    Schedule Showing
                  </Button>
                  <Button
                    onClick={onRequestInfo}
                    size="sm"
                    className="w-full bg-main-secondary text-main-primary hover:bg-main-secondary/80 border-0"
                  >
                    Get More Info
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Phone */}
            {primaryAgent?.phone && (
              <a
                href={`tel:${primaryAgent.phone}`}
                className="inline-flex items-center gap-2 text-main-secondary font-semibold hover:underline"
              >
                <Phone className="size-4" />
                PH {primaryAgent.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mortgage Calculator Modal */}
      <MortgageCalculator
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        initialPrice={community.priceMin || 400000}
        propertyName={community.name}
      />
    </div>
  );
}
