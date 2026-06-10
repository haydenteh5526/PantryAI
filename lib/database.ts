import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/services/ai";

// --- Cooking History ---

export interface CookingSession {
  id: string;
  title: string;
  steps: string[];
  rating: number;
  notes: string;
  photo_url: string | null;
  completed_at: string;
}

export async function saveCookingSession(session: Omit<CookingSession, "id">) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("cooking_history").insert({
    user_id: user.id,
    title: session.title,
    steps: session.steps,
    rating: session.rating,
    notes: session.notes,
    photo_url: session.photo_url,
    completed_at: session.completed_at,
  });
  return { error: error?.message ?? null };
}

export async function getCookingHistory(): Promise<CookingSession[]> {
  const { data } = await supabase
    .from("cooking_history")
    .select("id, title, steps, rating, notes, photo_url, completed_at")
    .order("completed_at", { ascending: false });
  return (data as CookingSession[]) ?? [];
}

export async function deleteCookingSession(id: string) {
  const { error } = await supabase.from("cooking_history").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// --- Saved Recipes ---

export interface SavedRecipe extends Recipe {
  id: string;
  cuisine?: string;
  created_at: string;
}

export async function saveRecipe(recipe: Recipe, cuisine?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("saved_recipes").insert({
    user_id: user.id,
    title: recipe.title,
    calories: recipe.calories,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    vibe: recipe.vibe,
    cuisine: cuisine ?? null,
    safety_rules: recipe.safetyRules ?? [],
  });
  return { error: error?.message ?? null };
}

export async function getSavedRecipes(): Promise<SavedRecipe[]> {
  const { data } = await supabase
    .from("saved_recipes")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as SavedRecipe[]) ?? [];
}

export async function deleteSavedRecipe(id: string) {
  const { error } = await supabase.from("saved_recipes").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// --- Social Posts ---

export interface SocialPost {
  id: string;
  user_id: string;
  title: string;
  photo_url: string;
  rating: number;
  notes: string;
  likes_count: number;
  posted_at: string;
}

export async function createSocialPost(post: { title: string; photo_url: string; rating: number; notes: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("social_posts").insert({
    user_id: user.id,
    ...post,
  });
  return { error: error?.message ?? null };
}

export async function getSocialFeed(): Promise<SocialPost[]> {
  const { data } = await supabase
    .from("social_posts")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(50);
  return (data as SocialPost[]) ?? [];
}

// --- Profile ---

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
}

export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data as Profile | null;
}

export async function updateProfile(updates: Partial<Pick<Profile, "display_name" | "avatar_url">>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  return { error: error?.message ?? null };
}

// --- Photo Upload ---

export async function uploadPhoto(uri: string, bucket = "recipe-photos"): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const ext = uri.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: `image/${ext}`,
  });
  if (error) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
