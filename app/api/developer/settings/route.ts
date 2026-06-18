// Developer Dashboard API - Platform Settings
import { NextRequest, NextResponse } from "next/server";
import { SettingsRepository } from "@/lib/repositories";

// GET - Get all platform settings
export async function GET() {
  try {
    const settings = await SettingsRepository.findAll();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Update platform settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Settings object is required" },
        { status: 400 },
      );
    }

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      const type =
        typeof value === "number"
          ? "number"
          : typeof value === "boolean"
            ? "boolean"
            : typeof value === "object"
              ? "json"
              : "string";

      await SettingsRepository.set(
        key,
        value as string | number | boolean,
        type,
      );
    }

    // Fetch updated settings
    const updatedSettings = await SettingsRepository.findAll();

    return NextResponse.json({
      settings: updatedSettings,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
