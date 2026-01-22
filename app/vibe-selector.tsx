import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function VibeSelectorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleVibeSelect = (vibe: "eco" | "health" | "travel") => {
    const ingredients = params.ingredients as string;
    router.push({
      pathname: "/recipe-detail",
      params: {
        ingredients,
        vibe,
      },
    });
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <View className="pt-16 pb-6 px-6 border-b border-dark-border">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold">Choose Your Vibe</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-dark-textSecondary mb-6 text-center">
          Select how you want to cook with these ingredients
        </Text>

        {/* Clear Fridge (Eco) - Free */}
        <TouchableOpacity
          onPress={() => handleVibeSelect("eco")}
          className="bg-dark-card rounded-2xl p-6 mb-4 border-2 border-green-500"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="leaf" size={24} color="#10b981" />
              <Text className="text-white text-xl font-bold ml-3">
                Clear Fridge
              </Text>
            </View>
            <View className="bg-green-500 px-3 py-1 rounded-full">
              <Text className="text-black text-xs font-semibold">FREE</Text>
            </View>
          </View>
          <Text className="text-dark-textSecondary">
            Use all ingredients to minimize waste and save the planet
          </Text>
        </TouchableOpacity>

        {/* Get Lean (Health) - Premium */}
        <TouchableOpacity
          onPress={() => handleVibeSelect("health")}
          className="bg-dark-card rounded-2xl p-6 mb-4 border-2 border-blue-500 relative"
        >
          <View className="absolute top-4 right-4">
            <Ionicons name="lock-closed" size={20} color="#3b82f6" />
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="fitness" size={24} color="#3b82f6" />
              <Text className="text-white text-xl font-bold ml-3">
                Get Lean
              </Text>
            </View>
            <View className="bg-blue-500 px-3 py-1 rounded-full">
              <Text className="text-black text-xs font-semibold">PREMIUM</Text>
            </View>
          </View>
          <Text className="text-dark-textSecondary">
            High protein, macro-optimized recipes for your fitness goals
          </Text>
        </TouchableOpacity>

        {/* Travel (Culture) - Premium */}
        <TouchableOpacity
          onPress={() => handleVibeSelect("travel")}
          className="bg-dark-card rounded-2xl p-6 mb-4 border-2 border-purple-500 relative"
        >
          <View className="absolute top-4 right-4">
            <Ionicons name="lock-closed" size={20} color="#a855f7" />
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="airplane" size={24} color="#a855f7" />
              <Text className="text-white text-xl font-bold ml-3">Travel</Text>
            </View>
            <View className="bg-purple-500 px-3 py-1 rounded-full">
              <Text className="text-black text-xs font-semibold">PREMIUM</Text>
            </View>
          </View>
          <Text className="text-dark-textSecondary">
            Cultural twists - transform your ingredients into global cuisines
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
