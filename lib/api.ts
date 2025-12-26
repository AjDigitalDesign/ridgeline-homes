import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "";

// Public API client (with tenant slug header for public endpoints)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    "x-tenant-slug": TENANT_SLUG,
    "Cache-Control": "no-cache",
  },
});

// Authenticated API client (without x-tenant-slug to avoid CORS issues)
// The auth token already identifies the user's tenant
export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token and cache-busting for public api
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    // Add cache-busting timestamp to prevent browser caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  return config;
});

// Add request interceptor to include auth token for auth api
authApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Session expired, clear auth data
      localStorage.removeItem("auth_session");
      localStorage.removeItem("session_token");
      window.dispatchEvent(new Event("auth-change"));
    }
    return Promise.reject(error);
  }
);

// Add same response interceptor to authApi
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Session expired, clear auth data
      localStorage.removeItem("auth_session");
      localStorage.removeItem("session_token");
      window.dispatchEvent(new Event("auth-change"));
    }
    return Promise.reject(error);
  }
);

// Types
export interface Community {
  id: string;
  name: string;
  slug: string;
  marketingHeadline: string | null;
  showMarketingHeadline: boolean;
  headline: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  salesOfficeHours: any;
  gallery: string[];
  videoUrl: string | null;
  interactiveSiteMap: string | null;
  communityMap: string | null;
  schoolDistrict: string | null;
  elementarySchool: string | null;
  middleSchool: string | null;
  highSchool: string | null;
  amenities: string[];
  status: string;
  priceMin: number | null;
  priceMax: number | null;
  sqftMin: number | null;
  sqftMax: number | null;
  bedsMin: number | null;
  bedsMax: number | null;
  bathsMin: number | null;
  bathsMax: number | null;
  garagesMin: number | null;
  garagesMax: number | null;
  directions: string | null;
  nearbyPlaceCategories: string[] | null;
  nearbyPlacesEnabled: boolean | null;
  nearbyPlacesRadius: number | null;
  marketArea: {
    id: string;
    name: string;
    slug: string;
    state: string | null;
    city: string | null;
  } | null;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string[];
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
  salesTeams: Array<{
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
  }>;
  homes?: Array<{
    id: string;
    name: string;
    slug: string;
    lotNumber: string | null;
    price: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    squareFeet: number | null;
    garages?: number | null;
    stories?: number | null;
    status: string;
    gallery: string[];
    openHouseDate: string | null;
    city?: string | null;
    state?: string | null;
    street?: string | null;
    address?: string | null;
    zipCode?: string | null;
    marketingHeadline?: string | null;
    showMarketingHeadline?: boolean;
    community?: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
      state: string | null;
    } | null;
    floorplan?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  }>;
  _count: {
    homes: number;
  };
}

export interface Home {
  id: string;
  name: string;
  slug: string;
  lotNumber: string | null;
  address: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  stories: number | null;
  garages: number | null;
  status: string;
  description: string | null;
  marketingHeadline: string | null;
  showMarketingHeadline: boolean;
  gallery: string[];
  floorPlanGallery: string[];
  interactiveFloorPlanUrl: string | null;
  virtualTourUrl: string | null;
  videoUrl: string | null;
  features: string[];
  schoolDistrict: string | null;
  elementarySchool: string | null;
  middleSchool: string | null;
  highSchool: string | null;
  openHouseDate: string | null;
  availableDate: string | null;
  estimatedCompletion: string | null;
  latitude: number | null;
  longitude: number | null;
  salesTeams: Array<{
    id: string;
    homeId: string;
    salesTeamId: string;
    isPrimary: boolean;
    displayOrder: number;
    salesTeam: {
      id: string;
      name: string;
      title: string | null;
      email: string | null;
      phone: string | null;
      photo: string | null;
      profile: string | null;
    };
  }>;
  community: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    state: string | null;
    address: string | null;
    zipCode: string | null;
    phoneNumber: string | null;
  } | null;
  floorplan: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Floorplan {
  id: string;
  name: string;
  slug: string;
  modelNumber: string | null;
  planTypes: string[];
  baseBedrooms: number | null;
  baseBathrooms: number | null;
  baseSquareFeet: number | null;
  baseStories: number | null;
  baseGarages: number | null;
  basePrice: number | null;
  marketingHeadline: string | null;
  showMarketingHeadline: boolean;
  headline: string | null;
  description: string | null;
  features: string[];
  gallery: string[];
  elevationGallery: string[];
  plansImages: string[];
  virtualTourUrl: string | null;
  videoUrl: string | null;
  brochureUrl: string | null;
  interactivePlanUrl: string | null;
  communityFloorplans: Array<{
    price: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    squareFeet: number | null;
    community: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
      state: string | null;
    };
  }>;
  homes: Array<{
    id: string;
    name: string;
    slug: string;
    price: number | null;
    status: string;
    gallery: string[];
    city: string | null;
    state: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    squareFeet: number | null;
    garages: number | null;
    marketingHeadline: string | null;
    showMarketingHeadline: boolean;
    community: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
      state: string | null;
    } | null;
  }>;
  salesTeams: Array<{
    id: string;
    floorplanId: string;
    salesTeamId: string;
    isPrimary: boolean;
    displayOrder: number;
    salesTeam: {
      id: string;
      name: string;
      title: string | null;
      email: string | null;
      phone: string | null;
      photo: string | null;
      profile: string | null;
    };
  }>;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
  _count?: {
    homes: number;
  };
}

// Theme colors from themePublished
export interface TenantThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

// Theme fonts from themePublished
export interface TenantThemeFonts {
  heading: string;
  body: string;
}

// Published theme configuration
export interface TenantThemePublished {
  colors: TenantThemeColors;
  fonts: TenantThemeFonts;
  borderRadius: "none" | "small" | "medium" | "large";
}

// Section configuration item
export interface TenantSectionConfig {
  type: string;
  enabled: boolean;
  order: number;
}

// Published section configuration
export interface TenantSectionConfigPublished {
  sections: TenantSectionConfig[];
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  subdomain: string | null;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  builderName: string | null;
  builderEmail: string | null;
  builderPhone: string | null;
  builderAddress: string | null;
  builderCity: string | null;
  builderCounty: string | null;
  builderState: string | null;
  builderZip: string | null;
  builderLatitude: number | null;
  builderLongitude: number | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  promoBannerEnabled: boolean;
  promoBannerDescription: string | null;
  promoBannerLink: string | null;
  flyoutBanners: unknown | null;
  leadCaptureEnabled: boolean;
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  thirdPartyScripts: unknown | null;
  hubspotEnabled: boolean;
  lassoEnabled: boolean;
  // Homepage Template
  homepageTemplate: "MODERN" | "BOLD";
  // Theme/Branding (colors, fonts)
  themePublished: TenantThemePublished | null;
  // Section configuration
  sectionConfigPublished: TenantSectionConfigPublished | null;
}

// API Functions
export const fetchTenant = () => api.get<Tenant>("/api/public/tenant");

export const fetchCommunities = (params?: {
  status?: string;
  marketAreaId?: string;
  limit?: number;
}) => api.get<Community[]>("/api/public/communities", { params });

export const fetchCommunity = (slug: string) =>
  api.get<Community>(`/api/public/communities/${slug}`);

export const fetchHomes = (params?: {
  status?: string;
  communityId?: string;
  communitySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  limit?: number;
  featured?: boolean;
}) => api.get<Home[]>("/api/public/homes", { params });

export const fetchHome = (slug: string) =>
  api.get<Home>(`/api/public/homes/${slug}`);

export const fetchFloorplans = (params?: {
  communityId?: string;
  communitySlug?: string;
  minBedrooms?: number;
  maxPrice?: number;
  planType?: string;
  limit?: number;
}) => api.get<Floorplan[]>("/api/public/floorplans", { params });

export const fetchFloorplan = (slug: string) =>
  api.get<Floorplan>(`/api/public/floorplans/${slug}`);

export const submitInquiry = async (data: {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  communityId?: string;
  homeId?: string;
  floorplanId?: string;
}) => {
  // Transform to backend expected format
  // Backend requires: name, email (required), phone, message, homeId, communityId, floorplanId (optional)
  const payload = {
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    phone: data.phone || undefined,
    message: data.message || undefined,
    communityId: data.communityId || undefined,
    homeId: data.homeId || undefined,
    floorplanId: data.floorplanId || undefined,
  };

  // Use local API proxy to avoid CORS issues
  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit inquiry");
  }

  return response.json();
};

// Banner Slide type
export interface BannerSlide {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  buttonLink: string;
  buttonText: string;
  description: string;
}

// Front Page type
export interface FrontPage {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  content: string | null;
  pageType: "FRONT_PAGE";
  bannerSlides: BannerSlide[];
  showFeaturedCommunities: boolean;
  featuredCommunitiesTitle: string;
  featuredCommunityIds: string[];
  showFeaturedHomes: boolean;
  featuredHomesTitle: string;
  featuredHomeIds: string[];
  showAboutSection: boolean;
  aboutTitle: string;
  aboutDescription: string | null;
  aboutButtonText: string;
  aboutButtonLink: string | null;
  aboutImages: string[];
  aboutAgentImage: string | null;
  aboutAgentName: string | null;
  aboutAgentTitle: string | null;
  aboutTagline: string | null;
  aboutServices: string[];
  showTestimonials: boolean;
  testimonialsTitle: string;
  testimonials: Array<{
    id: string;
    name: string;
    title?: string;
    content: string;
    image?: string;
  }>;
  ctaBannerTitle: string | null;
  ctaBannerText: string | null;
  ctaBannerButtonText: string | null;
  ctaBannerButtonLink: string | null;
  ctaBannerImage: string | null;
  publishStatus: "DRAFT" | "PUBLISHED";
  active: boolean;
  createdAt: string;
  updatedAt: string;
  seo: {
    id: string;
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
    canonicalUrl: string | null;
    index: boolean;
    follow: boolean;
  } | null;
  featuredCommunities: Community[];
  featuredHomes: Home[];
}

// Fetch front page (legacy BOLD template)
export const fetchFrontPage = () =>
  api.get<FrontPage>("/api/public/pages/front-page");

// Home Page type for MODERN template
export interface HomePageTemplateConfig {
  templateType: "MODERN" | "BOLD";
  theme: TenantThemePublished | null;
}

export interface HomePage {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  content: string | null;
  pageType: "FRONT_PAGE";
  bannerSlides: BannerSlide[];
  // Template configuration
  templateConfig: HomePageTemplateConfig;
  // Hero Video section (BOLD template)
  heroVideoUrl: string | null;
  heroVideoTitle: string | null;
  heroVideoSubtitle: string | null;
  heroVideoButtonText: string | null;
  heroVideoButtonLink: string | null;
  heroVideoPosterImage: string | null;
  heroBackgroundImage: string | null;
  heroShowSearch: boolean;
  // Featured data (isTenantFeatured)
  featuredCommunities: Community[];
  featuredHomes: Home[];
  showFeatured: boolean;
  featuredTitle: string | null;
  // Where to live market areas
  whereToLiveMarketAreas: MarketArea[];
  showWhereToLive: boolean;
  whereToLiveTitle: string | null;
  whereToLiveDescription: string | null;
  // Modern About section
  showModernAbout: boolean;
  modernAboutTitle: string | null;
  modernAboutContent: string | null;
  modernAboutLinkTitle: string | null;
  modernAboutLinkUrl: string | null;
  modernAboutImage: string | null;
  // About section (legacy)
  showAboutSection: boolean;
  aboutTitle: string;
  aboutDescription: string | null;
  aboutButtonText: string;
  aboutButtonLink: string | null;
  aboutImages: string[];
  aboutAgentImage: string | null;
  aboutAgentName: string | null;
  aboutAgentTitle: string | null;
  aboutTagline: string | null;
  aboutServices: string[];
  // Block Content section (Design Center)
  showBlockContent: boolean;
  blockContentImage: string | null;
  blockContentTitle: string | null;
  blockContentDescription: string | null;
  blockContentLinkTitle: string | null;
  blockContentLinkUrl: string | null;
  // Flex Content section (Smart Home / Future Proof)
  showFlexContent: boolean;
  flexContentTitle: string | null;
  flexContentDescription: string | null;
  flexContentLinkTitle: string | null;
  flexContentLinkUrl: string | null;
  flexContentImage: string | null;
  // Testimonials
  showTestimonials: boolean;
  testimonialsTitle: string;
  testimonials: Array<{
    id: string;
    name: string;
    rating: number;
    companyName?: string;
    description: string;
  }>;
  testimonialImage1: string | null;
  testimonialImage2: string | null;
  // CTA Banner
  ctaBannerTitle: string | null;
  ctaBannerText: string | null;
  ctaBannerButtonText: string | null;
  ctaBannerButtonLink: string | null;
  ctaBannerImage: string | null;
  // SEO
  seo: {
    id: string;
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch home page (MODERN template)
export const fetchHomePage = () =>
  api.get<HomePage>("/api/public/pages/home");

// Market Area type
export interface MarketArea {
  id: string;
  name: string;
  slug: string;
  state: string | null;
  city: string | null;
  featureImage: string | null;
  description: string | null;
  image: string | null;
  _count?: {
    communities: number;
  };
}

// Fetch market areas
export const fetchMarketAreas = () =>
  api.get<MarketArea[]>("/api/public/market-areas");

// Fetch navigation data for "Find Your Home" dropdown
// Uses local API proxy to avoid CORS issues
export const fetchNavigation = async (params?: { previewLimit?: number; type?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.previewLimit) searchParams.set("previewLimit", String(params.previewLimit));
  if (params?.type) searchParams.set("type", params.type);

  const url = `/api/navigation${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const response = await fetch(url);
  const data = await response.json();
  return { data };
};

// Favorite types
export type FavoriteType = "home" | "community" | "floorplan";

export interface Favorite {
  id: string;
  userId: string;
  type: FavoriteType;
  homeId: string | null;
  communityId: string | null;
  floorplanId: string | null;
  createdAt: string;
  home?: Home | null;
  community?: Community | null;
  floorplan?: Floorplan | null;
}

export interface CreateFavoriteData {
  type: FavoriteType;
  homeId?: string;
  communityId?: string;
  floorplanId?: string;
}

// Navigation types for "Find Your Home" dropdown
export interface NavigationCity {
  city: string;
  count: number;
}

export interface NavigationCounty {
  county: string;
  count: number;
}

export interface NavigationState {
  state: string;
  totalCommunities: number;
  previewCities: NavigationCity[];
  hasMoreCities: boolean;
  counties: NavigationCounty[];
}

export interface NavigationData {
  communities: NavigationState[];
}

// Local API client for proxied requests (avoids CORS issues)
// Routes through Next.js API routes which then call the backend
const localApi = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token for local api
localApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
  }
  return config;
});

// Add response interceptor to handle 401 errors
localApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Session expired, clear auth data
      localStorage.removeItem("auth_session");
      localStorage.removeItem("session_token");
      window.dispatchEvent(new Event("auth-change"));
    }
    return Promise.reject(error);
  }
);

// Favorites API functions (proxied through Next.js API routes to avoid CORS)
export const fetchFavorites = (type?: FavoriteType) =>
  localApi.get<Favorite[]>("/api/favorites", {
    params: type ? { type } : undefined,
  });

export const addFavorite = (data: CreateFavoriteData) =>
  localApi.post<Favorite>("/api/favorites", data);

export const removeFavorite = (id: string) =>
  localApi.delete(`/api/favorites?id=${id}`);

export const removeFavoriteByItem = (type: FavoriteType, itemId: string) => {
  const params = new URLSearchParams({ type });
  if (type === "home") params.append("homeId", itemId);
  else if (type === "community") params.append("communityId", itemId);
  else if (type === "floorplan") params.append("floorplanId", itemId);
  return localApi.delete(`/api/favorites?${params.toString()}`);
};

// Listing Settings types
export interface ListingSettingsSeo {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  index: boolean;
  follow: boolean;
  jsonLd: string;
}

export interface ListingSettings {
  bannerTitle: string;
  bannerImage: string;
  footerContent: string;
  footerImage: string;
  seo: ListingSettingsSeo;
}

// Fetch listing settings for search pages (communities, homes, floorplans)
export const fetchListingSettings = (type: "communities" | "homes" | "floorplans") =>
  api.get<ListingSettings>(`/api/public/listing-settings/${type}`);

// Gallery types
export interface GalleryTag {
  id: string;
  name: string;
  slug: string;
  imageCount: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  displayOrder: number;
  tag: GalleryTag | null;
}

export interface GalleryResponse {
  images: GalleryImage[];
  tags: GalleryTag[];
}

export interface GalleryPage {
  id: string;
  name: string;
  slug: string;
  content: string | null;
  pageType: "GALLERY";
  galleryBannerImage: string | null;
  galleryBannerTitle: string | null;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch gallery page
export const fetchGalleryPage = () =>
  api.get<GalleryPage[]>("/api/public/pages", { params: { pageType: "GALLERY" } });

// Fetch gallery images with optional tag filter
export const fetchGalleryImages = (tag?: string) =>
  api.get<GalleryResponse>("/api/public/gallery", { params: tag ? { tag } : undefined });

// Our Process page types
export interface ProcessStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  mediaType: "image" | "video";
  mediaUrl: string;
}

export interface OurProcessPage {
  id: string;
  name: string;
  slug: string;
  content: string | null;
  pageType: "OUR_PROCESS";
  processBannerImage: string | null;
  processBannerTitle: string | null;
  processIntroTitle: string | null;
  processIntroDescription: string | null;
  processIntroContent: string | null;
  processIntroCta: string | null;
  processIntroCtaLink: string | null;
  processIntroMediaType: "image" | "video" | null;
  processIntroMediaUrl: string | null;
  processStepsTitle: string | null;
  processSteps: ProcessStep[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch Our Process page
export const fetchOurProcessPage = () =>
  api.get<OurProcessPage>("/api/public/pages/our-process");

// Videos page types
export interface VideoItem {
  id: string;
  url: string;
  title: string;
  pageUrl: string;
  displayOrder: number;
}

export interface VideosPage {
  id: string;
  name: string;
  slug: string;
  pageType: "VIDEO";
  videoBannerImage: string | null;
  videoBannerTitle: string | null;
  videoItems: VideoItem[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch Videos page
export const fetchVideosPage = () =>
  api.get<VideosPage>("/api/public/pages/videos");

// Virtual Tours page types
export interface VirtualTourItem {
  id: string;
  url: string;
  title: string;
  pageUrl: string;
  displayOrder: number;
}

export interface VirtualToursPage {
  id: string;
  name: string;
  slug: string;
  pageType: "VIRTUAL_TOUR";
  virtualTourBannerImage: string | null;
  virtualTourBannerTitle: string | null;
  virtualTourItems: VirtualTourItem[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch Virtual Tours page
export const fetchVirtualToursPage = () =>
  api.get<VirtualToursPage>("/api/public/pages/virtual-tours");

// Blog types
export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featureImage: string | null;
  publishDate: string | null;
  createdAt: string;
  categories: BlogCategory[];
  tags: BlogTag[];
  seo?: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogPage {
  id: string;
  name: string;
  slug: string;
  pageType: "BLOG";
  blogBannerImage: string | null;
  blogBannerTitle: string | null;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch blog posts with pagination
export const fetchBlogPosts = (params?: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.categorySlug) searchParams.set("category", params.categorySlug);
  if (params?.tagSlug) searchParams.set("tag", params.tagSlug);
  const query = searchParams.toString();
  return api.get<BlogPostsResponse>(`/api/public/blog/posts${query ? `?${query}` : ""}`);
};

// Fetch single blog post by slug
export const fetchBlogPost = (slug: string) =>
  api.get<BlogPost>(`/api/public/blog/posts/${slug}`);

// Fetch blog categories
export const fetchBlogCategories = () =>
  api.get<BlogCategory[]>("/api/public/blog/categories");

// Fetch blog tags
export const fetchBlogTags = () =>
  api.get<BlogTag[]>("/api/public/blog/tags");

// Fetch blog page settings
export const fetchBlogPage = () =>
  api.get<BlogPage>("/api/public/pages/blog");

// =============================================================================
// Build On Your Lot (BOYL) Types and API Functions
// =============================================================================

// BOYL Floorplan (embedded in location)
export interface BOYLFloorplan {
  floorplanId: string;
  name: string;
  slug: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  gallery: string[];
  elevationGallery: string[];
  plansImages: string[];
  description: string;
  features: string[];
  virtualTourUrl: string | null;
  videoUrl: string | null;
}

// BOYL Location from API
export interface BOYLLocation {
  id: string;
  name: string;
  slug: string;
  state: string;
  county: string;
  city: string;
  latitude: number;
  longitude: number;
  radiusMiles: number;
  polygon: { coordinates: [number, number][] } | null;
  description: string | null;
  featuredImage: string;
  floorplans: BOYLFloorplan[];
  floorplanCount: number;
  boylCount: number;
}

// Lot Process Page content
export interface LotProcessStep {
  id: string;
  title: string;
  shortTitle?: string;
  content: string;
  icon: string | null;
  order: number;
  mediaType?: "image" | "video" | null;
  mediaUrl?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
}

export interface LotProcessPage {
  id: string;
  name: string;
  slug: string;
  pageType: "LOT_PROCESS";
  lotProcessBannerImage: string | null;
  lotProcessBannerTitle: string | null;
  lotProcessIntroTitle: string | null;
  lotProcessIntroDescription: string | null;
  lotProcessIntroContent: string | null;
  lotProcessIntroCta: string | null;
  lotProcessIntroCtaLink: string | null;
  lotProcessIntroMediaType: "image" | "video" | null;
  lotProcessIntroMediaUrl: string | null;
  lotProcessStepsTitle: string | null;
  lotProcessSteps: LotProcessStep[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Navigation types for BOYL dropdown
export interface BOYLNavCounty {
  county: string;
  slug: string;
  city: string;
}

export interface BOYLNavState {
  state: string;
  counties: BOYLNavCounty[];
}

// Fetch all BOYL locations (uses local API route for client-side)
export const fetchBOYLLocations = async () => {
  const response = await fetch("/api/boyl-locations");
  const data = await response.json();
  return { data: data as BOYLLocation[] };
};

// Fetch all BOYL locations (server-side version using direct API)
export const fetchBOYLLocationsServer = () =>
  api.get<BOYLLocation[]>("/api/public/boyl-locations");

// Fetch single BOYL location by slug
export const fetchBOYLLocation = (slug: string) =>
  api.get<BOYLLocation>(`/api/public/boyl-locations/${slug}`);

// Fetch Lot Process page content
export const fetchLotProcessPage = () =>
  api.get<LotProcessPage>("/api/public/pages/lot-process");

// =============================================================================
// Featured Content (Homepage)
// =============================================================================

export interface FeaturedData {
  communities: Community[];
  homes: Home[];
}

// Fetch featured communities and homes for homepage
export const fetchFeatured = () =>
  api.get<FeaturedData>("/api/public/featured");

// =============================================================================
// About Page
// =============================================================================

export interface AboutPageWhoWeAreStep {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "video" | null;
  mediaUrl: string | null;
}

export interface AboutPage {
  id: string;
  name: string;
  slug: string;
  pageType: "ABOUT";
  aboutPageBannerImage: string | null;
  aboutPageBannerTitle: string | null;
  aboutPageIntroTitle: string | null;
  aboutPageIntroDescription: string | null;
  aboutPageIntroContent: string | null;
  aboutPageIntroCta: string | null;
  aboutPageIntroCtaLink: string | null;
  aboutPageIntroMediaType: "image" | "video" | null;
  aboutPageIntroMediaUrl: string | null;
  aboutPageWhoWeAreTitle: string | null;
  aboutPageWhoWeAreSteps: AboutPageWhoWeAreStep[] | null;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } | null;
}

// Fetch About page
export const fetchAboutPage = () =>
  api.get<AboutPage>("/api/public/pages/about");
