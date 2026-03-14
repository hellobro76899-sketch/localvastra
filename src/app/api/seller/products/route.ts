import { NextRequest, NextResponse } from "next/server";
import { getDatabase, generateId } from "@/lib/db";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDatabase();
    const products = db.prepare("SELECT * FROM products WHERE seller_id = ?").all(uid) as any[];
    return NextResponse.json(
      products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: JSON.parse(p.images || "[]"),
        inStock: !!p.in_stock,
      }))
    );
  } catch (error) {
    console.error("Seller products error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sellerId, shopId, name, description, price, category, images, inStock } = body;
    if (!sellerId || !shopId || !name || price == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const db = getDatabase();
    const id = generateId();
    db.prepare(
      "INSERT INTO products (id, seller_id, shop_id, name, description, price, category, images, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      id,
      sellerId,
      shopId,
      String(name),
      String(description || ""),
      parseFloat(price),
      String(category || "general"),
      JSON.stringify(Array.isArray(images) ? images : []),
      inStock ? 1 : 0
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
