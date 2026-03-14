import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDatabase } from "@/lib/db";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "10");
    const maxResults = parseInt(searchParams.get("limit") || "50");

    const db = getDatabase();
    const allShops = db.prepare("SELECT * FROM shops LIMIT ?").all(maxResults) as any[];

    let shops = allShops.map((s: any) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      address: s.address,
      phone: s.phone,
      location: s.lat != null && s.lng != null ? { lat: s.lat, lng: s.lng } : null,
      sellerId: s.seller_id,
    }));

    if (q) {
      shops = shops.filter(
        (s: any) =>
          (s.name && String(s.name).toLowerCase().includes(q)) ||
          (s.description && String(s.description).toLowerCase().includes(q))
      );
    }

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      shops = shops
        .filter((s: any) => s.location?.lat && s.location?.lng)
        .map((s: any) => ({
          ...s,
          distance: calculateDistance(userLat, userLng, s.location.lat, s.location.lng),
        }))
        .filter((s: any) => s.distance <= radius)
        .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
    }

    return NextResponse.json(shops);
  } catch (error) {
    console.error("Shops API error:", error);
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
  }
}
