// Authentication API - Login Route
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/repositories";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "soko-tanzania-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Verify credentials against database
    const user = await UserRepository.verifyPassword(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if user is banned
    if (user.is_banned) {
      return NextResponse.json(
        { error: "Your account has been suspended", reason: user.ban_reason },
        { status: 403 },
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      user,
      token, // Also return token for client-side storage if needed
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
