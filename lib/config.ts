/**
 * Configuration file for API keys and environment variables
 * Values are read from .env via app.config.js → expo-constants extra.
 *
 * Get your Gemini API key from: https://aistudio.google.com/app/apikey
 */

import Constants from "expo-constants";

type Extra = { GEMINI_API_KEY?: string; OPENAI_API_KEY?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

// Gemini API Configuration (Free Tier)
export const GEMINI_API_KEY =
  extra.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL_VISION = "gemini-2.5-flash";
export const GEMINI_MODEL_TEXT = "gemini-2.5-flash";

// OpenAI Configuration (for production switch)
export const OPENAI_API_KEY =
  extra.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
export const OPENAI_API_URL = "https://api.openai.com/v1";
export const OPENAI_MODEL_VISION = "gpt-4o";
export const OPENAI_MODEL_TEXT = "gpt-4o";
