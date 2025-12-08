// Community Types
export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  status: "ACTIVE" | "COMING_SOON" | "SOLD_OUT";
  featuredImage: string | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  properties?: Property[];
  _count?: {
    properties: number;
  };
}

// Property Types
export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: "SINGLE_FAMILY" | "TOWNHOUSE" | "CONDO" | "MULTI_FAMILY";
  status: "AVAILABLE" | "PENDING" | "SOLD" | "OFF_MARKET";
  featuredImage: string | null;
  images: string[];
  features: string[];
  communityId: string | null;
  community?: Community;
  createdAt: string;
  updatedAt: string;
}

// Lead Types
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  propertyId: string | null;
  communityId: string | null;
  createdAt: string;
}

export interface CreateLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  propertyId?: string;
  communityId?: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface PropertyFilters {
  communityId?: string;
  status?: Property["status"];
  propertyType?: Property["propertyType"];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  page?: number;
  limit?: number;
}

export interface CommunityFilters {
  status?: Community["status"];
  page?: number;
  limit?: number;
}
