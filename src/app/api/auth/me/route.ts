import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value;
    if (!sessionId) {
      return NextResponse.json({ user: null });
    }

    const db = getDatabase();
    const session = db.prepare(
      "SELECT s.user_id, s.expires_at, u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ?"
    ).get(sessionId) as any;

    if (!session) {
      return NextResponse.json({ user: null });
    }

    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
      db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
}
