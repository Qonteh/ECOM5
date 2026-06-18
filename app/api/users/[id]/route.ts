// Single User API Routes
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/repositories";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Get single user
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const user = await UserRepository.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If it's a seller, include stats
    if (
      user.role === "seller" ||
      user.role === "developer" ||
      user.role === "admin"
    ) {
      const stats = await UserRepository.getSellerStats(id);
      return NextResponse.json({ user, stats });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Update user
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const user = await UserRepository.update(id, body);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
