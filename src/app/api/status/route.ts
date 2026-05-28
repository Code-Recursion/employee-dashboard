import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;

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
