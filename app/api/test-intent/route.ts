// app/api/test-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { analyzeIntent } from "@/lib/intent-detector";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // Test the intent detection
    const intentResult = analyzeIntent(query);

    return NextResponse.json({
      success: true,
      query,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      keywords: intentResult.keywords,
      entities: intentResult.entities,
    });
  } catch (error) {
    console.error("Intent test error:", error);
    return NextResponse.json(
      {
        error: "Intent analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
