import { RECIPE_API_KEY } from "@/lib/config";
import type { Recipe } from "./ai";

export interface RecipeApiResult extends Recipe {
  nutrition: { calories: number; protein_g: number; carbohydrates_g: number; fat_g: number; fiber_g: number };
}

export async function generateRecipeFromApi(
  ingredients: string[],
  cuisine?: string
): Promise<RecipeApiResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch("https://recipe-api.com/api/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": RECIPE_API_KEY,
      },
      body: JSON.stringify({
        title: `Recipe with ${ingredients[0]}`,
        key_ingredients: ingredients,
        cuisine: cuisine || undefined,
        difficulty: "Easy",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();

    const flatIngredients: string[] = [];
    for (const group of data.ingredients || []) {
      for (const item of group.items || []) {
        flatIngredients.push(
          `${item.quantity || ""} ${item.unit || ""} ${item.name}`.trim()
        );
      }
    }

    const perServing = data.nutrition?.per_serving || {};

    return {
      title: data.name,
      calories: Math.round(perServing.calories || 0),
      ingredients: flatIngredients,
      steps: (data.instructions || []).map((i: any) => i.text),
      vibe: "eco",
      safetyRules: data.dietary?.not_suitable_for || [],
      nutrition: {
        calories: Math.round(perServing.calories || 0),
        protein_g: perServing.protein_g || 0,
        carbohydrates_g: perServing.carbohydrates_g || 0,
        fat_g: perServing.fat_g || 0,
        fiber_g: perServing.fiber_g || 0,
      },
    };
  } catch {
    return null;
  }
}
