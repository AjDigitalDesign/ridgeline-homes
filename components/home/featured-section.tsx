"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, Calendar, Heart, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import type { Community, Home } from "@/lib/api";
import { getHomeUrl } from "@/lib/url";

interface FeaturedSectionProps {
  communities: Community[];
  homes: Home[];
}

function formatPrice(price: number | null) {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMonthlyPayment(price: number | null) {
  if (!price) return null;
  const monthlyRate = 0.065 / 12; // 6.5% annual rate
  const numPayments = 360; // 30 years
  const downPayment = price * 0.2; // 20% down
  const loanAmount = price - downPayment;
  const monthly =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthly);
}

function CommunityCard({ community }: { community: Community }) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const image = community.gallery?.[0] || null;
  const location = [community.city, community.state].filter(Boolean).join(", ");

  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCalculatorOpen(true);
  };

  return (
    <>
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-[220px] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={community.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-main-primary/20" />
        )}
        {/* Status Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 bg-main-primary text-white text-xs font-semibold uppercase rounded-full">
            {community.status === "ACTIVE" ? "Active" : community.status}
          </span>
        </div>
        {/* Favorite Icon */}
        <button className="absolute top-4 right-4 flex items-center justify-center size-8 bg-white/90 hover:bg-white rounded-full transition-colors">
          <Heart className="size-4 text-main-primary hover:fill-main-primary transition-colors" />
        </button>
        {/* Bottom Actions */}
        <div
          className={`absolute left-4 flex items-center gap-2 ${
            community.marketingHeadline && community.showMarketingHeadline
              ? "bottom-12"
              : "bottom-4"
          }`}
        >
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/90 text-white text-xs rounded-full">
            <Camera className="size-3.5" />
            {community.gallery?.length || 0} Photos
          </span>
          <span className="flex items-center justify-center size-8 bg-main-secondary rounded-full">
            <MapPin className="size-4 text-main-primary" />
          </span>
        </div>
        {/* Marketing Headline Banner */}
        {community.marketingHeadline && community.showMarketingHeadline && (
          <div className="absolute bottom-0 left-0 right-0 bg-main-secondary px-4 py-2">
            <p className="text-sm font-medium text-main-primary truncate">
              {community.marketingHeadline}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-main-primary group-hover:text-main-primary/80 transition-colors">
              {community.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{location}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-main-primary">
              {community.priceMin
                ? `From ${formatPrice(community.priceMin)}`
                : "Contact Us"}
            </p>
            {community.priceMin && (
              <button
                onClick={handleCalculatorClick}
                className="text-xs text-gray-500 flex items-center gap-1 justify-end hover:text-main-primary transition-colors"
              >
                {formatMonthlyPayment(community.priceMin)}/mo
                <Calculator className="size-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          {community.bedsMin && (
            <div className="text-center">
              <p className="text-sm font-semibold text-main-primary">
                {community.bedsMin}
                {community.bedsMax && community.bedsMax !== community.bedsMin
                  ? `-${community.bedsMax}`
                  : "+"}
              </p>
              <p className="text-xs text-gray-500">Beds</p>
            </div>
          )}
          {community.bathsMin && (
            <div className="text-center">
              <p className="text-sm font-semibold text-main-primary">
                {community.bathsMin}
                {community.bathsMax && community.bathsMax !== community.bathsMin
                  ? `-${community.bathsMax}`
                  : "+"}
              </p>
              <p className="text-xs text-gray-500">Baths</p>
            </div>
          )}
          {community.garagesMin && (
            <div className="text-center">
              <p className="text-sm font-semibold text-main-primary">
                {community.garagesMin}
                {community.garagesMax && community.garagesMax !== community.garagesMin
                  ? `-${community.garagesMax}`
                  : "+"}
              </p>
              <p className="text-xs text-gray-500">Garage</p>
            </div>
          )}
          {community.sqftMin && (
            <div className="text-center">
              <p className="text-sm font-semibold text-main-primary">
                {community.sqftMin.toLocaleString()}+
              </p>
              <p className="text-xs text-gray-500">SQ FT</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-main-secondary text-main-primary hover:bg-main-secondary/90"
          >
            <Link href={`/communities/${community.slug}?schedule=true`}>
              <Calendar className="size-4 mr-1.5" />
              Schedule Tour
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 border-main-primary text-main-primary hover:bg-main-primary hover:text-white"
          >
            <Link href={`/communities/${community.slug}`}>
              Details
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>

    {/* Mortgage Calculator */}
    <MortgageCalculator
      open={calculatorOpen}
      onOpenChange={setCalculatorOpen}
      initialPrice={community.priceMin || 400000}
      propertyName={community.name}
    />
    </>
  );
}

function HomeCard({ home }: { home: Home }) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const image = home.gallery?.[0] || null;
  const location = [home.city, home.state, home.zipCode]
    .filter(Boolean)
    .join(", ");
  const isUnderConstruction = home.status === "UNDER_CONSTRUCTION";

  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCalculatorOpen(true);
  };

  return (
    <>
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-[220px] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={home.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-main-primary/20" />
        )}
        {/* Status Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span
            className={`px-4 py-1.5 text-white text-xs font-semibold uppercase rounded-full ${
              isUnderConstruction ? "bg-main-primary" : "bg-main-primary"
            }`}
          >
            {isUnderConstruction ? "Under Construction" : "Active"}
          </span>
        </div>
        {/* Favorite Icon */}
        <button className="absolute top-4 right-4 flex items-center justify-center size-8 bg-white/90 hover:bg-white rounded-full transition-colors">
          <Heart className="size-4 text-main-primary hover:fill-main-primary transition-colors" />
        </button>
        {/* Bottom Actions */}
        <div
          className={`absolute left-4 flex items-center gap-2 ${
            home.marketingHeadline && home.showMarketingHeadline
              ? "bottom-12"
              : "bottom-4"
          }`}
        >
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-main-primary/90 text-white text-xs rounded-full">
            <Camera className="size-3.5" />
            {home.gallery?.length || 0} Photos
          </span>
          <span className="flex items-center justify-center size-8 bg-main-secondary rounded-full">
            <MapPin className="size-4 text-main-primary" />
          </span>
        </div>
        {/* Marketing Headline Banner */}
        {home.marketingHeadline && home.showMarketingHeadline && (
          <div className="absolute bottom-0 left-0 right-0 bg-main-secondary px-4 py-2">
            <p className="text-sm font-medium text-main-primary truncate">
              {home.marketingHeadline}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-main-primary group-hover:text-main-primary/80 transition-colors">
              {home.address || home.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{location}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-main-primary">
              {formatPrice(home.price)}
            </p>
            {home.price && (
              <button
                onClick={handleCalculatorClick}
                className="text-xs text-gray-500 flex items-center gap-1 justify-end hover:text-main-primary transition-colors"
              >
                {formatMonthlyPayment(home.price)}/mo
                <Calculator className="size-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-center">
          {home.bedrooms && (
            <div>
              <p className="text-sm font-semibold text-main-primary">
                {home.bedrooms}
              </p>
              <p className="text-xs text-gray-500">Beds</p>
            </div>
          )}
          {home.bathrooms && (
            <div>
              <p className="text-sm font-semibold text-main-primary">
                {home.bathrooms}
              </p>
              <p className="text-xs text-gray-500">Baths</p>
            </div>
          )}
          {home.squareFeet && (
            <div>
              <p className="text-sm font-semibold text-main-primary">
                {home.squareFeet.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">SQ FT</p>
            </div>
          )}
          {home.garages && (
            <div>
              <p className="text-sm font-semibold text-main-primary">
                {home.garages}-Car
              </p>
              <p className="text-xs text-gray-500">Garage</p>
            </div>
          )}
          {home.stories && (
            <div>
              <p className="text-sm font-semibold text-main-primary">
                {home.stories}
              </p>
              <p className="text-xs text-gray-500">Stories</p>
            </div>
          )}
        </div>

        {/* Community & Floorplan */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
          {home.community && (
            <div>
              <p className="text-gray-500">Community</p>
              <p className="font-semibold text-main-secondary">
                {home.community.name}
              </p>
            </div>
          )}
          {home.floorplan && (
            <div className="text-right">
              <p className="text-gray-500">Floor Plan</p>
              <p className="font-semibold text-main-secondary">
                {home.floorplan.name}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-main-secondary text-main-primary hover:bg-main-secondary/90"
          >
            <Link href={`${getHomeUrl(home)}?schedule=true`}>
              <Calendar className="size-4 mr-1.5" />
              Schedule Tour
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 border-main-primary text-main-primary hover:bg-main-primary hover:text-white"
          >
            <Link href={getHomeUrl(home)}>
              Details
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>

    {/* Mortgage Calculator */}
    <MortgageCalculator
      open={calculatorOpen}
      onOpenChange={setCalculatorOpen}
      initialPrice={home.price || 400000}
      propertyName={home.name}
    />
    </>
  );
}

export default function FeaturedSection({
  communities,
  homes,
}: FeaturedSectionProps) {
  const [activeTab, setActiveTab] = useState<"communities" | "homes">(
    "communities"
  );

  return (
    <section className="bg-[#E8EDEF] py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-16">
        {/* Header */}
        <AnimateOnScroll animation="fade-in-up" className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-main-primary">
            Featured
          </h2>
          <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
        </AnimateOnScroll>

        {/* Tabs */}
        <AnimateOnScroll
          animation="fade-in-up"
          delay={100}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={() => setActiveTab("communities")}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === "communities"
                ? "bg-main-primary text-white"
                : "bg-white text-main-primary border border-main-primary hover:bg-main-primary/5"
            }`}
          >
            Communities
          </button>
          <button
            onClick={() => setActiveTab("homes")}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === "homes"
                ? "bg-main-primary text-white"
                : "bg-white text-main-primary border border-main-primary hover:bg-main-primary/5"
            }`}
          >
            Quick Move-In Homes
          </button>
        </AnimateOnScroll>

        {/* Grid */}
        <AnimateOnScroll animation="fade-in-up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {activeTab === "communities"
              ? communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))
              : homes.map((home) => <HomeCard key={home.id} home={home} />)}
          </div>
        </AnimateOnScroll>

        {/* View All Button */}
        <AnimateOnScroll
          animation="fade-in-up"
          delay={300}
          className="flex justify-center mt-10"
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-6 text-base border-main-primary text-main-primary hover:bg-main-primary hover:text-white"
          >
            <Link
              href={activeTab === "communities" ? "/communities" : "/homes"}
            >
              View All{" "}
              {activeTab === "communities"
                ? "Communities"
                : "Quick Move-In Homes"}
            </Link>
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
