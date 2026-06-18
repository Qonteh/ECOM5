// Single Product API Routes
import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Get single product
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const product = await ProductRepository.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Record view (get IP from headers)
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");
    await ProductRepository.recordView(id, undefined, ip || undefined);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Update product
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const product = await ProductRepository.update(id, body);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const deleted = await ProductRepository.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
