// Developer Dashboard API - Theme Management
import { NextRequest, NextResponse } from "next/server";
import { ThemeRepository } from "@/lib/repositories";

// GET - Get all themes
export async function GET() {
  try {
    const [themes, activeTheme] = await Promise.all([
      ThemeRepository.findAll(),
      ThemeRepository.getActive(),
    ]);

    return NextResponse.json({
      themes,
      activeTheme: activeTheme?.theme_key || "safari",
    });
  } catch (error) {
    console.error("Themes fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new theme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      theme_key,
      name,
      description,
      primary_color,
      secondary_color,
      accent_color,
      styles,
    } = body;

    if (
      !theme_key ||
      !name ||
      !primary_color ||
      !secondary_color ||
      !accent_color
    ) {
      return NextResponse.json(
        {
          error:
            "theme_key, name, primary_color, secondary_color, and accent_color are required",
        },
        { status: 400 },
      );
    }

    const theme = await ThemeRepository.create({
      theme_key,
      name,
      description,
      primary_color,
      secondary_color,
      accent_color,
      styles: styles || {},
      is_active: true,
      is_default: false,
    });

    return NextResponse.json(
      {
        theme,
        message: "Theme created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Theme creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Set active theme
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme_key } = body;

    if (!theme_key) {
      return NextResponse.json(
        { error: "theme_key is required" },
        { status: 400 },
      );
    }

    await ThemeRepository.setActive(theme_key);

    return NextResponse.json({
      message: `Theme ${theme_key} is now active`,
      activeTheme: theme_key,
    });
  } catch (error) {
    console.error("Theme update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
