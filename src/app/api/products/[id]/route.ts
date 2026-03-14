import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(params.id) as any;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data: any = {
      id: product.id,
      sellerId: product.seller_id,
      shopId: product.shop_id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: JSON.parse(product.images || "[]"),
      inStock: !!product.in_stock,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    if (product.shop_id) {
      const shop = db.prepare("SELECT * FROM shops WHERE id = ?").get(product.shop_id) as any;
      if (shop) {
        data.shop = {
          id: shop.id,
          name: shop.name,
          description: shop.description,
          address: shop.address,
          phone: shop.phone,
          location: shop.lat != null && shop.lng != null ? { lat: shop.lat, lng: shop.lng } : null,
        };
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
