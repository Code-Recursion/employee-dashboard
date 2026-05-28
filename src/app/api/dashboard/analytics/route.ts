import { NextResponse } from "next/server";
import { DashboardAnalyticsService } from "@/services/dashboard-analytics.service";

export async function GET() {
  try {
    const analytics = await DashboardAnalyticsService.getAnalytics();
    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard analytics.",
      },
      { status: 500 },
    );
  }
}
