import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { RECIPE_SYSTEM_PROMPT } from "@/lib/ai/recipe-prompt";
import { recipesData } from "@/data/recipes";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Simple in-memory rate limiting map for MVP. 
// In production with Vercel, Upstash Redis or Vercel KV would be preferred.
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
  try {
    // 1. Basic Rate Limiting Check
    // Using IP or a generic token for MVP rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);
    
    if (userLimit) {
      if (now > userLimit.resetTime) {
        // Reset limit window
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else if (userLimit.count >= RATE_LIMIT_MAX) {
        console.warn(`[Rate Limit] Exceeded for IP: ${ip}`);
        return getFallbackResponse("Has alcanzado el límite diario de recetas generadas. Te mostramos una de nuestra colección.", 429);
      } else {
        userLimit.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // 2. Read Request
    const body = await request.json();
    const { moodId, moodName, preferences, restrictions, occasion } = body;

    if (!moodName) {
      return NextResponse.json({ error: "Missing moodName" }, { status: 400 });
    }

    // 3. Construct Claude Message
    let userPrompt = `Necesito 1 receta para el estado emocional "${moodName}".\n`;
    
    if (occasion) {
      userPrompt += `La receta es ideal para consumir como: ${occasion}.\n`;
    }
    if (preferences) {
      userPrompt += `Tengo estos ingredientes/preferencias: ${preferences}.\n`;
    }
    if (restrictions && restrictions.length > 0) {
      userPrompt += `Debe cumplir estas restricciones dietéticas: ${restrictions.join(", ")}.\n`;
    }
    
    userPrompt += `\nGenera la receta usando la estructura JSON solicitada.`;

    // 4. Call Anthropic Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6", // Current Sonnet model (April 2026)
      max_tokens: 1500,
      temperature: 0.7,
      system: RECIPE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        }
      ],
    });

    // 5. Parse Response
    const messageContent = response.content[0].type === "text" ? response.content[0].text : "";
    
    try {
      // Find JSON array in the response string (in case Claude wrapped it in markdown)
      const jsonMatch = messageContent.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
         throw new Error("No JSON array returned");
      }
      
      const recipes = JSON.parse(jsonMatch[0]);
      
      // Inject unique IDs
      const recipesWithIds = recipes.map((r: any) => ({
        ...r,
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        moodId: moodId || "m2" // Fallback to activation if missing
      }));

      return NextResponse.json({ recipes: recipesWithIds }, { status: 200 });

    } catch (parseError) {
      console.error("[Parse Error] Could not parse Claude JSON:", parseError, messageContent);
      return getFallbackResponse("Error generando receta personalizada. Intentando usar el recetario principal.", 500, moodId);
    }
    
  } catch (error) {
    console.error("[API Error] Claude generation failed:", error);
    return getFallbackResponse("Servicio de generación no disponible en este momento.", 503, "m2");
  }
}

// Fallback generator 
function getFallbackResponse(message: string, status: number, requestedMoodId?: string) {
  // Grab a recipe from our static data, ideally matching the mood
  const availableRecipes = requestedMoodId 
    ? recipesData.filter(r => r.moodId === requestedMoodId)
    : recipesData;
    
  const fallbackList = availableRecipes.length > 0 ? availableRecipes : recipesData;
  const randomRecipe = fallbackList[Math.floor(Math.random() * fallbackList.length)];
  
  return NextResponse.json({ 
    error: message, 
    recipes: [randomRecipe] 
  }, { status });
}
