// Products API Routes
import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories";
import { ProductCondition, query } from "@/lib/db";

// GET - List products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    let categoryParam = searchParams.get("category") || undefined;

    // Auto-resolve string slugs to UUIDs if needed
    if (
      categoryParam &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        categoryParam,
      )
    ) {
      try {
        const catRes = await query(
          `SELECT id FROM categories WHERE slug = $1`,
          [categoryParam.toLowerCase()],
        );
        if (catRes.rows.length > 0) {
          categoryParam = catRes.rows[0].id;
        }
      } catch (err) {
        console.error("Error resolving category slug:", err);
      }
    }

    const filters = {
      category_id: categoryParam,
      subcategory_id: searchParams.get("subcategory") || undefined,
      seller_id: searchParams.get("seller") || undefined,
      region: searchParams.get("region") || undefined,
      min_price: searchParams.get("min_price")
        ? parseFloat(searchParams.get("min_price")!)
        : undefined,
      max_price: searchParams.get("max_price")
        ? parseFloat(searchParams.get("max_price")!)
        : undefined,
      condition:
        (searchParams.get("condition") as ProductCondition) || undefined,
      status: searchParams.get("status") || undefined, // Allow passing status (for seller dashboards)
      is_featured: searchParams.get("featured") === "true" ? true : undefined,
      is_promoted: searchParams.get("promoted") === "true" ? true : undefined,
      search: searchParams.get("search") || undefined,
      sort_by:
        (searchParams.get("sort") as
          | "newest"
          | "oldest"
          | "price_low"
          | "price_high"
          | "popular") || "newest",
    };

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await ProductRepository.findAll(filters, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Products list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      seller_id,
      category_id,
      title,
      description,
      price,
      condition,
      region,
      images,
      attributes,
      ...rest
    } = body;

    // Auto-seed category if it's not a UUID format (fallback from local mock data)
    let finalCategoryId = category_id;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        finalCategoryId,
      );

    if (!isUUID && finalCategoryId) {
      // Insert a dummy category to prevent Crash on unseeded db
      try {
        const newCat = await query(
          `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id`,
          [finalCategoryId, finalCategoryId.toLowerCase()],
        );
        finalCategoryId = newCat.rows[0].id;
      } catch (dbErr) {
        // If unique constraint triggers, fetch it
        const existingCat = await query(
          `SELECT id FROM categories WHERE slug = $1`,
          [finalCategoryId.toLowerCase()],
        );
        if (existingCat.rows.length > 0) {
          finalCategoryId = existingCat.rows[0].id;
        }
      }
    }

    if (
      !seller_id ||
      !finalCategoryId ||
      !title ||
      !description ||
      price === undefined ||
      price === null ||
      !condition ||
      !region
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: seller_id, category_id, title, description, price, condition, region",
        },
        { status: 400 },
      );
    }

    // Create product
    const product = await ProductRepository.create({
      seller_id,
      category_id: finalCategoryId,
      title,
      description,
      price: parseFloat(price),
      condition,
      region,
      images,
      attributes: Object.entries(attributes || {}).map(([name, value]) => ({
        name,
        value: String(value),
      })),
      ...rest,
    });

    return NextResponse.json(
      {
        product,
        message: "Product created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
