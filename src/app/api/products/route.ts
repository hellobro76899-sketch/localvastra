import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDatabase } from "@/lib/db";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "10");
    const maxResults = parseInt(searchParams.get("limit") || "50");

    const db = getDatabase();

    const allProducts = db.prepare("SELECT * FROM products WHERE in_stock = 1 LIMIT ?").all(maxResults * 2) as any[];
    const allShops = db.prepare("SELECT * FROM shops").all() as any[];
    const shopsMap = new Map(allShops.map((s: any) => [s.id, s]));

    let products = allProducts.map((p: any) => {
      const shop = shopsMap.get(p.shop_id);
      return {
        id: p.id,
        sellerId: p.seller_id,
        shopId: p.shop_id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: JSON.parse(p.images || "[]"),
        inStock: !!p.in_stock,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        shop: shop
          ? {
              id: shop.id,
              name: shop.name,
              description: shop.description,
              address: shop.address,
              phone: shop.phone,
              location: shop.lat != null && shop.lng != null ? { lat: shop.lat, lng: shop.lng } : null,
            }
          : null,
      };
    });

    if (category) {
      products = products.filter((p: any) => String(p.category || "").toLowerCase() === category.toLowerCase());
    }
    if (minPrice > 0 || maxPrice < 1000000) {
      products = products.filter((p: any) => p.price >= minPrice && p.price <= maxPrice);
    }
    if (q) {
      products = products.filter(
        (p: any) =>
          (p.name && String(p.name).toLowerCase().includes(q)) ||
          (p.description && String(p.description).toLowerCase().includes(q)) ||
          (p.shop?.name && String(p.shop.name).toLowerCase().includes(q))
      );
    }

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      products = products
        .filter((p: any) => p.shop?.location?.lat && p.shop?.location?.lng)
        .map((p: any) => ({
          ...p,
          distance: calculateDistance(userLat, userLng, p.shop.location.lat, p.shop.location.lng),
        }))
        .filter((p: any) => p.distance <= radius)
        .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
    }
    products = products.slice(0, maxResults);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
