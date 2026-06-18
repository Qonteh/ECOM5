// Single Order API Routes
import { NextRequest, NextResponse } from "next/server";
import { OrderRepository } from "@/lib/repositories";
import { OrderStatus } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Get single order
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Check if it's an order number or UUID
    const order = id.startsWith("ORD-")
      ? await OrderRepository.findByOrderNumber(id)
      : await OrderRepository.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Update order status
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const validStatuses: OrderStatus[] = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const order = await OrderRepository.updateStatus(id, status, reason);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
