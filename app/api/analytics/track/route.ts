import { NextRequest, NextResponse } from "next/server";
import { fetchTenant } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Cache tenant ID to avoid repeated fetches
let cachedTenantId: string | null = null;

async function getTenantId(): Promise<string> {
  if (cachedTenantId) return cachedTenantId;

  try {
    const response = await fetchTenant();
    cachedTenantId = response.data?.id || "";
    return cachedTenantId;
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantId = await getTenantId();

    if (!tenantId) {
      console.error("Analytics: No tenant ID available");
      return NextResponse.json({ error: "No tenant ID" }, { status: 400 });
    }

    // Forward the tracking data to the external API
    const response = await fetch(`${API_URL}/api/public/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": tenantId,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Analytics tracking failed:", response.status, errorText);
      return NextResponse.json(
        { error: "Tracking failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ success: true }));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
