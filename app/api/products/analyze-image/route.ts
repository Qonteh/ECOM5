// Smart product image analyzer
// Uses the Vercel AI Gateway (free credits, no GROQ_API_KEY needed) with the
// fast, free Llama 4 Scout vision model to read a product photo and auto-fill
// every product field the seller would otherwise type by hand.
import { generateText, Output } from "ai";
import * as z from "zod";

export const maxDuration = 60;

// Schema mirrors the fields used by the seller "Add New Product" form so the
// extracted data drops straight into the existing form state and DB columns.
const productSchema = z.object({
  title: z
    .string()
    .describe("A concise, attractive product listing title (max ~70 chars)"),
  description: z
    .string()
    .describe(
      "A clear, honest marketing description of the item, 2-4 sentences, mentioning what it is and its key selling points",
    ),
  categorySlug: z
    .string()
    .describe(
      "The slug of the single best matching category from the provided category list. Must be exactly one of the provided slugs.",
    ),
  condition: z
    .enum(["new", "used", "refurbished"])
    .describe("Best guess of the item condition based on the photo"),
  estimatedPriceTzs: z
    .number()
    .describe(
      "A realistic estimated market price for this item in Tanzanian Shillings (TZS). Reason from the typical Tanzanian resale market.",
    ),
  brand: z.string().nullable().describe("Brand name if identifiable, else null"),
  model: z.string().nullable().describe("Model name/number if identifiable"),
  color: z.string().nullable().describe("Primary color of the item"),
  size: z.string().nullable().describe("Size if applicable (clothing, etc.)"),
  material: z.string().nullable().describe("Main material if identifiable"),
  yearOfManufacture: z
    .string()
    .nullable()
    .describe("Approximate year of manufacture if identifiable"),
  countryOfOrigin: z
    .string()
    .nullable()
    .describe("Country of origin if identifiable"),
  tags: z
    .array(z.string())
    .describe("3-8 relevant lowercase search keywords for this product"),
});

export async function POST(req: Request) {
  try {
    const { image, name, categories } = await req.json();

    if (!image || typeof image !== "string") {
      return Response.json(
        { error: "An image is required" },
        { status: 400 },
      );
    }

    // Build the category reference list so the model can pick a real category.
    const categoryList = Array.isArray(categories)
      ? categories
          .map((c: any) => `- ${c.name} (slug: ${c.slug})`)
          .join("\n")
      : "";

    const { output } = await generateText({
      model: "meta/llama-4-scout",
      output: Output.object({ schema: productSchema }),
      messages: [
        {
          role: "system",
          content:
            "You are an expert e-commerce cataloguer for a Tanzanian marketplace. " +
            "You look at a single product photo and produce accurate, realistic listing details. " +
            "Always pick the categorySlug from the provided list only. Prices must be in TZS and realistic for Tanzania.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Analyze this product photo and extract complete listing details.` +
                (name ? `\nThe seller named the product: "${name}".` : "") +
                `\n\nAvailable categories (choose exactly one slug):\n${categoryList}`,
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    });

    return Response.json({ product: output });
  } catch (error: any) {
    console.error("[v0] analyze-image error:", error?.message || error);
    return Response.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 },
    );
  }
}
