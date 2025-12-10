import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Inquiry request body:", JSON.stringify(body, null, 2));
    console.log("API URL:", `${API_URL}/api/public/inquiries`);

    const response = await fetch(`${API_URL}/api/public/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "x-tenant-slug": TENANT_SLUG,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Inquiry API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to submit inquiry", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
