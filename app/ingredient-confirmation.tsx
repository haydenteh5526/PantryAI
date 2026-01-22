import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function IngredientConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");

  useEffect(() => {
    if (params.ingredients) {
      try {
        const parsed = JSON.parse(params.ingredients as string);
        setIngredients(parsed);
      } catch (e) {
        setIngredients([]);
      }
    }
  }, [params.ingredients]);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    router.push({
      pathname: "/vibe-selector",
      params: { ingredients: JSON.stringify(ingredients) },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-bg"
    >
      <View className="pt-16 pb-6 px-6 border-b border-dark-border">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold">
            Confirm Ingredients
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-dark-textSecondary mb-4">
          Review and edit the detected ingredients:
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-6">
          {ingredients.map((ingredient, index) => (
            <View
              key={index}
              className="bg-dark-card px-4 py-2 rounded-full flex-row items-center"
            >
              <Text className="text-white mr-2">{ingredient}</Text>
              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-2">Add Ingredient</Text>
          <View className="flex-row gap-2">
            <TextInput
              value={newIngredient}
              onChangeText={setNewIngredient}
              placeholder="Enter ingredient name"
              placeholderTextColor="#666"
              onSubmitEditing={addIngredient}
              className="flex-1 bg-dark-card text-white px-4 py-3 rounded-xl"
            />
            <TouchableOpacity
              onPress={addIngredient}
              className="bg-white px-6 py-3 rounded-xl items-center justify-center"
            >
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-4 border-t border-dark-border">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={ingredients.length === 0}
          className={`py-4 rounded-xl items-center ${
            ingredients.length === 0
              ? "bg-dark-card"
              : "bg-white"
          }`}
        >
          <Text
            className={`font-semibold text-lg ${
              ingredients.length === 0 ? "text-dark-textSecondary" : "text-black"
            }`}
          >
            Continue ({ingredients.length} ingredients)
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
