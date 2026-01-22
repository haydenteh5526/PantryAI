import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { generateRecipe } from "@/services/ai";
import { useEffect, useState } from "react";

interface Recipe {
  title: string;
  calories: number;
  ingredients: string[];
  steps: string[];
  vibe: string;
}

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const loadRecipe = async () => {
      console.log("[RECIPE_DETAIL] Loading recipe with params:", {
        hasIngredients: !!params.ingredients,
        vibe: params.vibe,
      });
      
      try {
        const ingredients = JSON.parse(params.ingredients as string);
        const vibe = params.vibe as "eco" | "health" | "travel";
        console.log("[RECIPE_DETAIL] Parsed ingredients:", ingredients);
        console.log("[RECIPE_DETAIL] Vibe:", vibe);
        
        const generated = await generateRecipe(ingredients, vibe);
        console.log("[RECIPE_DETAIL] Recipe generated successfully");
        setRecipe(generated);
      } catch (error: any) {
        console.error("[RECIPE_DETAIL] Failed to generate recipe:", {
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
  }, [params.ingredients, params.vibe]);

  if (loading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <Ionicons name="hourglass" size={48} color="#666" />
        <Text className="text-white mt-4">Generating recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center px-6">
        <Ionicons name="alert-circle" size={48} color="#666" />
        <Text className="text-white mt-4 text-center">
          Failed to generate recipe
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-white px-6 py-3 rounded-xl"
        >
          <Text className="text-black font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-bg">
      <View className="pt-16 pb-6 px-6 border-b border-dark-border">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Recipe</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold mb-2">
            {recipe.title}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="flame" size={20} color="#ff6b6b" />
            <Text className="text-white ml-2 text-lg">
              {recipe.calories} calories
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-white text-xl font-semibold mb-4">
            Ingredients
          </Text>
          <View className="bg-dark-card rounded-2xl p-4">
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={index}
                className="flex-row items-center py-2 border-b border-dark-border last:border-b-0"
              >
                <View className="w-2 h-2 bg-white rounded-full mr-3" />
                <Text className="text-white flex-1">{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-white text-xl font-semibold mb-4">
            Instructions
          </Text>
          <View className="bg-dark-card rounded-2xl p-4">
            {recipe.steps.map((step, index) => (
              <View key={index} className="mb-4 last:mb-0">
                <View className="flex-row items-start">
                  <View className="bg-white w-8 h-8 rounded-full items-center justify-center mr-3 mt-1">
                    <Text className="text-black font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-white flex-1 text-base leading-6">
                    {step}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {cookingMode ? (
        <View className="px-6 pb-6 pt-4 border-t border-dark-border">
          <View className="bg-dark-card rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-sm">
                Step {currentStep + 1} of {recipe.steps.length}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("[RECIPE_DETAIL] Exit cooking mode");
                  setCookingMode(false);
                  setCurrentStep(0);
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text className="text-white text-xl font-semibold mb-4">
              {recipe.steps[currentStep]}
            </Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                if (currentStep > 0) {
                  console.log("[RECIPE_DETAIL] Previous step");
                  setCurrentStep(currentStep - 1);
                }
              }}
              disabled={currentStep === 0}
              className={`flex-1 py-4 rounded-xl items-center ${
                currentStep === 0 ? "bg-dark-card opacity-50" : "bg-dark-card"
              }`}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={currentStep === 0 ? "#666" : "#fff"} 
              />
              <Text className={`mt-2 ${currentStep === 0 ? "text-dark-textSecondary" : "text-white"}`}>
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentStep < recipe.steps.length - 1) {
                  console.log("[RECIPE_DETAIL] Next step");
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={currentStep === recipe.steps.length - 1}
              className={`flex-1 py-4 rounded-xl items-center ${
                currentStep === recipe.steps.length - 1 ? "bg-dark-card opacity-50" : "bg-white"
              }`}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={currentStep === recipe.steps.length - 1 ? "#666" : "#000"} 
              />
              <Text className={`mt-2 font-semibold ${
                currentStep === recipe.steps.length - 1 ? "text-dark-textSecondary" : "text-black"
              }`}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log("[RECIPE_DETAIL] Finish Cooking button pressed");
              Alert.alert(
                "Cooking Complete!",
                `Great job! You've finished making ${recipe.title}. Hope you enjoyed it!`,
                [
                  {
                    text: "Back to Home",
                    onPress: () => {
                      console.log("[RECIPE_DETAIL] Navigating to home");
                      router.push("/(tabs)");
                    },
                  },
                ]
              );
            }}
            className="bg-green-500 py-4 rounded-xl items-center mt-3 active:opacity-80"
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text className="text-white font-semibold text-lg mt-1">
              Finish Cooking
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="px-6 pb-6 pt-4 border-t border-dark-border">
          <TouchableOpacity 
            onPress={() => {
              console.log("[RECIPE_DETAIL] Start Cooking button pressed");
              setCookingMode(true);
              setCurrentStep(0);
            }}
            className="bg-white py-4 rounded-xl items-center active:opacity-80"
          >
            <Text className="text-black font-semibold text-lg">
              Start Cooking
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
