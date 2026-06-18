// Users API Routes (Admin)
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/repositories";
import { UserRole } from "@/lib/db";

// GET - List users with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const options = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      role: (searchParams.get("role") as UserRole) || undefined,
      region: searchParams.get("region") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const result = await UserRepository.findAll(options);

    return NextResponse.json({
      users: result.users,
      total: result.total,
      page: options.page,
      totalPages: Math.ceil(result.total / options.limit),
    });
  } catch (error) {
    console.error("Users list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
