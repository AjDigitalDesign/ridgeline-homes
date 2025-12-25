"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MapPin, ChevronRight, ChevronDown, Loader2, ArrowRight } from "lucide-react";
import MainLogo from "../main-logo";
import { cn } from "@/lib/utils";
import { useTenantContact, useTenantAssets } from "@/components/providers/tenant-provider";
import { fetchNavigation, fetchBOYLLocations, type NavigationState, type BOYLLocation } from "@/lib/api";
import { FavoritesLink } from "@/components/header/favorites-link";
import { useLocation } from "@/components/providers/location-provider";

// Map state abbreviations to full names
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

const getStateName = (abbr: string) => STATE_NAMES[abbr] || abbr;

// Static navigation constants
const ABOUT_SUBMENU = [
  { label: "About Us", href: "/about-us" },
  { label: "Design Center", href: "/design-center" },
  { label: "Our Process", href: "/our-process" },
  { label: "Blog", href: "/blog" },
];

const GALLERY_SUBMENU = [
  { label: "Photos", href: "/photos" },
  { label: "Videos", href: "/videos" },
  { label: "Virtual Tours", href: "/virtual-tours" },
];

const FINANCING_SUBMENU = [
  { label: "Financing", href: "/financing" },
  { label: "Promotions", href: "/promo" },
];

// BOYL location grouping
interface BOYLNavState {
  state: string;
  stateName: string;
  locations: { name: string; slug: string; county: string }[];
}

function groupBOYLLocationsByState(locations: BOYLLocation[]): BOYLNavState[] {
  const grouped = locations.reduce((acc, location) => {
    if (!acc[location.state]) {
      acc[location.state] = [];
    }
    acc[location.state].push({
      name: location.name,
      slug: location.slug,
      county: location.county,
    });
    return acc;
  }, {} as Record<string, { name: string; slug: string; county: string }[]>);

  return Object.entries(grouped)
    .map(([state, locs]) => ({
      state,
      stateName: getStateName(state),
      locations: locs.sort((a, b) => a.county.localeCompare(b.county)),
    }))
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
}

// BOLD template header - Schumacher-style design
export function HeaderBold() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);
  const questionDropdownRef = useRef<HTMLDivElement>(null);
  const contact = useTenantContact();
  const assets = useTenantAssets();
  const { userLocation, isLoadingLocation, locationError, requestLocation, clearLocation } = useLocation();

  // Dynamic navigation data
  const [isLoadingNav, setIsLoadingNav] = useState(false);
  const [marketAreas, setMarketAreas] = useState<NavigationState[]>([]);
  const [boylLocations, setBoylLocations] = useState<BOYLNavState[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close question dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (questionDropdownRef.current && !questionDropdownRef.current.contains(event.target as Node)) {
        setIsQuestionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load navigation data when menu opens
  useEffect(() => {
    async function loadNavigationData() {
      if (!isMobileMenuOpen || (marketAreas.length > 0 && boylLocations.length > 0)) return;

      setIsLoadingNav(true);
      try {
        const [navResponse, boylResponse] = await Promise.all([
          fetchNavigation({ previewLimit: 10, type: "communities" }),
          fetchBOYLLocations(),
        ]);

        // Handle navigation response
        const navData = navResponse.data;
        const communities = Array.isArray(navData) ? navData : navData?.communities || [];
        setMarketAreas(communities);

        // Handle BOYL response
        const locations = Array.isArray(boylResponse.data) ? boylResponse.data : [];
        setBoylLocations(groupBOYLLocationsByState(locations));
      } catch (error) {
        console.error("Failed to load navigation:", error);
      } finally {
        setIsLoadingNav(false);
      }
    }

    loadNavigationData();
  }, [isMobileMenuOpen, marketAreas.length, boylLocations.length]);

  // Navigation items configuration
  type NavItem = {
    label: string;
    href: string;
    hasArrow?: boolean;
    isDynamic?: "findYourHome" | "buildOnYourLot";
    submenu?: { label: string; href: string }[] | null;
    image: string;
    imageTitle: string;
  };

  const navItems: NavItem[] = [
    {
      label: "Find Your Home",
      href: "/communities",
      hasArrow: true,
      isDynamic: "findYourHome",
      submenu: null,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      imageTitle: "Find & Customize\na House Plan",
    },
    {
      label: "Build On Your Land",
      href: "/build-on-your-lot",
      isDynamic: "buildOnYourLot",
      submenu: null,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      imageTitle: "Build Your Dream\non Your Land",
    },
    {
      label: "About",
      href: "/about-us",
      submenu: ABOUT_SUBMENU,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      imageTitle: "Our Story\n& Values",
    },
    {
      label: "Gallery",
      href: "/photos",
      submenu: GALLERY_SUBMENU,
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
      imageTitle: "Explore Our\nHome Gallery",
    },
    {
      label: "Financing",
      href: "/financing",
      submenu: FINANCING_SUBMENU,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      imageTitle: "Flexible Financing\nOptions",
    },
  ];

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
    setExpandedState(null);
  };

  const toggleStateExpand = (state: string) => {
    setExpandedState(expandedState === state ? null : state);
  };

  const openMenu = () => {
    setIsMobileMenuOpen(true);
    // On desktop (sm+), default to Find Your Home. On mobile, start with no selection
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      setActiveSubmenu("Find Your Home");
    } else {
      setActiveSubmenu(null);
    }
    setExpandedState(null);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
    setExpandedState(null);
  };

  // Render dynamic submenu content
  const renderSubmenuContent = () => {
    if (!activeSubmenu) {
      return (
        <p className="text-gray-400 text-sm">
          Select a menu item to see more options
        </p>
      );
    }

    const activeItem = navItems.find((item) => item.label === activeSubmenu);

    // Find Your Home - Dynamic market areas
    if (activeItem?.isDynamic === "findYourHome") {
      return (
        <>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
            FIND YOUR HOME
          </h3>
          {isLoadingNav ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 sm:size-6 animate-spin text-main-primary" />
            </div>
          ) : marketAreas.length === 0 ? (
            <p className="text-gray-400 text-xs sm:text-sm">No communities available</p>
          ) : (
            <nav className="space-y-1">
              {marketAreas.map((stateData) => (
                <div key={stateData.state}>
                  <button
                    onClick={() => toggleStateExpand(stateData.state)}
                    className={cn(
                      "w-full flex items-center justify-between py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg xl:text-xl transition-colors",
                      expandedState === stateData.state
                        ? "text-main-secondary font-medium"
                        : "text-main-primary hover:text-main-secondary"
                    )}
                  >
                    {getStateName(stateData.state)}
                    <ChevronDown
                      className={cn(
                        "size-4 sm:size-5 transition-transform",
                        expandedState === stateData.state && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedState === stateData.state ? "max-h-[300px]" : "max-h-0"
                    )}
                  >
                    <div className="pl-3 sm:pl-4 pb-2 space-y-1">
                      {stateData.previewCities.slice(0, stateData.previewCities.length > 5 ? 3 : stateData.previewCities.length).map((cityData) => (
                        <Link
                          key={cityData.city}
                          href={`/communities?state=${stateData.state}&city=${encodeURIComponent(cityData.city)}`}
                          onClick={closeMenu}
                          className="block py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 hover:text-main-secondary transition-colors"
                        >
                          {cityData.city}
                        </Link>
                      ))}
                      {(stateData.hasMoreCities || stateData.previewCities.length > 5) && (
                        <Link
                          href={`/communities?state=${stateData.state}`}
                          onClick={closeMenu}
                          className="block py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg xl:text-xl text-main-secondary hover:text-main-secondary/80 transition-colors"
                        >
                          View All →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          )}
        </>
      );
    }

    // Build On Your Land - Dynamic BOYL locations
    if (activeItem?.isDynamic === "buildOnYourLot") {
      return (
        <>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
            BUILD ON YOUR LAND
          </h3>
          {isLoadingNav ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 sm:size-6 animate-spin text-main-primary" />
            </div>
          ) : boylLocations.length === 0 ? (
            <p className="text-gray-400 text-xs sm:text-sm">No locations available</p>
          ) : (
            <nav className="space-y-1">
              {boylLocations.map((stateData) => (
                <div key={stateData.state}>
                  <button
                    onClick={() => toggleStateExpand(stateData.state)}
                    className={cn(
                      "w-full flex items-center justify-between py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg xl:text-xl transition-colors",
                      expandedState === stateData.state
                        ? "text-main-secondary font-medium"
                        : "text-main-primary hover:text-main-secondary"
                    )}
                  >
                    {stateData.stateName}
                    <ChevronDown
                      className={cn(
                        "size-4 sm:size-5 transition-transform",
                        expandedState === stateData.state && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedState === stateData.state ? "max-h-[300px]" : "max-h-0"
                    )}
                  >
                    <div className="pl-3 sm:pl-4 pb-2 space-y-1">
                      {stateData.locations.slice(0, stateData.locations.length > 5 ? 3 : stateData.locations.length).map((location) => (
                        <Link
                          key={location.slug}
                          href={`/build-on-your-lot/${stateData.state.toLowerCase()}/${location.slug}/lot-process`}
                          onClick={closeMenu}
                          className="block py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 hover:text-main-secondary transition-colors"
                        >
                          {location.county}
                        </Link>
                      ))}
                      {stateData.locations.length > 5 && (
                        <Link
                          href={`/build-on-your-lot/${stateData.state.toLowerCase()}/lot-process`}
                          onClick={closeMenu}
                          className="block py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg xl:text-xl text-main-secondary hover:text-main-secondary/80 transition-colors"
                        >
                          View All →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          )}
        </>
      );
    }

    // Static submenus (About, Gallery, Financing)
    if (activeItem?.submenu) {
      return (
        <>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
            {activeSubmenu.toUpperCase()}
          </h3>
          <nav className="space-y-2 sm:space-y-3">
            {activeItem.submenu.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={closeMenu}
                className="block text-sm sm:text-base lg:text-lg xl:text-xl text-main-primary hover:text-main-secondary transition-colors"
              >
                {subItem.label}
              </Link>
            ))}
          </nav>
        </>
      );
    }

    return null;
  };

  // Render mobile submenu content inline
  const renderMobileSubmenuContent = (item: NavItem) => {
    // Find Your Home - Dynamic market areas
    if (item.isDynamic === "findYourHome") {
      return (
        <>
          {isLoadingNav ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-5 animate-spin text-main-primary" />
            </div>
          ) : marketAreas.length === 0 ? (
            <p className="text-gray-400 text-sm">No communities available</p>
          ) : (
            <div className="space-y-1">
              {marketAreas.map((stateData) => (
                <div key={stateData.state}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStateExpand(stateData.state);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between py-2 text-sm transition-colors",
                      expandedState === stateData.state
                        ? "text-main-secondary font-medium"
                        : "text-main-primary"
                    )}
                  >
                    {getStateName(stateData.state)}
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform",
                        expandedState === stateData.state && "rotate-90"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedState === stateData.state ? "max-h-[300px]" : "max-h-0"
                    )}
                  >
                    <div className="pl-3 pb-2 space-y-1">
                      {stateData.previewCities.slice(0, stateData.previewCities.length > 5 ? 3 : stateData.previewCities.length).map((cityData) => (
                        <Link
                          key={cityData.city}
                          href={`/communities?state=${stateData.state}&city=${encodeURIComponent(cityData.city)}`}
                          onClick={closeMenu}
                          className="block py-1.5 text-sm text-gray-600"
                        >
                          {cityData.city}
                        </Link>
                      ))}
                      {(stateData.hasMoreCities || stateData.previewCities.length > 5) && (
                        <Link
                          href={`/communities?state=${stateData.state}`}
                          onClick={closeMenu}
                          className="block py-1.5 text-sm text-main-secondary"
                        >
                          View All →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    // Build On Your Land - Dynamic BOYL locations
    if (item.isDynamic === "buildOnYourLot") {
      return (
        <>
          {isLoadingNav ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-5 animate-spin text-main-primary" />
            </div>
          ) : boylLocations.length === 0 ? (
            <p className="text-gray-400 text-sm">No locations available</p>
          ) : (
            <div className="space-y-1">
              {boylLocations.map((stateData) => (
                <div key={stateData.state}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStateExpand(stateData.state);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between py-2 text-sm transition-colors",
                      expandedState === stateData.state
                        ? "text-main-secondary font-medium"
                        : "text-main-primary"
                    )}
                  >
                    {stateData.stateName}
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform",
                        expandedState === stateData.state && "rotate-90"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedState === stateData.state ? "max-h-[300px]" : "max-h-0"
                    )}
                  >
                    <div className="pl-3 pb-2 space-y-1">
                      {stateData.locations.slice(0, stateData.locations.length > 5 ? 3 : stateData.locations.length).map((location) => (
                        <Link
                          key={location.slug}
                          href={`/build-on-your-lot/${stateData.state.toLowerCase()}/${location.slug}/lot-process`}
                          onClick={closeMenu}
                          className="block py-1.5 text-sm text-gray-600"
                        >
                          {location.county}
                        </Link>
                      ))}
                      {stateData.locations.length > 5 && (
                        <Link
                          href={`/build-on-your-lot/${stateData.state.toLowerCase()}/lot-process`}
                          onClick={closeMenu}
                          className="block py-1.5 text-sm text-main-secondary"
                        >
                          View All →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    // Static submenus (About, Gallery, Financing)
    if (item.submenu) {
      return (
        <div className="space-y-1">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={closeMenu}
              className="block py-2 text-sm text-main-primary"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      );
    }

    return null;
  };

  // Get header height for menu positioning
  const headerHeight = isScrolled ? 64 : 80; // h-16 = 64px, h-20 = 80px

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          isScrolled ? "shadow-lg" : ""
        )}
      >
        {/* Main Navigation Bar */}
        <div className="bg-white">
          <div className="container mx-auto px-6 lg:px-8 xl:px-10">
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-300",
                isScrolled ? "h-16" : "h-20"
              )}
            >
              {/* Left Section: Hamburger + Location */}
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Hamburger Menu Button */}
                <button
                  onClick={() => isMobileMenuOpen ? closeMenu() : openMenu()}
                  className={cn(
                    "size-12 rounded-full border-2 flex items-center justify-center transition-colors",
                    isMobileMenuOpen
                      ? "border-main-primary bg-main-primary text-white"
                      : "border-gray-300 text-main-primary hover:border-main-primary"
                  )}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="size-5" strokeWidth={1.5} />
                  ) : (
                    <Menu className="size-5" strokeWidth={1.5} />
                  )}
                </button>

                {/* Set Location */}
                <button
                  onClick={() => userLocation ? clearLocation() : requestLocation()}
                  className="hidden sm:flex items-center gap-2 text-main-primary hover:text-main-secondary transition-colors"
                  disabled={isLoadingLocation}
                  title={locationError || undefined}
                >
                  {isLoadingLocation ? (
                    <Loader2 className="size-5 text-main-secondary animate-spin" />
                  ) : (
                    <MapPin className={cn(
                      "size-5",
                      userLocation ? "text-main-secondary fill-main-secondary" : "text-gray-400"
                    )} />
                  )}
                  <span className="text-sm font-medium">
                    {isLoadingLocation
                      ? "Getting location..."
                      : userLocation
                        ? `${userLocation.city || "Location"}${userLocation.state ? `, ${userLocation.state}` : ""}`
                        : "Set Location"}
                  </span>
                  {userLocation && !isLoadingLocation && (
                    <X className="size-3.5 text-gray-400 hover:text-main-primary" />
                  )}
                </button>
              </div>

              {/* Center: Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <div
                  className={cn(
                    "transition-all duration-300 relative",
                    isScrolled ? "h-10 w-40 lg:h-12 lg:w-48" : "h-12 w-48 lg:h-14 lg:w-56"
                  )}
                >
                  {assets?.logo ? (
                    <Image
                      src={assets.logo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <MainLogo variant="dark" />
                  )}
                </div>
              </Link>

              {/* Right Section: CTA + Login */}
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Have a Question? Dropdown */}
                <div className="relative hidden md:block" ref={questionDropdownRef}>
                  <button
                    onClick={() => setIsQuestionDropdownOpen(!isQuestionDropdownOpen)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-main-secondary text-main-primary font-semibold rounded-full hover:bg-main-secondary/90 transition-colors text-sm"
                  >
                    Have a Question?
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        isQuestionDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown Form */}
                  <div
                    className={cn(
                      "absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border p-5 transition-all duration-200",
                      isQuestionDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    )}
                  >
                    <h4 className="text-lg font-semibold text-main-primary mb-4">
                      Ask Us Anything
                    </h4>
                    <form
                      className="space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // Handle form submission
                        setIsQuestionDropdownOpen(false);
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-secondary/50 focus:border-main-secondary"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-secondary/50 focus:border-main-secondary"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-secondary/50 focus:border-main-secondary"
                      />
                      <textarea
                        placeholder="Your Question"
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-secondary/50 focus:border-main-secondary resize-none"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-main-primary text-white font-semibold rounded-lg hover:bg-main-primary/90 transition-colors text-sm"
                      >
                        Submit Question
                      </button>
                    </form>
                  </div>
                </div>

                {/* Favorites */}
                <FavoritesLink className="text-main-primary hover:text-main-secondary" />
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-0.5 bg-main-secondary" />
        </div>
      </header>

      {/* Full Screen Off-Canvas Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white transition-all duration-300 ease-out",
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
        style={{ top: `${headerHeight + 2}px` }} // +2 for accent line
      >
        {/* Menu Content - Three Column Layout */}
        <div className="flex h-full">
          {/* Column 1 - Main Nav */}
          <div className="w-full sm:max-w-sm p-4 sm:p-6 lg:p-8 xl:p-10 sm:border-r overflow-y-auto flex flex-col">
            {/* Nav items */}
            <nav className="space-y-1 sm:space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "w-full text-left text-sm sm:text-base lg:text-lg xl:text-[22px] px-3 sm:px-5 py-2 sm:py-3 rounded-full flex items-center justify-between group transition-all duration-300 ease-out",
                      activeSubmenu === item.label
                        ? "bg-main-primary text-white font-medium"
                        : "bg-transparent text-main-primary hover:bg-gray-100"
                    )}
                  >
                    {item.label}
                    {/* Desktop: Arrow, Mobile: Chevron */}
                    <ArrowRight
                      className={cn(
                        "hidden sm:block size-4 sm:size-5 transition-all duration-300 ease-out",
                        activeSubmenu === item.label
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "sm:hidden size-4 transition-transform duration-300",
                        activeSubmenu === item.label && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Mobile: Inline submenu content */}
                  <div
                    className={cn(
                      "sm:hidden overflow-hidden transition-all duration-300",
                      activeSubmenu === item.label ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="pl-4 pr-2 py-3">
                      {activeSubmenu === item.label && renderMobileSubmenuContent(item)}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Spacer to push contact to bottom */}
            <div className="flex-1" />

            {/* Contact Section - Fixed at bottom */}
            <div className="pt-4 sm:pt-6 border-t mt-4 sm:mt-6">
              <p className="text-sm sm:text-base lg:text-lg xl:text-[22px] text-main-primary mb-2">
                Questions? Contact Us.
              </p>
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="block text-lg sm:text-xl lg:text-2xl font-bold text-main-primary mb-4 sm:mb-6"
                >
                  {contact.phone}
                </a>
              )}
              <button className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-main-primary uppercase tracking-wider border-b-2 border-main-secondary pb-1 hover:text-main-secondary transition-colors">
                Chat with us
              </button>
            </div>
          </div>

          {/* Column 2 - Submenu Content */}
          <div className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6 lg:p-8 xl:p-10 border-r overflow-y-auto hidden sm:block">
            <div
              key={activeSubmenu}
              className="animate-in fade-in slide-in-from-left-4 duration-300"
            >
              {renderSubmenuContent()}
            </div>
          </div>

          {/* Column 3 - Featured Image */}
          <div className="flex-1 p-6 lg:p-8 xl:p-10 hidden lg:flex items-center justify-center">
            {(() => {
              const activeItem = navItems.find((item) => item.label === activeSubmenu);
              if (!activeItem) return null;
              return (
                <div
                  key={activeSubmenu}
                  className="relative w-full max-w-2xl aspect-4/3 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                >
                  <img
                    src={activeItem.image}
                    alt={activeItem.label}
                    className="h-full w-full object-cover"
                  />
                  {/* Overlay with text */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-white italic whitespace-pre-line leading-tight">
                      {activeItem.imageTitle}
                    </h3>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
