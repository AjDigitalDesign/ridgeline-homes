"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Pause, Play, ChevronDown } from "lucide-react";
import { fetchNavigation, type NavigationState } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BannerSlide } from "./hero-classic";

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

interface HeroBoldProps {
  slides: BannerSlide[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  heroVideoUrl?: string | null;
  heroVideoTitle?: string | null;
  heroVideoSubtitle?: string | null;
  heroVideoPosterImage?: string | null;
  heroBackgroundImage?: string | null;
  heroShowSearch?: boolean;
}

// BOLD template hero - Schumacher-style design
// Full-screen video/image with left-aligned content and search filters
export function HeroBold({
  slides,
  heroVideoUrl,
  heroVideoTitle,
  heroVideoSubtitle,
  heroVideoPosterImage,
  heroBackgroundImage,
  heroShowSearch = true,
}: HeroBoldProps) {
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Search filter state
  const [navigationData, setNavigationData] = useState<NavigationState[]>([]);
  const [isLoadingNav, setIsLoadingNav] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Use first slide as fallback
  const slide = slides[0];

  // Determine background media - prioritize heroVideoUrl, then heroBackgroundImage, then slide
  const videoUrl = heroVideoUrl || null;
  const backgroundImage = heroBackgroundImage || heroVideoPosterImage || slide?.imageUrl;
  const title = heroVideoTitle || slide?.title || "Find Your Dream Home";
  const subtitle = heroVideoSubtitle || slide?.description || "";

  // Check if video is a direct video file
  const isDirectVideo = videoUrl && (
    videoUrl.endsWith('.mp4') ||
    videoUrl.endsWith('.webm') ||
    videoUrl.endsWith('.mov')
  );

  // Load navigation data for search filters
  useEffect(() => {
    async function loadNavigation() {
      if (navigationData.length > 0) return;

      setIsLoadingNav(true);
      try {
        const response = await fetchNavigation({ previewLimit: 100, type: "communities" });
        const data = response.data;
        const communities = Array.isArray(data) ? data : data?.communities || [];
        setNavigationData(communities);
      } catch (error) {
        console.error("Failed to load navigation:", error);
      } finally {
        setIsLoadingNav(false);
      }
    }

    loadNavigation();
  }, [navigationData.length]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Get cities for selected state
  const citiesForState = selectedState
    ? navigationData.find((s) => s.state === selectedState)?.previewCities || []
    : [];

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedState) {
      params.set("state", selectedState);
    }
    if (selectedCity) {
      params.set("city", selectedCity);
    }
    router.push(`/communities?${params.toString()}`);
  };

  // Reset city when state changes
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("");
    setStateDropdownOpen(false);
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {isDirectVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={heroVideoPosterImage || undefined}
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        ) : null}
        {/* Dark overlay - stronger gradient for text readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title - Large serif font style */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 font-serif">
              {title.split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="italic font-normal">
                {title.split(' ').slice(2).join(' ')}
              </span>
            </h1>

            {/* Description */}
            {subtitle && (
              <p className="text-base sm:text-lg text-white/90 mb-8 max-w-lg mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Search Bar - Below content */}
            {heroShowSearch && (
              <div className="mt-8">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-stretch shadow-lg rounded-lg max-w-2xl mx-auto">
                  {/* Search Label */}
                  <div className="bg-main-secondary text-main-primary px-6 lg:px-8 py-4 flex items-center rounded-l-lg">
                    <span className="text-base lg:text-lg font-semibold whitespace-nowrap">Search</span>
                  </div>

                  {/* Search Filters */}
                  <div className="flex-1 bg-white flex items-center rounded-r-lg">
                    {/* State Dropdown */}
                    <div className="relative flex-1 border-r border-gray-200">
                      <button
                        onClick={() => {
                          setStateDropdownOpen(!stateDropdownOpen);
                          setCityDropdownOpen(false);
                        }}
                        className="w-full px-4 lg:px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        disabled={isLoadingNav}
                      >
                        <div className="flex items-center gap-2 lg:gap-3">
                          <Search className="size-4 lg:size-5 text-main-secondary" />
                          <span className={cn("text-sm lg:text-base", selectedState ? "text-main-primary" : "text-gray-400")}>
                            {selectedState ? getStateName(selectedState) : "Select State"}
                          </span>
                        </div>
                        <ChevronDown className={cn("size-4 lg:size-5 text-main-secondary transition-transform", stateDropdownOpen && "rotate-180")} />
                      </button>

                      {/* State Dropdown Menu */}
                      {stateDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50 rounded-b-lg">
                          <button
                            onClick={() => handleStateChange("")}
                            className="w-full px-4 lg:px-6 py-3 text-left text-sm lg:text-base hover:bg-gray-50 text-gray-400"
                          >
                            All States
                          </button>
                          {navigationData.map((stateData) => (
                            <button
                              key={stateData.state}
                              onClick={() => handleStateChange(stateData.state)}
                              className={cn(
                                "w-full px-4 lg:px-6 py-3 text-left text-sm lg:text-base hover:bg-gray-50 transition-colors",
                                selectedState === stateData.state ? "bg-main-secondary/20 text-main-primary font-medium" : "text-main-primary"
                              )}
                            >
                              {getStateName(stateData.state)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* City Dropdown */}
                    <div className="relative flex-1 border-r border-gray-200">
                      <button
                        onClick={() => {
                          if (selectedState) {
                            setCityDropdownOpen(!cityDropdownOpen);
                            setStateDropdownOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full px-4 lg:px-6 py-4 flex items-center justify-between text-left transition-colors",
                          selectedState ? "hover:bg-gray-50" : "cursor-not-allowed opacity-60"
                        )}
                        disabled={!selectedState}
                      >
                        <span className={cn("text-sm lg:text-base", selectedCity ? "text-main-primary" : "text-gray-400")}>
                          {selectedCity || "Select City"}
                        </span>
                        <ChevronDown className={cn("size-4 lg:size-5 text-main-secondary transition-transform", cityDropdownOpen && "rotate-180")} />
                      </button>

                      {/* City Dropdown Menu */}
                      {cityDropdownOpen && citiesForState.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50 rounded-b-lg">
                          <button
                            onClick={() => {
                              setSelectedCity("");
                              setCityDropdownOpen(false);
                            }}
                            className="w-full px-4 lg:px-6 py-3 text-left text-sm lg:text-base hover:bg-gray-50 text-gray-400"
                          >
                            All Cities
                          </button>
                          {citiesForState.map((cityData) => (
                            <button
                              key={cityData.city}
                              onClick={() => {
                                setSelectedCity(cityData.city);
                                setCityDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full px-4 lg:px-6 py-3 text-left text-sm lg:text-base hover:bg-gray-50 transition-colors",
                                selectedCity === cityData.city ? "bg-main-secondary/20 text-main-primary font-medium" : "text-main-primary"
                              )}
                            >
                              {cityData.city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="bg-main-secondary text-main-primary px-6 lg:px-8 py-4 flex items-center gap-2 hover:bg-main-secondary/90 transition-colors rounded-r-lg"
                    >
                      <Search className="size-4 lg:size-5" />
                      <span className="text-sm lg:text-base font-semibold">Search</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Layout - Stacked */}
                <div className="md:hidden bg-white p-4 space-y-3 shadow-lg rounded-lg">
                  {/* Search Label */}
                  <div className="bg-main-secondary text-main-primary px-4 py-3 rounded-lg">
                    <span className="text-sm font-semibold">Search</span>
                  </div>

                  {/* State Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setStateDropdownOpen(!stateDropdownOpen);
                        setCityDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 rounded-lg border border-gray-200"
                      disabled={isLoadingNav}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="size-4 text-main-secondary" />
                        <span className={cn("text-sm", selectedState ? "text-main-primary" : "text-gray-400")}>
                          {selectedState ? getStateName(selectedState) : "Select State"}
                        </span>
                      </div>
                      <ChevronDown className={cn("size-4 text-main-secondary transition-transform", stateDropdownOpen && "rotate-180")} />
                    </button>

                    {/* State Dropdown Menu - Mobile */}
                    {stateDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-lg max-h-48 overflow-y-auto z-50">
                        <button
                          onClick={() => handleStateChange("")}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-400"
                        >
                          All States
                        </button>
                        {navigationData.map((stateData) => (
                          <button
                            key={stateData.state}
                            onClick={() => handleStateChange(stateData.state)}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors",
                              selectedState === stateData.state ? "bg-main-secondary/20 text-main-primary font-medium" : "text-main-primary"
                            )}
                          >
                            {getStateName(stateData.state)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* City Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        if (selectedState) {
                          setCityDropdownOpen(!cityDropdownOpen);
                          setStateDropdownOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 rounded-lg border border-gray-200",
                        !selectedState && "cursor-not-allowed opacity-60"
                      )}
                      disabled={!selectedState}
                    >
                      <span className={cn("text-sm", selectedCity ? "text-main-primary" : "text-gray-400")}>
                        {selectedCity || "Select City"}
                      </span>
                      <ChevronDown className={cn("size-4 text-main-secondary transition-transform", cityDropdownOpen && "rotate-180")} />
                    </button>

                    {/* City Dropdown Menu - Mobile */}
                    {cityDropdownOpen && citiesForState.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-lg max-h-48 overflow-y-auto z-50">
                        <button
                          onClick={() => {
                            setSelectedCity("");
                            setCityDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-400"
                        >
                          All Cities
                        </button>
                        {citiesForState.map((cityData) => (
                          <button
                            key={cityData.city}
                            onClick={() => {
                              setSelectedCity(cityData.city);
                              setCityDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors",
                              selectedCity === cityData.city ? "bg-main-secondary/20 text-main-primary font-medium" : "text-main-primary"
                            )}
                          >
                            {cityData.city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button - Full Width */}
                  <button
                    onClick={handleSearch}
                    className="w-full bg-main-secondary text-main-primary px-4 py-3 flex items-center justify-center gap-2 rounded-lg hover:bg-main-secondary/90 transition-colors font-semibold"
                  >
                    <Search className="size-4" />
                    <span className="text-sm font-semibold">Search</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {isDirectVideo && (
        <button
          onClick={toggleVideo}
          className="absolute bottom-6 left-4 md:left-6 lg:left-8 xl:left-10 z-20 flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-white text-sm hover:bg-black/50 transition-colors"
        >
          {isVideoPlaying ? (
            <>
              <Pause className="size-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-4" />
              Play
            </>
          )}
        </button>
      )}
    </section>
  );
}
