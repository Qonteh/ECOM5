import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    const { rows } = await query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [user_id],
    );

    return NextResponse.json({ notifications: rows });
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user_id = searchParams.get("user_id");

    if (id) {
      // Mark specific notification as read
      await query(
        `UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = $1 RETURNING *`,
        [id],
      );
      return NextResponse.json({ message: "Notification marked as read" });
    } else if (user_id) {
      // Mark all as read
      await query(
        `UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = $1 AND is_read = FALSE`,
        [user_id],
      );
      return NextResponse.json({ message: "All notifications marked as read" });
    } else {
      return NextResponse.json(
        { error: "id or user_id is required" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Failed to update notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
