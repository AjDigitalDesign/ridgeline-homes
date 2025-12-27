/**
 * Tenant configuration for multi-tenant support.
 *
 * Maps hostnames to tenant configurations. When a request comes in, the middleware
 * looks up the hostname to determine which tenant to use.
 *
 * To add a new tenant:
 * 1. Create the tenant in your backend/CMS with its slug and template
 * 2. Add environment variables for the tenant's API key:
 *    - TENANT_API_KEY_<SLUG_UPPERCASE>=your-api-key
 *    Example: TENANT_API_KEY_BOLD_DEMO=abc123
 * 3. Add a mapping entry below: "your-domain.com": "your-tenant-slug"
 * 4. Configure the domain in Vercel (Settings → Domains)
 */

export interface TenantConfig {
  slug: string;
  apiKey: string;
}

export type TenantMapping = {
  [hostname: string]: string;
};

// Map hostnames to tenant slugs
// Add your tenant domains here
export const tenantMappings: TenantMapping = {
  // Development / localhost - uses env variable as fallback
  localhost: process.env.NEXT_PUBLIC_TENANT_SLUG || "",

  // Production demos - add your domains here
  // Example:
  // "modern-demo.ridgelinehomes.com": "modern-demo",
  // "bold-demo.ridgelinehomes.com": "bold-demo",
  // "classic-demo.ridgelinehomes.com": "classic-demo",
  "ridgelinehomes.net": "ridgeline-homes",
  "www.ridgelinehomes.net": "ridgeline-homes",

  // Iconpeak Homes
  "iconpeakhomes.com": "iconpeak-homes",
  "www.iconpeakhomes.com": "iconpeak-homes",

  // You can also use Vercel preview URLs
  // "project-name.vercel.app": "default-tenant",
};

/**
 * Get API key for a tenant slug.
 * Looks up environment variable: TENANT_API_KEY_<SLUG_UPPERCASE>
 * Falls back to NEXT_PUBLIC_API_KEY if not found.
 *
 * Example: For tenant slug "bold-demo", looks for TENANT_API_KEY_BOLD_DEMO
 */
export function getTenantApiKey(tenantSlug: string): string {
  if (!tenantSlug) {
    return process.env.NEXT_PUBLIC_API_KEY || "";
  }

  // Convert slug to uppercase env var format: bold-demo → BOLD_DEMO
  const envVarName = `TENANT_API_KEY_${tenantSlug
    .toUpperCase()
    .replace(/-/g, "_")}`;
  const tenantApiKey = process.env[envVarName];

  if (tenantApiKey) {
    return tenantApiKey;
  }

  // Fallback to default API key
  return process.env.NEXT_PUBLIC_API_KEY || "";
}

/**
 * Get tenant slug from hostname.
 * Falls back to NEXT_PUBLIC_TENANT_SLUG env variable if no mapping found.
 */
export function getTenantSlugFromHostname(hostname: string): string {
  // Remove port number if present (e.g., localhost:3000 → localhost)
  const cleanHostname = hostname.split(":")[0];

  // Check for exact match first
  if (tenantMappings[cleanHostname]) {
    return tenantMappings[cleanHostname];
  }

  // Check for subdomain pattern matches
  // e.g., if "*.ridgelinehomes.com" pattern is needed
  for (const [pattern, slug] of Object.entries(tenantMappings)) {
    if (pattern.startsWith("*.")) {
      const domain = pattern.slice(2);
      if (cleanHostname.endsWith(domain)) {
        // Extract subdomain as tenant slug if slug is empty
        // e.g., "bold-demo.ridgelinehomes.com" → "bold-demo"
        if (!slug) {
          const subdomain = cleanHostname.replace(`.${domain}`, "");
          return subdomain;
        }
        return slug;
      }
    }
  }

  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_TENANT_SLUG || "";
}

// Header name used to pass tenant slug from middleware to API
export const TENANT_SLUG_HEADER = "x-tenant-slug";

/**
 * Get tenant slug for server-side requests.
 * Must be called within a server component or API route.
 * Import next/headers dynamically to avoid client-side issues.
 */
export async function getServerTenantSlug(): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();

  // First check if middleware set the header
  const tenantFromHeader = headersList.get(TENANT_SLUG_HEADER);
  if (tenantFromHeader) {
    return tenantFromHeader;
  }

  // Fallback: get from host header
  const host = headersList.get("host");
  if (host) {
    return getTenantSlugFromHostname(host);
  }

  // Final fallback: environment variable
  return process.env.NEXT_PUBLIC_TENANT_SLUG || "";
}
