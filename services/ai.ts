/**
 * AI Service for PantryAI
 * Uses Google Gemini API (free tier) for Vision (ingredient detection) and Text (recipe generation)
 * Can be switched to OpenAI for production
 */

import { 
  GEMINI_API_KEY, 
  GEMINI_API_URL, 
  GEMINI_MODEL_VISION, 
  GEMINI_MODEL_TEXT 
} from "@/lib/config";
import * as FileSystem from "expo-file-system/legacy";

export interface Recipe {
  title: string;
  calories: number;
  ingredients: string[];
  steps: string[];
  vibe: string;
}

/**
 * Scans ingredients from an image using Gemini Vision API
 * Falls back to mock data if API key is not configured
 */
export async function scanIngredients(
  imageUri: string | null
): Promise<string[]> {
  console.log("[SCAN] scanIngredients called with imageUri:", imageUri ? "provided" : "null");
  
  // If no image URI, return mock data (for testing without camera)
  if (!imageUri) {
    console.log("[SCAN] No image provided - using mock data");
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIngredients = ["Chicken Breast", "Broccoli", "Rice"];
        console.log("[SCAN] Mock data returned:", mockIngredients);
        resolve(mockIngredients);
      }, 1000);
    });
  }

  // If no API key is set, return mock data
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
    console.log("[SCAN] No API key set - using mock data");
    console.log("[SCAN] Set GEMINI_API_KEY in lib/config.ts to use real API");
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIngredients = ["Chicken Breast", "Broccoli", "Rice"];
        console.log("[SCAN] Mock data returned:", mockIngredients);
        resolve(mockIngredients);
      }, 1000);
    });
  }

  console.log("[SCAN] API key is configured");
  console.log("[SCAN] Config:", {
    apiUrl: GEMINI_API_URL,
    model: GEMINI_MODEL_VISION,
    keyLength: GEMINI_API_KEY.length,
    keyPrefix: GEMINI_API_KEY.substring(0, 10) + "...",
  });

  try {
    console.log("[SCAN] Reading image file:", imageUri);
    console.log("[SCAN] Converting image to base64...");
    
    // Convert image to base64 using legacy API (for compatibility)
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("[SCAN] Image converted to base64, length:", base64Image.length);
    console.log("[SCAN] Preparing Gemini API request...");

    const url = `${GEMINI_API_URL}/models/${GEMINI_MODEL_VISION}:generateContent?key=${GEMINI_API_KEY}`;
    console.log("[SCAN] API URL:", url.replace(GEMINI_API_KEY, "***HIDDEN***"));
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Identify all food ingredients visible in this image. Return ONLY a JSON array of ingredient names, nothing else. Example: [\"chicken breast\", \"broccoli\", \"rice\"]",
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    console.log("[SCAN] Sending request to Gemini API...");
    console.log("[SCAN] Request body size:", JSON.stringify(requestBody).length, "bytes");
    console.log("[SCAN] Image data size:", base64Image.length, "bytes");
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[SCAN] Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorData = await response.json().catch((e) => {
        console.error("[SCAN] Failed to parse error response:", e);
        return {};
      });
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error("[SCAN] Gemini API error:", {
        message: errorMessage,
        fullError: errorData,
        status: response.status,
      });
      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    console.log("[SCAN] Response OK, parsing JSON...");
    const data = await response.json();
    
    console.log("[SCAN] Full API response structure:", {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length || 0,
      firstCandidate: data.candidates?.[0] ? {
        hasContent: !!data.candidates[0].content,
        hasParts: !!data.candidates[0].content?.parts,
        partsLength: data.candidates[0].content?.parts?.length || 0,
      } : null,
    });

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    console.log("[SCAN] Extracted content from response:");
    console.log("[SCAN] Content type:", typeof content);
    console.log("[SCAN] Content length:", content.length);
    console.log("[SCAN] Content preview (first 200 chars):", content.substring(0, 200));
    console.log("[SCAN] Full content:", content);
    
    // Parse the JSON array from the response
    let ingredients: string[] = [];
    let cleanedContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith("```")) {
      console.log("[SCAN] Detected markdown code block, cleaning...");
      cleanedContent = cleanedContent.replace(/^```json\n?/i, "").replace(/^```\n?/, "").replace(/```$/g, "").trim();
      console.log("[SCAN] Cleaned content:", cleanedContent);
    }
    
    // Try to extract JSON array from text if it's wrapped
    if (!cleanedContent.startsWith("[")) {
      console.log("[SCAN] Content doesn't start with '[', trying to extract JSON array...");
      const jsonMatch = cleanedContent.match(/\[.*\]/s);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
        console.log("[SCAN] Extracted JSON array:", cleanedContent);
      }
    }
    
    try {
      console.log("[SCAN] Attempting to parse JSON...");
      ingredients = JSON.parse(cleanedContent);
      console.log("[SCAN] JSON parsed successfully:", ingredients);
      
      if (!Array.isArray(ingredients)) {
        console.warn("[SCAN] Parsed result is not an array:", typeof ingredients, ingredients);
        console.warn("[SCAN] Using fallback data");
        ingredients = ["Chicken Breast", "Broccoli", "Rice"];
      } else {
        console.log("[SCAN] Ingredients array is valid, length:", ingredients.length);
      }
    } catch (parseError: any) {
      console.error("[SCAN] JSON parse error:", {
        message: parseError?.message,
        name: parseError?.name,
        content: cleanedContent,
        contentLength: cleanedContent.length,
      });
      
      // Try to extract ingredients from text manually
      console.log("[SCAN] Attempting to extract ingredients from text...");
      const ingredientMatches = cleanedContent.match(/"([^"]+)"/g) || cleanedContent.match(/'([^']+)'/g);
      if (ingredientMatches) {
        ingredients = ingredientMatches.map((match: string) => match.replace(/["']/g, ""));
        console.log("[SCAN] Extracted ingredients from text:", ingredients);
      } else {
        console.warn("[SCAN] Could not extract ingredients, using fallback");
        ingredients = ["Chicken Breast", "Broccoli", "Rice"];
      }
    }
    
    console.log("[SCAN] Final ingredients:", ingredients);
    return ingredients;
  } catch (error: any) {
    console.error("[SCAN] Error in scanIngredients:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    
    // Re-throw if it's a known error, otherwise fallback to mock
    if (error?.message?.includes("Image URI is required")) {
      throw error;
    }
    
    // Fallback to mock data on error
    console.log("[SCAN] Falling back to mock data due to error");
    const fallbackIngredients = ["Chicken Breast", "Broccoli", "Rice"];
    console.log("[SCAN] Returning fallback:", fallbackIngredients);
    return fallbackIngredients;
  }
}

/**
 * Generates a recipe based on ingredients and vibe using Gemini Text API
 * Falls back to mock data if API key is not configured
 */
export async function generateRecipe(
  ingredients: string[],
  vibe: "eco" | "health" | "travel",
  cuisine?: string
): Promise<Recipe> {
  console.log("[RECIPE] generateRecipe called with:", {
    ingredientsCount: ingredients.length,
    ingredients: ingredients,
    vibe: vibe,
    cuisine: cuisine,
  });

  // If no API key is set, return mock data
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
    console.log("[RECIPE] No API key set - using mock data");
    console.log("[RECIPE] Set GEMINI_API_KEY in lib/config.ts to use real API");
    return getMockRecipe(ingredients, vibe);
  }

  console.log("[RECIPE] API key is configured");
  console.log("[RECIPE] Config:", {
    apiUrl: GEMINI_API_URL,
    model: GEMINI_MODEL_TEXT,
    keyLength: GEMINI_API_KEY.length,
  });

  const vibePrompts = {
    eco: "Create a zero-waste recipe that uses ALL the provided ingredients to minimize food waste. Focus on using every part of the ingredients.",
    health: "Create a high-protein, macro-optimized recipe focused on fitness and health.",
    travel: "Create a recipe with a cultural twist - transform these ingredients into a globally-inspired dish.",
  };

  const cuisinePrompt = cuisine && cuisine !== "any" 
    ? `\n\nIMPORTANT: This MUST be a ${cuisine} cuisine recipe. Use ${cuisine} cooking techniques, seasonings, and presentation styles.`
    : "";

  try {
    const url = `${GEMINI_API_URL}/models/${GEMINI_MODEL_TEXT}:generateContent?key=${GEMINI_API_KEY}`;
    console.log("[RECIPE] API URL:", url.replace(GEMINI_API_KEY, "***HIDDEN***"));
    
    const prompt = `You are a professional chef. Always respond with valid JSON only.

${vibePrompts[vibe]}${cuisinePrompt}

Ingredients: ${ingredients.join(", ")}

IMPORTANT: The recipe title MUST be in English. If creating a non-English cuisine dish, use the format: "English Name (Native Name)" - for example: "Pork and Egg Rice Bowl (Buta Soboro Tamago Donburi)" or "Chicken Teriyaki Bowl".

Return a JSON object with this exact structure:
{
  "title": "Recipe name (always in English or English + native name)",
  "calories": number (estimated),
  "ingredients": ["ingredient1", "ingredient2", ...],
  "steps": ["step 1", "step 2", ...],
  "vibe": "${vibe}"
}

Make the steps concise and clear. Include timing when needed.`;

    console.log("[RECIPE] Sending request to Gemini API...");
    console.log("[RECIPE] Prompt length:", prompt.length, "characters");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    });

    console.log("[RECIPE] Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json().catch((e) => {
        console.error("[RECIPE] Failed to parse error response:", e);
        return {};
      });
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error("[RECIPE] Gemini API error:", {
        message: errorMessage,
        fullError: errorData,
        status: response.status,
      });
      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    console.log("[RECIPE] Response OK, parsing JSON...");
    const data = await response.json();
    
    console.log("[RECIPE] Full API response structure:", {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length || 0,
      firstCandidate: data.candidates?.[0] ? {
        hasContent: !!data.candidates[0].content,
        hasParts: !!data.candidates[0].content?.parts,
        partsLength: data.candidates[0].content?.parts?.length || 0,
        finishReason: data.candidates[0].finishReason,
      } : null,
    });

    // Check if response was truncated
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === "MAX_TOKENS" || finishReason === "OTHER") {
      console.warn("[RECIPE] Response may be truncated. Finish reason:", finishReason);
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    console.log("[RECIPE] Extracted content from response:");
    console.log("[RECIPE] Content type:", typeof content);
    console.log("[RECIPE] Content length:", content.length);
    console.log("[RECIPE] Content preview (first 500 chars):", content.substring(0, 500));
    console.log("[RECIPE] Content preview (last 200 chars):", content.substring(Math.max(0, content.length - 200)));
    console.log("[RECIPE] Full content:", content);
    
    // Extract JSON from response (Gemini might wrap it in markdown code blocks)
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith("```")) {
      console.log("[RECIPE] Detected markdown code block, cleaning...");
      jsonContent = jsonContent.replace(/^```json\n?/i, "").replace(/^```\n?/, "").replace(/```$/g, "").trim();
      console.log("[RECIPE] Cleaned content length:", jsonContent.length);
    }
    
    // Try to extract JSON object from text if it's wrapped
    if (!jsonContent.startsWith("{")) {
      console.log("[RECIPE] Content doesn't start with '{', trying to extract JSON object...");
      // Use a more robust regex that handles nested objects
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
        console.log("[RECIPE] Extracted JSON object, length:", jsonContent.length);
      }
    }
    
    // Check if JSON appears incomplete (doesn't end with })
    if (!jsonContent.endsWith("}")) {
      console.warn("[RECIPE] JSON content doesn't end with '}', may be truncated");
      console.warn("[RECIPE] Last 100 chars:", jsonContent.substring(Math.max(0, jsonContent.length - 100)));
      
      // Try to repair incomplete JSON by finding the last complete structure
      // Count braces to see if we can close it
      const openBraces = (jsonContent.match(/\{/g) || []).length;
      const closeBraces = (jsonContent.match(/\}/g) || []).length;
      console.log("[RECIPE] Brace count - Open:", openBraces, "Close:", closeBraces);
      
      if (openBraces > closeBraces) {
        // Try to close incomplete arrays/objects
        let repaired = jsonContent;
        const missingBraces = openBraces - closeBraces;
        
        // Check if we're in the middle of a string
        const lastQuoteIndex = jsonContent.lastIndexOf('"');
        const lastNewlineIndex = jsonContent.lastIndexOf('\n');
        const isInString = lastQuoteIndex > lastNewlineIndex && 
                          (jsonContent.substring(lastQuoteIndex).match(/"/g) || []).length % 2 === 1;
        
        if (!isInString) {
          // Try to close arrays first, then objects
          if (repaired.includes('[') && !repaired.endsWith(']')) {
            const openBrackets = (repaired.match(/\[/g) || []).length;
            const closeBrackets = (repaired.match(/\]/g) || []).length;
            if (openBrackets > closeBrackets) {
              repaired += ']';
            }
          }
          // Close objects
          for (let i = 0; i < missingBraces; i++) {
            repaired += '}';
          }
          console.log("[RECIPE] Attempted to repair JSON, new length:", repaired.length);
          jsonContent = repaired;
        }
      }
    }
    
    let recipe: any = {};
    try {
      console.log("[RECIPE] Attempting to parse JSON...");
      console.log("[RECIPE] JSON content length:", jsonContent.length);
      recipe = JSON.parse(jsonContent);
      console.log("[RECIPE] JSON parsed successfully");
      console.log("[RECIPE] Parsed recipe structure:", {
        hasTitle: !!recipe.title,
        hasCalories: typeof recipe.calories === "number",
        hasIngredients: Array.isArray(recipe.ingredients),
        ingredientsCount: recipe.ingredients?.length || 0,
        hasSteps: Array.isArray(recipe.steps),
        stepsCount: recipe.steps?.length || 0,
      });
    } catch (parseError: any) {
      console.error("[RECIPE] JSON parse error:", {
        message: parseError?.message,
        name: parseError?.name,
        jsonContent: jsonContent.substring(0, 500),
        jsonContentLength: jsonContent.length,
        jsonContentEnd: jsonContent.substring(Math.max(0, jsonContent.length - 200)),
      });
      
      // If JSON is incomplete, try to extract what we can
      if (parseError?.message?.includes("Unexpected end")) {
        console.log("[RECIPE] JSON appears incomplete, attempting partial extraction...");
        // Try to extract at least title and some ingredients
        const titleMatch = jsonContent.match(/"title"\s*:\s*"([^"]*)"/);
        const caloriesMatch = jsonContent.match(/"calories"\s*:\s*(\d+)/);
        const ingredientsMatch = jsonContent.match(/"ingredients"\s*:\s*\[(.*?)\]/s);
        
        if (titleMatch || caloriesMatch || ingredientsMatch) {
          console.log("[RECIPE] Found partial data, creating recipe with available fields");
          recipe = {
            title: titleMatch ? titleMatch[1] : "Generated Recipe",
            calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 500,
            ingredients: ingredientsMatch 
              ? JSON.parse("[" + ingredientsMatch[1] + "]").filter((i: any) => typeof i === "string")
              : ingredients,
            steps: ["Recipe generation was incomplete. Please try again."],
            vibe: vibe,
          };
        } else {
          throw new Error(`Failed to parse recipe JSON: ${parseError?.message}`);
        }
      } else {
        throw new Error(`Failed to parse recipe JSON: ${parseError?.message}`);
      }
    }
    
    // Validate and return recipe
    const validatedRecipe: Recipe = {
      title: recipe.title || "Generated Recipe",
      calories: typeof recipe.calories === "number" ? recipe.calories : 500,
      ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 
        ? recipe.ingredients 
        : ingredients,
      steps: Array.isArray(recipe.steps) && recipe.steps.length > 0 
        ? recipe.steps 
        : ["Follow the recipe instructions carefully."],
      vibe: recipe.vibe || vibe,
    };
    
    console.log("[RECIPE] Final validated recipe:", {
      title: validatedRecipe.title,
      calories: validatedRecipe.calories,
      ingredientsCount: validatedRecipe.ingredients.length,
      stepsCount: validatedRecipe.steps.length,
    });
    
    return validatedRecipe;
  } catch (error: any) {
    console.error("[RECIPE] Error generating recipe:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    // Fallback to mock data on error
    console.log("[RECIPE] Falling back to mock data due to error");
    return getMockRecipe(ingredients, vibe);
  }
}

/**
 * Mock recipe generator (used as fallback)
 */
function getMockRecipe(
  ingredients: string[],
  vibe: "eco" | "health" | "travel"
): Recipe {
  const vibeTitles = {
    eco: "Zero-Waste Chicken & Veggie Bowl",
    health: "High-Protein Lean Meal Prep",
    travel: "Japanese-Inspired Teriyaki Bowl",
  };

  const vibeSteps = {
    eco: [
      "Chop all vegetables into bite-sized pieces to maximize surface area and flavor.",
      "Cook rice according to package instructions, using vegetable scraps for extra flavor if available.",
      "Season chicken breast with salt, pepper, and any herbs you have on hand.",
      "Pan-sear chicken until golden brown, then add broccoli to the same pan to reduce dishes.",
      "Combine everything in a bowl and enjoy - nothing wasted!",
    ],
    health: [
      "Marinate chicken breast in lemon juice and herbs for 30 minutes to tenderize.",
      "Steam broccoli to preserve nutrients - aim for bright green, slightly crisp texture.",
      "Cook brown rice for added fiber and sustained energy release.",
      "Measure portions: 150g chicken, 100g rice, 150g broccoli for optimal macros.",
      "Plate and track your macros - you're hitting your protein goals!",
    ],
    travel: [
      "Prepare a simple teriyaki sauce: soy sauce, honey, and ginger.",
      "Slice chicken into thin strips for quick, even cooking.",
      "Stir-fry chicken in a hot wok or pan until cooked through.",
      "Add broccoli and cook until tender-crisp, then pour in teriyaki sauce.",
      "Serve over steamed rice, garnish with sesame seeds if available.",
    ],
  };

  return {
    title: vibeTitles[vibe],
    calories: Math.floor(Math.random() * 200) + 400,
    ingredients: [
      ...ingredients,
      "Salt and pepper",
      "Cooking oil",
      "Optional: herbs and spices",
    ],
    steps: vibeSteps[vibe],
    vibe,
  };
}
