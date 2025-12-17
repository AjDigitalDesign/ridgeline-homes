import { NextRequest, NextResponse } from "next/server";
import { fetchCommunities, fetchHomes, fetchFloorplans } from "@/lib/api";
import type { Community, Home, Floorplan } from "@/lib/api";

interface SearchResult {
  type: "community" | "home" | "floorplan";
  id: string;
  name: string;
  subtitle: string;
  href: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [communitiesRes, homesRes, floorplansRes] = await Promise.all([
      fetchCommunities().catch(() => ({ data: [] })),
      fetchHomes().catch(() => ({ data: [] })),
      fetchFloorplans().catch(() => ({ data: [] })),
    ]);

    const searchLower = query.toLowerCase();
    const results: SearchResult[] = [];

    // Filter communities
    const communities = (communitiesRes.data || []) as Community[];
    communities
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.city?.toLowerCase().includes(searchLower) ||
          c.state?.toLowerCase().includes(searchLower)
      )
      .slice(0, 3)
      .forEach((c) => {
        const state = c.state?.toLowerCase().replace(/\s+/g, "-") || "";
        const city = c.city?.toLowerCase().replace(/\s+/g, "-") || "";
        results.push({
          type: "community",
          id: c.id,
          name: c.name,
          subtitle: [c.city, c.state].filter(Boolean).join(", "),
          href: `/communities/${state}/${city}/${c.slug}`,
        });
      });

    // Filter homes
    const homes = (homesRes.data || []) as Home[];
    homes
      .filter(
        (h) =>
          h.name?.toLowerCase().includes(searchLower) ||
          h.address?.toLowerCase().includes(searchLower) ||
          h.street?.toLowerCase().includes(searchLower) ||
          h.city?.toLowerCase().includes(searchLower)
      )
      .slice(0, 3)
      .forEach((h) => {
        const community = h.community;
        const state =
          community?.state?.toLowerCase().replace(/\s+/g, "-") ||
          h.state?.toLowerCase().replace(/\s+/g, "-") ||
          "";
        const city =
          community?.city?.toLowerCase().replace(/\s+/g, "-") ||
          h.city?.toLowerCase().replace(/\s+/g, "-") ||
          "";
        const communitySlug = community?.slug || "";
        results.push({
          type: "home",
          id: h.id,
          name: h.street || h.address || h.name,
          subtitle: [h.city, h.state].filter(Boolean).join(", "),
          href: `/homes/${state}/${city}/${communitySlug}/${h.slug}`,
        });
      });

    // Filter floorplans
    const floorplans = (floorplansRes.data || []) as Floorplan[];
    floorplans
      .filter((f) => f.name.toLowerCase().includes(searchLower))
      .slice(0, 3)
      .forEach((f) => {
        results.push({
          type: "floorplan",
          id: f.id,
          name: f.name,
          subtitle: `${f.baseBedrooms} Beds | ${f.baseBathrooms} Baths | ${f.baseSquareFeet?.toLocaleString()} Sq Ft`,
          href: `/plans/${f.slug}`,
        });
      });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
