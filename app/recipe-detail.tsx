import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { generateRecipe, type Recipe } from "@/services/ai";
import { useEffect, useState } from "react";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (__DEV__) console.log("[RECIPE_DETAIL] Loading recipe with params:", {
        hasIngredients: !!params.ingredients,
        vibe: params.vibe,
        cuisine: params.cuisine,
      });
      
      try {
        const ingredients = JSON.parse(params.ingredients as string);
        const vibe = params.vibe as "eco" | "health" | "travel";
        const cuisine = params.cuisine as string;
        if (__DEV__) console.log("[RECIPE_DETAIL] Parsed ingredients:", ingredients);
        if (__DEV__) console.log("[RECIPE_DETAIL] Vibe:", vibe);
        if (__DEV__) console.log("[RECIPE_DETAIL] Cuisine:", cuisine);
        
        const generated = await generateRecipe(ingredients, vibe, cuisine);
        if (__DEV__) console.log("[RECIPE_DETAIL] Recipe generated successfully");
        setRecipe(generated);
      } catch (error: any) {
        if (__DEV__) console.error("[RECIPE_DETAIL] Failed to generate recipe:", {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        });
        // Set a fallback recipe so the screen doesn't show error state
        setRecipe({
          title: "Recipe Generation Error",
          calories: 500,
          ingredients: JSON.parse(params.ingredients as string) || [],
          steps: ["Please try again or go back to select different ingredients."],
          vibe: (params.vibe as string) || "eco",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.ingredients, params.vibe, params.cuisine]);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Ionicons name="hourglass" size={48} color="#84A98C" />
        <Text className="text-text mt-4">Generating recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="alert-circle" size={48} color="#84A98C" />
        <Text className="text-text mt-4 text-center">
          Failed to generate recipe
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-surface font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#2F3E46" />
          </TouchableOpacity>
          <Text className="text-text text-2xl font-bold">Recipe</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className="mb-6">
          <Text className="text-text text-3xl font-bold mb-2">
            {recipe.title.replace(/\*\*/g, '').replace(/\*/g, '')}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="flame" size={20} color="#E76F51" />
            <Text className="text-text ml-2 text-lg">
              {recipe.calories} calories
            </Text>
          </View>
          <Text className="text-muted text-sm mt-3">
            AI-generated recipe. Proceed with caution; safeguards have been applied.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-text text-xl font-semibold mb-4">
            Ingredients
          </Text>
          <View className="bg-surface rounded-2xl p-4">
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={index}
                className="flex-row items-center py-2 border-b border-muted last:border-b-0"
              >
                <View className="w-2 h-2 bg-primary rounded-full mr-3" />
                <Text className="text-text flex-1">{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-text text-xl font-semibold mb-4">
            Instructions Review
          </Text>
          <View className="bg-surface rounded-2xl p-4">
            {recipe.steps.map((step, index) => (
              <View key={index} className="mb-4 last:mb-0">
                <View className="flex-row items-start">
                  <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3 mt-1">
                    <Text className="text-surface font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-text flex-1 text-base leading-6">
                    {step.replace(/\*\*/g, '').replace(/\*/g, '')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      <View className="px-6 pb-6 pt-4 border-t border-muted">
        <TouchableOpacity 
          onPress={() => {
            if (__DEV__) console.log("[RECIPE_DETAIL] Start Cooking button pressed");
            router.push({
              pathname: "/active-cooking",
              params: {
                title: recipe.title,
                steps: JSON.stringify(recipe.steps),
              },
            });
          }}
          className="bg-primary py-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-surface font-semibold text-lg">
            Start Cooking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
