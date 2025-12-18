import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "";

// Cache tenant ID to avoid repeated fetches
let cachedTenantId: string | null = null;

async function getTenantId(): Promise<string> {
  if (cachedTenantId) return cachedTenantId;

  try {
    const response = await fetch(`${API_URL}/api/public/tenant`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "x-tenant-slug": TENANT_SLUG,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch tenant:", response.status);
      return "";
    }

    const data = await response.json();
    cachedTenantId = data?.id || "";
    return cachedTenantId;
  } catch (error) {
    console.error("Tenant fetch error:", error);
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantId = await getTenantId();

    // If no tenant ID, silently succeed (don't block the user experience)
    if (!tenantId) {
      console.warn("Analytics: No tenant ID available, skipping tracking");
      return NextResponse.json({ success: true, skipped: true });
    }

    // Forward the tracking data to the external API
    const response = await fetch(`${API_URL}/api/public/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "x-tenant-slug": TENANT_SLUG,
        "x-tenant-id": tenantId,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Log but don't fail - analytics shouldn't break the app
      console.warn("Analytics tracking failed:", response.status, errorText);
      return NextResponse.json({ success: false, status: response.status });
    }

    const data = await response.json().catch(() => ({ success: true }));
    return NextResponse.json(data);
  } catch (error) {
    // Log but don't fail - analytics shouldn't break the app
    console.warn("Analytics tracking error:", error);
    return NextResponse.json({ success: false, error: "Internal error" });
  }
}
