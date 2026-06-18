import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      "SELECT region, COUNT(*) as count FROM products WHERE status = 'active' GROUP BY region",
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
