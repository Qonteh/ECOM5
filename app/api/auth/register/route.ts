// Authentication API - Register Route
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
    const {
      name,
      email,
      phone,
      password,
      region,
      district,
      ward,
      street_address,
      role,
      // Business fields for sellers
      business_name,
      business_type,
      tin_number,
      business_license,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !password || !region) {
      return NextResponse.json(
        { error: "Name, email, phone, password, and region are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate phone format (Tanzania format)
    const phoneRegex = /^(\+?255|0)?[67]\d{8}$/;
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid Tanzanian phone number format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Create new user
    const user = await UserRepository.create({
      email,
      password,
      name,
      phone: cleanPhone,
      role: role || "buyer",
      region,
      district,
      ward,
      street_address,
      business_name,
      business_type,
      tin_number,
      business_license,
    });

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

    return NextResponse.json(
      {
        user,
        token,
        message: "Registration successful",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
