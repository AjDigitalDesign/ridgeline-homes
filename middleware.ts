import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getTenantSlugFromHostname,
  TENANT_SLUG_HEADER,
} from "@/lib/tenant-config";

/**
 * Middleware to handle multi-tenant routing.
 *
 * This middleware runs on every request and:
 * 1. Extracts the hostname from the request
 * 2. Looks up the tenant slug for that hostname
 * 3. Adds the tenant slug as a header for downstream use
 */
export function middleware(request: NextRequest) {
  // Get hostname from request
  const hostname = request.headers.get("host") || "localhost";

  // Look up tenant slug for this hostname
  const tenantSlug = getTenantSlugFromHostname(hostname);

  // Clone the request headers and add tenant slug
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(TENANT_SLUG_HEADER, tenantSlug);

  // Return response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also set as response header for client-side access
  response.headers.set(TENANT_SLUG_HEADER, tenantSlug);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
