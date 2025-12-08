import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Proxy all auth requests to the backend API
// This helps bypass CORS during local development
async function handler(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const targetUrl = `${API_URL}${path}${url.search}`;

  // Build headers for the backend request
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Forward cookies
  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["Cookie"] = cookies;
  }

  try {
    let body: string | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    // Get response data
    const contentType = response.headers.get("content-type") || "";
    let data: string | ArrayBuffer;

    if (contentType.includes("application/json")) {
      data = await response.text();
    } else {
      data = await response.arrayBuffer();
    }

    // Build response headers
    const responseHeaders = new Headers();

    // Copy relevant headers from backend response
    const headersToForward = ["content-type", "set-cookie", "location"];
    headersToForward.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // Set CORS headers
    const origin = request.headers.get("origin");
    if (origin) {
      responseHeaders.set("Access-Control-Allow-Origin", origin);
      responseHeaders.set("Access-Control-Allow-Credentials", "true");
    }

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy auth request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
