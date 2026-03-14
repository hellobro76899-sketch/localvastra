import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = getDatabase();
    const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(params.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: string[] = ["updated_at = datetime('now')"];
    const values: any[] = [];

    if (body.name != null) { updates.push("name = ?"); values.push(String(body.name)); }
    if (body.description != null) { updates.push("description = ?"); values.push(String(body.description)); }
    if (body.price != null) { updates.push("price = ?"); values.push(parseFloat(body.price)); }
    if (body.category != null) { updates.push("category = ?"); values.push(String(body.category)); }
    if (body.images != null) { updates.push("images = ?"); values.push(JSON.stringify(Array.isArray(body.images) ? body.images : [])); }
    if (body.inStock != null) { updates.push("in_stock = ?"); values.push(body.inStock ? 1 : 0); }

    values.push(params.id);
    db.prepare(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`).run(...values);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();
    const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(params.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    db.prepare("DELETE FROM products WHERE id = ?").run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
