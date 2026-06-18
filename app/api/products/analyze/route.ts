// Smart product image analysis endpoint.
// Takes an uploaded product image (and optional name hint) and uses an
// AI vision model to extract structured listing details. Nothing is hardcoded:
// every value returned is derived from the actual image content.
import { NextRequest, NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import * as z from "zod";

// Use the real OpenAI API directly with your OPENAI_API_KEY (no AI Gateway).
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Keep enums aligned with how the form + database expect values.
const analysisSchema = z.object({
  title: z
    .string()
    .describe("A concise, marketable product title (max ~70 chars)"),
  description: z
    .string()
    .describe(
      "A detailed, honest 2-4 sentence product description based only on what is visible in the image.",
    ),
  categorySlug: z
    .string()
    .describe(
      "The single best matching category slug from the provided category list.",
    ),
  subcategorySlug: z
    .string()
    .nullable()
    .describe("Best matching subcategory slug, or null if unsure."),
  condition: z
    .enum([
      "brand_new",
      "new_open_box",
      "like_new",
      "good",
      "fair",
      "for_parts",
    ])
    .describe("Estimated condition based on the visible state of the item."),
  suggestedPrice: z
    .number()
    .describe(
      "A realistic suggested selling price in Tanzanian Shillings (TZS) for this item on a local marketplace.",
    ),
  brand: z.string().nullable().describe("Brand name if identifiable, else null"),
  model: z.string().nullable().describe("Model name/number if identifiable"),
  color: z.string().nullable().describe("Primary color of the item"),
  material: z.string().nullable().describe("Main material if identifiable"),
  size: z.string().nullable().describe("Size if applicable (e.g. clothing, dimensions)"),
  countryOfOrigin: z
    .string()
    .nullable()
    .describe("Likely country of origin if identifiable"),
  tags: z
    .array(z.string())
    .describe("3-6 relevant search keywords/tags for this product"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, nameHint, categories } = body as {
      image?: string;
      nameHint?: string;
      categories?: { name: string; slug: string; subcategories?: { name: string; slug: string }[] }[];
    };

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "An image is required for analysis." },
        { status: 400 },
      );
    }

    // Build a readable category catalogue so the model can only pick valid slugs.
    const categoryList =
      Array.isArray(categories) && categories.length > 0
        ? categories
            .map((c) => {
              const subs =
                c.subcategories && c.subcategories.length > 0
                  ? ` (subcategories: ${c.subcategories
                      .map((s) => s.slug)
                      .join(", ")})`
                  : "";
              return `- ${c.slug}: ${c.name}${subs}`;
            })
            .join("\n")
        : "No category list provided; infer a reasonable lowercase slug.";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured on the server." },
        { status: 500 },
      );
    }

    const { output } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({ schema: analysisSchema }),
      system:
        "You are a product cataloguing assistant for a Tanzanian online marketplace. " +
        "You analyze a single product photo and produce accurate listing data. " +
        "Only describe what is actually visible in the image. Do not invent specifications you cannot see. " +
        "Prices must be realistic in Tanzanian Shillings (TZS).",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Analyze this product photo and extract listing details.\n\n` +
                (nameHint
                  ? `The seller named the product: "${nameHint}". Use this as a strong hint.\n\n`
                  : "") +
                `Choose the categorySlug strictly from this list:\n${categoryList}`,
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    });

    return NextResponse.json({ analysis: output });
  } catch (error: any) {
    console.error("[v0] Product analysis error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 },
    );
  }
}
