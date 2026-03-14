import { NextRequest, NextResponse } from "next/server";
import { getDatabase, generateId } from "@/lib/db";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDatabase();
    const shop = db.prepare("SELECT * FROM shops WHERE seller_id = ? LIMIT 1").get(uid) as any;
    if (!shop) return NextResponse.json(null);
    return NextResponse.json({
      id: shop.id,
      sellerId: shop.seller_id,
      name: shop.name,
      description: shop.description,
      address: shop.address,
      phone: shop.phone,
      location: shop.lat != null && shop.lng != null ? { lat: shop.lat, lng: shop.lng } : null,
    });
  } catch (error) {
    console.error("Seller shop error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sellerId, name, description, address, phone, location } = body;
    if (!sellerId || !name) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const db = getDatabase();
    const id = generateId();
    const lat = location && typeof location.lat === "number" ? location.lat : null;
    const lng = location && typeof location.lng === "number" ? location.lng : null;

    db.prepare(
      "INSERT INTO shops (id, seller_id, name, description, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(id, sellerId, String(name), String(description || ""), String(address || ""), String(phone || ""), lat, lng);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create shop error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
