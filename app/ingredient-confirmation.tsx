import { useState, useEffect, useMemo } from "react";
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

// Common ingredients database
const COMMON_INGREDIENTS = [
  // Proteins
  "Chicken Breast", "Chicken Thighs", "Ground Beef", "Beef Steak", "Pork Chops",
  "Salmon", "Tuna", "Shrimp", "Eggs", "Tofu", "Bacon", "Turkey",
  // Vegetables
  "Broccoli", "Carrots", "Bell Peppers", "Onions", "Garlic", "Tomatoes",
  "Spinach", "Lettuce", "Cucumber", "Zucchini", "Mushrooms", "Potatoes",
  "Sweet Potatoes", "Celery", "Cabbage", "Cauliflower", "Green Beans",
  "Asparagus", "Eggplant", "Kale", "Corn", "Peas",
  // Fruits
  "Apples", "Bananas", "Oranges", "Lemons", "Limes", "Avocado", "Strawberries",
  "Blueberries", "Grapes", "Mango", "Pineapple", "Watermelon",
  // Grains & Carbs
  "Rice", "Pasta", "Bread", "Quinoa", "Oats", "Flour", "Tortillas",
  "Noodles", "Couscous", "Bulgur",
  // Dairy
  "Milk", "Cheese", "Butter", "Yogurt", "Cream", "Sour Cream", "Parmesan",
  "Mozzarella", "Cheddar",
  // Pantry Staples
  "Olive Oil", "Vegetable Oil", "Soy Sauce", "Salt", "Pepper", "Sugar",
  "Honey", "Vinegar", "Tomato Sauce", "Coconut Milk", "Chicken Broth",
  "Beef Broth", "Vegetable Broth",
  // Herbs & Spices
  "Basil", "Oregano", "Thyme", "Rosemary", "Cilantro", "Parsley",
  "Cumin", "Paprika", "Chili Powder", "Ginger", "Turmeric", "Cinnamon",
  // Beans & Legumes
  "Black Beans", "Kidney Beans", "Chickpeas", "Lentils", "Pinto Beans",
  // Nuts & Seeds
  "Almonds", "Walnuts", "Cashews", "Peanuts", "Sesame Seeds", "Chia Seeds",
];

export default function IngredientConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const addIngredient = (ingredientText?: string) => {
    const textToAdd = ingredientText || newIngredient.trim();
    if (textToAdd) {
      setIngredients([...ingredients, textToAdd]);
      setNewIngredient("");
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!newIngredient.trim()) return [];
    const searchTerm = newIngredient.toLowerCase();
    return COMMON_INGREDIENTS.filter(
      (item) =>
        item.toLowerCase().includes(searchTerm) &&
        !ingredients.includes(item)
    ).slice(0, 5); // Limit to 5 suggestions
  }, [newIngredient, ingredients]);

  // Suggested ingredients (popular items not yet added)
  const suggestedIngredients = useMemo(() => {
    const popular = [
      "Chicken Breast", "Eggs", "Garlic", "Onions", "Tomatoes",
      "Rice", "Olive Oil", "Salt", "Pepper", "Cheese",
    ];
    return popular.filter((item) => !ingredients.includes(item));
  }, [ingredients]);

  const handleContinue = () => {
    router.push({
      pathname: "/vibe-selector",
      params: { ingredients: JSON.stringify(ingredients) },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#2F3E46" />
          </TouchableOpacity>
          <Text className="text-text text-3xl font-bold">
            Confirm Ingredients
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-text/60 mb-4">
          Review and edit the detected ingredients:
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-6">
          {ingredients.map((ingredient, index) => (
            <View
              key={index}
              className="bg-surface px-4 py-2 rounded-full flex-row items-center"
              style={{
                borderWidth: 1,
                borderColor: '#CAD2C5',
              }}
            >
              <Text className="text-text mr-2">{ingredient}</Text>
              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <Ionicons name="close-circle" size={20} color="#52796F" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-text font-semibold mb-2">Add Ingredient</Text>
          <View className="relative">
            <View className="flex-row gap-2">
              <TextInput
                value={newIngredient}
                onChangeText={(text) => {
                  setNewIngredient(text);
                  setShowSuggestions(text.length > 0);
                }}
                placeholder="Enter ingredient name"
                placeholderTextColor="#A0A0A0"
                onSubmitEditing={() => addIngredient()}
                onFocus={() => setShowSuggestions(newIngredient.length > 0)}
                className="flex-1 bg-surface text-text px-4 py-3 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: '#CAD2C5',
                }}
              />
              <TouchableOpacity
                onPress={() => addIngredient()}
                className="bg-primary px-6 py-3 rounded-xl items-center justify-center"
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <View 
                className="absolute top-full left-0 right-14 mt-1 bg-surface rounded-xl z-50"
                style={{
                  borderWidth: 1,
                  borderColor: '#CAD2C5',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => addIngredient(suggestion)}
                    className={`px-4 py-3 ${index !== filteredSuggestions.length - 1 ? 'border-b border-muted' : ''}`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="search" size={16} color="#84A98C" />
                      <Text className="text-text ml-3">{suggestion}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Suggested Ingredients */}
        {suggestedIngredients.length > 0 && (
          <View className="mb-6">
            <Text className="text-text font-semibold mb-3">Suggested Ingredients</Text>
            <View className="flex-row flex-wrap gap-2">
              {suggestedIngredients.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => addIngredient(suggestion)}
                  className="bg-primary/10 px-4 py-2 rounded-full flex-row items-center"
                  style={{
                    borderWidth: 1,
                    borderColor: '#84A98C',
                  }}
                >
                  <Ionicons name="add-circle" size={16} color="#52796F" />
                  <Text className="text-accent ml-2">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View className="px-6 pb-6 pt-4 border-t border-muted">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={ingredients.length === 0}
          className={`py-4 rounded-xl items-center ${
            ingredients.length === 0
              ? "bg-muted"
              : "bg-primary"
          }`}
        >
          <Text
            className={`font-semibold text-lg ${
              ingredients.length === 0 ? "text-text/40" : "text-surface"
            }`}
          >
            Continue ({ingredients.length} ingredients)
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
