// Orders API Routes
import { NextRequest, NextResponse } from "next/server";
import { OrderRepository, RevenueRepository } from "@/lib/repositories";

// GET - List orders (for buyer or seller)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const buyerId = searchParams.get("buyer_id");
    const sellerId = searchParams.get("seller_id");
    const status = searchParams.get("status") as
      | "pending"
      | "confirmed"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled"
      | undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!buyerId && !sellerId) {
      return NextResponse.json(
        { error: "Either buyer_id or seller_id is required" },
        { status: 400 },
      );
    }

    let result;
    if (buyerId) {
      result = await OrderRepository.findByBuyer(buyerId, page, limit);
    } else {
      result = await OrderRepository.findBySeller(
        sellerId!,
        page,
        limit,
        status,
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Orders list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      buyer_id,
      seller_id,
      items,
      delivery_region,
      delivery_district,
      delivery_ward,
      delivery_address,
      delivery_phone,
      delivery_notes,
      delivery_fee,
    } = body;

    // Validate required fields
    if (
      !buyer_id ||
      !seller_id ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "buyer_id, seller_id, and items are required" },
        { status: 400 },
      );
    }

    if (!delivery_region || !delivery_address || !delivery_phone) {
      return NextResponse.json(
        {
          error:
            "delivery_region, delivery_address, and delivery_phone are required",
        },
        { status: 400 },
      );
    }

    // Create order
    const order = await OrderRepository.create({
      buyer_id,
      seller_id,
      items,
      delivery_region,
      delivery_district,
      delivery_ward,
      delivery_address,
      delivery_phone,
      delivery_notes,
      delivery_fee,
    });

    // Record platform fee as revenue
    await RevenueRepository.record({
      revenue_type: "transaction_fee",
      amount: order.platform_fee,
      user_id: seller_id,
      order_id: order.id,
      description: `Transaction fee for order ${order.order_number}`,
    });

    return NextResponse.json(
      {
        order,
        message: "Order created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
