import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const previewLimit = searchParams.get("previewLimit") || "5";
    const type = searchParams.get("type") || "communities";

    const url = `${API_URL}/api/public/navigation?previewLimit=${previewLimit}&type=${type}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "x-tenant-slug": TENANT_SLUG,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Navigation API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch navigation" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Navigation fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
