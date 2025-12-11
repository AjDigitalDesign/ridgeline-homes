"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Calendar,
  ArrowRight,
  Calculator,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import type { Home } from "@/lib/api";
import { getStateSlug, getCitySlug } from "@/lib/url";

interface HomeHeaderProps {
  home: Home;
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

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    FOR_SALE: "For Sale",
    AVAILABLE: "Available",
    SOLD: "Sold",
    PENDING: "Pending",
    UNDER_CONTRACT: "Under Contract",
    UNDER_CONSTRUCTION: "Under Construction",
    MOVE_IN_READY: "Move-In Ready",
    COMING_SOON: "Coming Soon",
  };
  return (
    statusMap[status] ||
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}

function formatOpenHouseDate(dateString: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomeHeader({
  home,
  onScheduleTour,
  onRequestInfo,
}: HomeHeaderProps) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const address = home.address || home.street || home.name;
  const location = [home.city, home.state, home.zipCode]
    .filter(Boolean)
    .join(", ");

  // Get primary sales team member from home
  const primaryAgent =
    home.salesTeams?.find((m) => m.isPrimary)?.salesTeam ||
    home.salesTeams?.[0]?.salesTeam;

  // Community address info
  const communityAddress = home.community?.address || "";
  const communityLocation = [
    home.community?.city,
    home.community?.state,
    home.community?.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  // Build community URL
  const communityUrl = home.community
    ? `/communities/${getStateSlug(home.community.state)}/${getCitySlug(
        home.community.city
      )}/${home.community.slug}`
    : null;

  // Open house date
  const openHouseFormatted = formatOpenHouseDate(home.openHouseDate);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Side - Home Info */}
          <div className="flex-1">
            {/* Top Row: Address + Price */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              {/* Address */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-main-primary mb-1">
                  {address}
                </h1>
                {location && (
                  <p className="text-base text-main-primary flex items-center gap-1">
                    <MapPin className="size-4 text-main-secondary" />
                    {location}
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="lg:text-right">
                <p className="text-3xl lg:text-4xl font-bold text-main-primary">
                  {formatPrice(home.price) || "Contact Us"}
                </p>
                {home.price && (
                  <button
                    onClick={() => setCalculatorOpen(true)}
                    className="flex items-center gap-2 lg:justify-end mt-1 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-sm text-gray-500">Est. Payment</span>
                    <span className="text-sm font-semibold text-main-primary">
                      {calculateMonthlyPayment(home.price)} / MO
                    </span>
                    <span className="p-1  rounded">
                      <Calculator className="size-5 lg:size-6 text-tertiary" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats Section - Gray background box */}
            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {home.bedrooms && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {home.bedrooms}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Beds
                    </p>
                  </div>
                )}
                {home.bathrooms && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {home.bathrooms}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Baths
                    </p>
                  </div>
                )}
                {home.squareFeet && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {home.squareFeet.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Sq Ft
                    </p>
                  </div>
                )}
                {home.stories && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {home.stories}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stories
                    </p>
                  </div>
                )}
                {home.garages && (
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-main-primary">
                      {home.garages}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Car Garage
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Community, Plan, Lot Row + Status Badge */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              {home.community && communityUrl && (
                <div>
                  <span className="text-gray-500">Community</span>
                  <br />
                  <Link
                    href={communityUrl}
                    className="text-main-secondary font-semibold hover:underline"
                  >
                    {home.community.name}
                  </Link>
                </div>
              )}
              {home.floorplan && (
                <div className="pl-6 border-l border-gray-300">
                  <span className="text-gray-500">Plan</span>
                  <br />
                  <Link
                    href={`/plans/${home.floorplan.slug}`}
                    className="font-semibold text-main-primary hover:underline"
                  >
                    {home.floorplan.name}
                  </Link>
                </div>
              )}
              {home.lotNumber && (
                <div className="pl-6 border-l border-gray-300">
                  <span className="text-gray-500">Lot</span>
                  <br />
                  <span className="font-semibold text-main-primary">
                    {home.lotNumber}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="lg:ml-auto">
                <span className="inline-block px-5 py-2.5 text-sm font-bold rounded-lg border-2 border-gray-300 text-main-primary bg-white">
                  {formatStatus(home.status)}
                </span>
              </div>
            </div>

            {/* Open House Row */}
            {openHouseFormatted && (
              <div className="flex items-center gap-2 mt-4 text-sm">
                <CalendarDays className="size-4 text-main-secondary" />
                <span className="text-gray-500">Open House:</span>
                <span className="font-semibold text-main-primary">
                  {openHouseFormatted}
                </span>
              </div>
            )}

          </div>

          {/* Right Side - Contact Card */}
          <div className="lg:w-[400px] xl:w-[440px] shrink-0">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl lg:text-2xl font-bold text-main-primary mb-1">
                Interested in this Home?
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                The Ridgeline Homes Sales Team Is Here To Help You Through the
                Homebuying Process
              </p>

              {/* Agent + Community Info + Buttons Row */}
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
                  {home.community && (
                    <>
                      <p className="font-semibold text-main-primary">
                        {home.community.name}
                      </p>
                      {communityAddress && (
                        <p className="text-sm text-gray-600">
                          {communityAddress}
                        </p>
                      )}
                      {communityLocation && (
                        <p className="text-sm text-gray-600">
                          {communityLocation}
                        </p>
                      )}
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
                    Schedule Showing
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
              {(primaryAgent?.phone || home.community?.phoneNumber) && (
                <a
                  href={`tel:${
                    primaryAgent?.phone || home.community?.phoneNumber
                  }`}
                  className="inline-flex items-center gap-2 text-main-secondary font-semibold hover:underline mt-4"
                >
                  <Phone className="size-4" />
                  PH {primaryAgent?.phone || home.community?.phoneNumber}
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
        initialPrice={home.price || 400000}
        propertyName={address}
      />
    </div>
  );
}
