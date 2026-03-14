import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = getDatabase();
    const existing = db.prepare("SELECT id FROM shops WHERE id = ?").get(params.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: string[] = ["updated_at = datetime('now')"];
    const values: any[] = [];

    if (body.name != null) { updates.push("name = ?"); values.push(String(body.name)); }
    if (body.description != null) { updates.push("description = ?"); values.push(String(body.description)); }
    if (body.address != null) { updates.push("address = ?"); values.push(String(body.address)); }
    if (body.phone != null) { updates.push("phone = ?"); values.push(String(body.phone)); }
    if (body.location?.lat != null && body.location?.lng != null) {
      updates.push("lat = ?", "lng = ?");
      values.push(body.location.lat, body.location.lng);
    }

    values.push(params.id);
    db.prepare(`UPDATE shops SET ${updates.join(", ")} WHERE id = ?`).run(...values);
    return NextResponse.json({ id: params.id });
  } catch (error) {
    console.error("Update shop error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
