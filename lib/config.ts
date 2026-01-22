/**
 * Configuration file for API keys and environment variables
 * 
 * Currently using Google Gemini API (free tier) for testing
 * Switch to OpenAI for production if needed
 * 
 * Get your Gemini API key from: https://aistudio.google.com/app/apikey
 */

// Gemini API Configuration (Free Tier)
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyD5WPr5Swy_Shp68jFcx89gm-feuWPtHe4";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL_VISION = "gemini-2.5-flash"; // Fast, free tier
export const GEMINI_MODEL_TEXT = "gemini-2.5-flash"; // Fast, free tier

// OpenAI Configuration (for production switch)
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "your-openai-api-key-here";
export const OPENAI_API_URL = "https://api.openai.com/v1";
export const OPENAI_MODEL_VISION = "gpt-4o";
export const OPENAI_MODEL_TEXT = "gpt-4o";
