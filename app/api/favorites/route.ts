import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ridgeline-homes.forgehome.io";

// Proxy GET request to fetch favorites
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json([], { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const url = new URL(`${API_URL}/api/public/favorites`);
  if (type) {
    url.searchParams.set("type", type);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    if (!response.ok) {
      // Return empty array on error to prevent client-side crashes
      console.error("Failed to fetch favorites:", response.status, response.statusText);
      return NextResponse.json([], { status: 200 });
    }

    const data = await response.json();

    // Ensure we return an array - the backend might wrap it in an object
    const favorites = Array.isArray(data) ? data : (data.favorites || data.data || []);

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    // Return empty array on error to prevent client-side crashes
    return NextResponse.json([], { status: 200 });
  }
}

// Proxy POST request to add favorite
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Please sign in to add favorites" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/public/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    });

    // Handle 409 Conflict (already favorited) - return success with the existing data
    if (response.status === 409) {
      const data = await response.json().catch(() => ({ message: "Already favorited" }));
      return NextResponse.json(data, { status: 200 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add favorite:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to add favorite" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

// Proxy DELETE request to remove favorite
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Please sign in to remove favorites" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  // Build the query string for the backend
  const backendUrl = new URL(`${API_URL}/api/public/favorites`);
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(backendUrl.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    // Handle empty response (204 No Content)
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to remove favorite:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
