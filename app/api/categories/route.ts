// Categories API Route
import { NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories";

// GET - List all categories with subcategories
export async function GET() {
  try {
    const categories = await ProductRepository.getCategories();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
