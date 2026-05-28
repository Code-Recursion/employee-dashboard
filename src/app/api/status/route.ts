import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const now = new Date().toISOString();

  try {
    return NextResponse.json(
      {
        status: "ok",
        db: "up",
        timestamp: now,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        db: "down",
        timestamp: now,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
