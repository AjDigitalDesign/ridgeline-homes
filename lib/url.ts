import type { Community, Home } from "./api";

/**
 * Converts a string to a URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Map of full state names to abbreviations
 */
const STATE_ABBREVIATIONS: Record<string, string> = {
  alabama: "al",
  alaska: "ak",
  arizona: "az",
  arkansas: "ar",
  california: "ca",
  colorado: "co",
  connecticut: "ct",
  delaware: "de",
  florida: "fl",
  georgia: "ga",
  hawaii: "hi",
  idaho: "id",
  illinois: "il",
  indiana: "in",
  iowa: "ia",
  kansas: "ks",
  kentucky: "ky",
  louisiana: "la",
  maine: "me",
  maryland: "md",
  massachusetts: "ma",
  michigan: "mi",
  minnesota: "mn",
  mississippi: "ms",
  missouri: "mo",
  montana: "mt",
  nebraska: "ne",
  nevada: "nv",
  "new hampshire": "nh",
  "new jersey": "nj",
  "new mexico": "nm",
  "new york": "ny",
  "north carolina": "nc",
  "north dakota": "nd",
  ohio: "oh",
  oklahoma: "ok",
  oregon: "or",
  pennsylvania: "pa",
  "rhode island": "ri",
  "south carolina": "sc",
  "south dakota": "sd",
  tennessee: "tn",
  texas: "tx",
  utah: "ut",
  vermont: "vt",
  virginia: "va",
  washington: "wa",
  "west virginia": "wv",
  wisconsin: "wi",
  wyoming: "wy",
  "district of columbia": "dc",
};

/**
 * Gets the state abbreviation in lowercase for URL
 * Handles both full state names and abbreviations
 */
export function getStateSlug(state: string | null): string {
  if (!state) return "md"; // Default to Maryland
  const normalized = state.toLowerCase().trim();

  // If it's already a 2-letter abbreviation, return it
  if (normalized.length === 2) {
    return normalized;
  }

  // Look up the abbreviation
  return STATE_ABBREVIATIONS[normalized] || normalized.slice(0, 2);
}

/**
 * Gets the city slug for URL
 */
export function getCitySlug(city: string | null): string {
  if (!city) return "unknown";
  return slugify(city);
}

/**
 * Generates the full community URL path
 */
export function getCommunityUrl(community: Community): string {
  const state = getStateSlug(community.state);
  const city = getCitySlug(community.city);
  return `/communities/${state}/${city}/${community.slug}`;
}

/**
 * Generates community URL with query params
 */
export function getCommunityUrlWithParams(
  community: Community,
  params?: Record<string, string>
): string {
  const base = getCommunityUrl(community);
  if (!params || Object.keys(params).length === 0) return base;

  const searchParams = new URLSearchParams(params);
  return `${base}?${searchParams.toString()}`;
}

/**
 * Generates the full home URL path
 * Format: /homes/state/city/community-slug/home-slug
 */
export function getHomeUrl(home: Home): string {
  const state = getStateSlug(home.community?.state || home.state);
  const city = getCitySlug(home.community?.city || home.city);
  const communitySlug = home.community?.slug || "home";
  return `/homes/${state}/${city}/${communitySlug}/${home.slug}`;
}

/**
 * Generates home URL from individual parts (for use in route handlers)
 */
export function buildHomeUrl(
  state: string | null,
  city: string | null,
  communitySlug: string,
  homeSlug: string
): string {
  const stateSlug = getStateSlug(state);
  const citySlug = getCitySlug(city);
  return `/homes/${stateSlug}/${citySlug}/${communitySlug}/${homeSlug}`;
}
