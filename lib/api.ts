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

// Add request interceptor to include auth token for public api
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
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
  marketingHeadline: string | null;
  showMarketingHeadline: boolean;
  gallery: string[];
  openHouseDate: string | null;
  availableDate: string | null;
  estimatedCompletion: string | null;
  latitude: number | null;
  longitude: number | null;
  community: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    state: string | null;
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
    };
  }>;
  _count: {
    homes: number;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  builderName: string | null;
  builderEmail: string | null;
  builderPhone: string | null;
  builderAddress: string | null;
  builderCity: string | null;
  builderState: string | null;
  builderZip: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  promoBannerEnabled: boolean;
  promoBannerDescription: string | null;
  promoBannerLink: string | null;
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

export const submitInquiry = (data: {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  communityId?: string;
  homeId?: string;
  floorplanId?: string;
}) => api.post("/api/public/inquiries", data);

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

// Fetch front page
export const fetchFrontPage = () =>
  api.get<FrontPage>("/api/public/pages/front-page");

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
