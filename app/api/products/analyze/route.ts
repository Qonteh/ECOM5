// Smart Product Analysis API
// Takes a product image (+ optional name) and uses an AI vision model to
// auto-extract all the listing details so the seller doesn't have to type them.
// NOTE: This does NOT touch the database. It only returns suggested field values
// that the existing form maps to your existing tables on submit.
import { NextRequest, NextResponse } from "next/server";
import { generateText, Output } from "ai";
import * as z from "zod";

// Schema mirrors the seller form fields. Everything is nullable so the model
// can leave a field blank when it can't confidently infer it.
const productSchema = z.object({
  title: z
    .string()
    .nullable()
    .describe(
      "A clear, specific product title including brand, model, size, and color when visible (max 150 chars)",
    ),
  description: z
    .string()
    .nullable()
    .describe(
      "A detailed, attractive product description covering key features, specifications, what's included, and condition notes. 3-6 sentences.",
    ),
  category: z
    .string()
    .nullable()
    .describe(
      "The single best matching category name from the provided list of allowed categories. Must match one exactly.",
    ),
  condition: z
    .enum([
      "brand_new",
      "new_open_box",
      "like_new",
      "good",
      "fair",
      "for_parts",
    ])
    .nullable()
    .describe("Best guess of the item's condition based on the image"),
  suggestedPrice: z
    .number()
    .nullable()
    .describe(
      "A reasonable estimated market price in Tanzanian Shillings (TZS) for this item",
    ),
  brand: z.string().nullable().describe("Brand or manufacturer name"),
  model: z.string().nullable().describe("Model name or number"),
  color: z.string().nullable().describe("Primary color"),
  size: z.string().nullable().describe("Size if applicable"),
  material: z.string().nullable().describe("Main material if identifiable"),
  countryOfOrigin: z
    .string()
    .nullable()
    .describe("Likely country of origin if identifiable"),
  tags: z
    .array(z.string())
    .describe(
      "3-8 relevant search keywords/tags buyers might use to find this product",
    ),
  metaTitle: z
    .string()
    .nullable()
    .describe("A short SEO-friendly title (max 60 chars)"),
  metaDescription: z
    .string()
    .nullable()
    .describe("A short SEO meta description (max 160 chars)"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, name, categories } = body as {
      image?: string;
      name?: string;
      categories?: string[];
    };

    if (!image) {
      return NextResponse.json(
        { error: "An image is required to analyze the product." },
        { status: 400 },
      );
    }

    const categoryList =
      Array.isArray(categories) && categories.length > 0
        ? categories.join(", ")
        : "Electronics, Fashion, Home, Vehicles, Phones, Other";

    const { output } = await generateText({
      model: "google/gemini-3.5-flash",
      output: Output.object({ schema: productSchema }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a product listing assistant for a Tanzanian marketplace. Look at this product image${
                name ? ` (the seller named it: "${name}")` : ""
              } and extract every detail you can to create a complete, high-quality marketplace listing.

Rules:
- The "category" MUST be chosen from EXACTLY one of these allowed categories: ${categoryList}.
- Prices must be realistic estimates in Tanzanian Shillings (TZS).
- Write the description in clear, appealing English.
- If you cannot confidently determine a field, leave it null (but always try your best for title, description, category, condition, and tags).`,
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    });

    return NextResponse.json({ data: output });
  } catch (error: any) {
    console.error("[v0] Product analyze error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to analyze the product image. Please try again." },
      { status: 500 },
    );
  }
}
