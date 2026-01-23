import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type CuisineStyle = "chinese" | "korean" | "japanese" | "western" | "italian" | "mexican" | "indian" | "thai";
type Vibe = "eco" | "health" | "travel";

export default function VibeSelectorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineStyle | null>(null);

  const cuisines: Array<{ id: CuisineStyle; name: string; icon: string; emoji: string }> = [
    { id: "chinese", name: "Chinese", icon: "restaurant", emoji: "🥢" },
    { id: "korean", name: "Korean", icon: "restaurant", emoji: "🍜" },
    { id: "japanese", name: "Japanese", icon: "restaurant", emoji: "🍱" },
    { id: "western", name: "Western", icon: "restaurant", emoji: "🍔" },
    { id: "italian", name: "Italian", icon: "restaurant", emoji: "🍝" },
    { id: "mexican", name: "Mexican", icon: "restaurant", emoji: "🌮" },
    { id: "indian", name: "Indian", icon: "restaurant", emoji: "🍛" },
    { id: "thai", name: "Thai", icon: "restaurant", emoji: "🍲" },
  ];

  const handleVibeSelect = (vibe: Vibe) => {
    const ingredients = params.ingredients as string;
    router.push({
      pathname: "/recipe-detail",
      params: {
        ingredients,
        vibe,
        cuisine: selectedCuisine || "any",
      },
    });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#2F3E46" />
          </TouchableOpacity>
          <Text className="text-text text-3xl font-bold">Choose Your Vibe</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-text/60 mb-6 text-center">
          Select your preferred style
        </Text>

        {/* Cuisine Style Selection */}
        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">
            Cuisine Style
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <TouchableOpacity
                key={cuisine.id}
                onPress={() => setSelectedCuisine(cuisine.id)}
                className={`rounded-2xl px-4 py-3 mb-2 ${
                  selectedCuisine === cuisine.id
                    ? "bg-primary"
                    : "bg-surface"
                }`}
                style={{
                  borderWidth: selectedCuisine === cuisine.id ? 2 : 1,
                  borderColor: selectedCuisine === cuisine.id ? "#84A98C" : "#CAD2C5",
                }}
              >
                <Text className="text-center">
                  <Text className="text-2xl mr-2">{cuisine.emoji}</Text>
                  <Text className={selectedCuisine === cuisine.id ? "text-surface font-semibold" : "text-text/60"}>
                    {cuisine.name}
                  </Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text className="text-text text-lg font-semibold mb-3 mt-4">
          Cooking Vibe
        </Text>

        {/* Clear Fridge (Eco) - Free */}
        <TouchableOpacity
          onPress={() => handleVibeSelect("eco")}
          className="bg-surface rounded-2xl p-6 mb-4 border-2 border-green-500"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="leaf" size={24} color="#10b981" />
              <Text className="text-text text-xl font-bold ml-3">
                Clear Fridge
              </Text>
            </View>
            <View className="bg-green-500 px-3 py-1 rounded-full">
              <Text className="text-surface text-xs font-semibold">FREE</Text>
            </View>
          </View>
          <Text className="text-text/60">
            Use all ingredients to minimize waste and save the planet
          </Text>
        </TouchableOpacity>

        {/* Get Lean (Health) - Premium */}
        <TouchableOpacity
          onPress={() => handleVibeSelect("health")}
          className="bg-surface rounded-2xl p-6 mb-4 border-2 border-blue-500 relative"
        >
          <View className="absolute top-4 right-4">
            <Ionicons name="lock-closed" size={20} color="#3b82f6" />
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="fitness" size={24} color="#3b82f6" />
              <Text className="text-text text-xl font-bold ml-3">
                Get Lean
              </Text>
            </View>
            <View className="bg-blue-500 px-3 py-1 rounded-full">
              <Text className="text-surface text-xs font-semibold">PREMIUM</Text>
            </View>
          </View>
          <Text className="text-text/60">
            High protein, macro-optimized recipes for your fitness goals
          </Text>
        </TouchableOpacity>

        {/* Travel (Culture) - Premium */}
        <TouchableOpacity
          onPress={() => handleVibeSelect("travel")}
          className="bg-surface rounded-2xl p-6 mb-4 border-2 border-primary relative"
        >
          <View className="absolute top-4 right-4">
            <Ionicons name="lock-closed" size={20} color="#84A98C" />
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="airplane" size={24} color="#84A98C" />
              <Text className="text-text text-xl font-bold ml-3">Travel</Text>
            </View>
            <View className="bg-primary px-3 py-1 rounded-full">
              <Text className="text-surface text-xs font-semibold">PREMIUM</Text>
            </View>
          </View>
          <Text className="text-text/60">
            Cultural twists - transform your ingredients into global cuisines
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
