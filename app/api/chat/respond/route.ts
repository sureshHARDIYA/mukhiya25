// app/api/chat/respond/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  analyzeIntent,
  getIntentSuggestions,
  type IntentResult,
} from "@/lib/intent-detector";
import { supabase, type Response } from "@/lib/supabase";
import { getProjects } from "@/lib/portfolio-chatbot";
import { 
  getSkills, 
  getEducation, 
  getExperience, 
  getResearch 
} from "@/lib/portfolio-chatbot-dynamic";
import { validateChatInput, sanitizeForDatabase } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate and sanitize input
    const validation = validateChatInput(query);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400 }
      );
    }

    const sanitizedQuery = validation.sanitized || query;

    // 1. Analyze intent using NLP
    const intentResult = analyzeIntent(sanitizedQuery);
    console.log("Intent analysis:", intentResult);

    // 2. Get response from database based on intent
    const { data: responses, error } = await supabase
      .from("responses")
      .select(
        `
        *,
        intents (
          name,
          confidence_threshold
        )
      `
      )
      .eq("intents.name", intentResult.intent);

    if (error) {
      console.error("Database error:", error);
      // Fallback to legacy system
      return await fallbackToLegacySystem(query);
    }

    // 3. Find best matching response
    let bestResponse = null;
    if (responses && responses.length > 0) {
      // For now, just take the first response
      // Later we can implement pattern matching against trigger_patterns
      bestResponse = responses[0];
    }

    // 4. If no response found or confidence too low, use fallback
    const confidenceThreshold =
      bestResponse?.intents?.confidence_threshold || 0.6;
    if (!bestResponse || intentResult.confidence < confidenceThreshold) {
      console.log(
        `Low confidence (${intentResult.confidence}) or no response found, using fallback`
      );
      return await fallbackToLegacySystem(query);
    }

    // 5. Enhance response with dynamic data
    const enhancedResponse = await enhanceResponseWithDynamicData(bestResponse);

    // 6. Generate follow-up questions
    const followUps = getIntentSuggestions(intentResult.intent);

    // 7. Log the query for analytics
    await logUserQuery(query, intentResult, bestResponse.id);

    return NextResponse.json({
      type: "predefined",
      response: enhancedResponse.response_text,
      data: enhancedResponse.response_data,
      followUpQuestions: followUps,
      confidence: intentResult.confidence,
      detectedIntent: intentResult.intent,
      requiresEmail: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fallback to the existing portfolio-chatbot system
async function fallbackToLegacySystem(query: string) {
  try {
    // Import the legacy generateResponse function
    const { generateResponse } = await import("@/lib/portfolio-chatbot");
    const legacyResponse = await generateResponse(query);

    return NextResponse.json(legacyResponse);
  } catch (error) {
    console.error("Legacy system fallback error:", error);
    return NextResponse.json({
      type: "custom",
      response:
        "I apologize, but I'm having trouble understanding your question right now. Could you please rephrase it or try asking about my skills, experience, education, projects, or research?",
      requiresEmail: false,
    });
  }
}

// Enhance response with dynamic data (projects from GitHub, etc.)
async function enhanceResponseWithDynamicData(
  response: Record<string, unknown>
) {
  const enhancedResponse = { ...response };

  try {
    // If this is a projects inquiry, get fresh data from GitHub
    if (response.response_type === "projects") {
      const projects = await getProjects();
      enhancedResponse.response_data = {
        type: "projects",
        data: projects,
        textResponse: response.response_text,
      };
    }
    // For skills, get dynamic data from database
    else if (response.response_type === "skills") {
      const skills = await getSkills();
      enhancedResponse.response_data = {
        type: "skills",
        data: skills,
        textResponse: response.response_text,
      };
    } 
    // For experience, get dynamic data from database
    else if (response.response_type === "experience") {
      const experience = await getExperience();
      enhancedResponse.response_data = {
        type: "experience",
        data: experience,
        textResponse: response.response_text,
      };
    } 
    // For education, get dynamic data from database
    else if (response.response_type === "education") {
      const education = await getEducation();
      enhancedResponse.response_data = {
        type: "education",
        data: education,
        textResponse: response.response_text,
      };
    } 
    // For research, get dynamic data from database
    else if (response.response_type === "research") {
      const research = await getResearch();
      enhancedResponse.response_data = {
        type: "research",
        data: research,
        textResponse: response.response_text,
      };
    }
    // Keep the original response_data if it already exists
    else if (!enhancedResponse.response_data) {
      enhancedResponse.response_data = {
        type: response.response_type,
        data: (response.response_data as Record<string, unknown>)?.data || {},
        textResponse: response.response_text,
      };
    }
  } catch (error) {
    console.error("Error enhancing response:", error);
    // Keep original response if enhancement fails
  }

  return enhancedResponse;
}

// Log user query for analytics
async function logUserQuery(
  query: string,
  intentResult: { intent: string; confidence: number },
  responseId: number
) {
  try {
    await supabase.from("user_queries").insert({
      query,
      detected_intent: intentResult.intent,
      confidence: intentResult.confidence,
      response_id: responseId,
    });
  } catch (error) {
    console.error("Error logging user query:", error);
    // Don't fail the request if logging fails
  }
}
