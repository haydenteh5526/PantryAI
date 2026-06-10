import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Recipe } from "@/services/ai";

const FAVORITES_KEY = "saved-recipes";

export interface FavoriteRecipe extends Recipe {
  id: string;
  cuisine?: string;
  savedAt: string;
}

export async function getFavorites(): Promise<FavoriteRecipe[]> {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addFavorite(recipe: Recipe, cuisine?: string): Promise<void> {
  const favorites = await getFavorites();
  const entry: FavoriteRecipe = {
    ...recipe,
    id: Date.now().toString(),
    cuisine,
    savedAt: new Date().toISOString(),
  };
  favorites.unshift(entry);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export async function removeFavorite(id: string): Promise<void> {
  const favorites = await getFavorites();
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.filter((f) => f.id !== id)));
}

export async function isFavorited(title: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((f) => f.title === title);
}
