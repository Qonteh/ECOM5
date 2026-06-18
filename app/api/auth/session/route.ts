// Authentication API - Logout and Session Routes
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/lib/repositories";

const JWT_SECRET =
  process.env.JWT_SECRET || "soko-tanzania-secret-key-change-in-production";

// GET - Get current user session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await UserRepository.findById(decoded.userId);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user });
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Logout (clear session)
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
