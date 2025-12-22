import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    // If slug provided, fetch single location
    const endpoint = slug
      ? `${API_URL}/api/public/boyl-locations/${slug}`
      : `${API_URL}/api/public/boyl-locations`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "x-tenant-slug": TENANT_SLUG,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BOYL Locations API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch BOYL locations" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("BOYL Locations fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
