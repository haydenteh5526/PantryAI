/**
 * Recipe engine: protein safety detection, method selection, and prompt construction
 * using verified data from constants/cookingData.ts
 */

import {
  GENERAL_SAFETY_RULES,
  PROTEIN_SAFETY,
  COOKING_METHODS,
} from "@/constants/cookingData";

const DEFAULT_PROTEIN_SAFETY =
  "Ensure food is piping hot and cooked through before serving.";

export type CookingMethod = (typeof COOKING_METHODS)[number];

/** Normalize text for matching (lowercase, single spaces). */
function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Detect proteins in ingredient list and return the corresponding safety rule(s).
 * Matches PROTEIN_SAFETY keys: ingredient text must contain all “words” of the key
 * (key words are split on underscore, e.g. beef_ground → "beef", "ground").
 * Longer keys are checked first so "beef_ground" wins over a hypothetical "beef".
 */
export function getProteinSafety(ingredients: string[]): string {
  const combined = normalize(ingredients.join(" "));
  const keysByLength = (Object.keys(PROTEIN_SAFETY) as string[]).sort(
    (a, b) => b.length - a.length
  );
  const rules: string[] = [];
  const seen = new Set<string>();

  for (const key of keysByLength) {
    const words = key.replace(/_/g, " ").split(/\s+/).filter(Boolean);
    const match = words.every((w) => combined.includes(w));
    if (match) {
      const rule = PROTEIN_SAFETY[key];
      if (rule && !seen.has(rule)) {
        seen.add(rule);
        rules.push(rule);
      }
    }
  }

  if (rules.length === 0) return DEFAULT_PROTEIN_SAFETY;
  return rules.join(" ");
}

/**
 * Score each method by how many of its keywords appear in the ingredient list.
 * Returns the method with the highest score; ties go to the first in array.
 */
export function selectCookingMethod(ingredients: string[]): CookingMethod {
  const combined = normalize(ingredients.join(" "));
  let best: CookingMethod = COOKING_METHODS[0];
  let bestScore = 0;

  for (const method of COOKING_METHODS) {
    const score = method.keywords.filter((kw) =>
      combined.includes(normalize(kw))
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = method;
    }
  }

  return best;
}

/**
 * Build the exact system prompt for the AI using selected method and safety rules.
 */
export function buildRecipeSystemPrompt(
  ingredients: string[],
  vibe: string,
  method: CookingMethod,
  proteinSafety: string
): string {
  const generalSafety = GENERAL_SAFETY_RULES.join(" ");
  const standardSteps = method.generic_steps.join("\n");

  return `You are a professional chef.

BASE TECHNIQUE: ${method.title}
STANDARD STEPS: ${standardSteps}

MANDATORY SAFETY RULES:
1. ${generalSafety}
2. ${proteinSafety}

USER INGREDIENTS: ${ingredients.join(", ")}

USER VIBE: ${vibe}

TASK:
Write a recipe using the Base Technique but adapted for the User Ingredients and Vibe.
Weave the Mandatory Safety Rules into the relevant cooking steps where they apply (e.g. mention hand-washing when handling raw protein, temperature when cooking). Do NOT add standalone steps that are only about safety (e.g. no step that is just "Wash hands" or "Refrigerate within 2 hours"). Every step must be a real cooking action; safety is a brief mention within that step when relevant.
Do not change the core temperature requirements.`;
}
