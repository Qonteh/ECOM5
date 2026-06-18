// Developer Dashboard API - Platform Statistics
import { NextRequest, NextResponse } from "next/server";
import {
  AnalyticsRepository,
  RevenueRepository,
  OrderRepository,
} from "@/lib/repositories";

// GET - Get platform statistics for developer dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period =
      (searchParams.get("period") as "day" | "week" | "month" | "year") ||
      "month";

    // Fetch all stats in parallel
    const [
      platformStats,
      revenueSummary,
      growthMetrics,
      orderStats,
      topSellers,
      recentRevenue,
    ] = await Promise.all([
      AnalyticsRepository.getPlatformStats(),
      RevenueRepository.getSummary(period),
      AnalyticsRepository.getGrowthMetrics(
        period === "year" ? "month" : period,
      ),
      OrderRepository.getStats(period),
      AnalyticsRepository.getTopSellers(10),
      RevenueRepository.getRecent(10),
    ]);

    return NextResponse.json({
      platform: platformStats,
      revenue: {
        total: revenueSummary.total,
        growth: revenueSummary.growth,
        breakdown: revenueSummary.byType,
      },
      growth: growthMetrics,
      orders: orderStats,
      topSellers,
      recentTransactions: recentRevenue,
      period,
    });
  } catch (error) {
    console.error("Developer stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
