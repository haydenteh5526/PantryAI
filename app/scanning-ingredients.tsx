import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { scanIngredients } from "@/services/ai";

export default function ScanningIngredientsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const imageUri = useMemo(() => {
    const raw = params.imageUri;
    if (typeof raw !== "string") return null;
    if (!raw || raw === "null" || raw === "undefined") return null;
    return raw;
  }, [params.imageUri]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const ingredients = await scanIngredients(imageUri);
        if (cancelled) return;

        router.replace({
          pathname: "/ingredient-confirmation",
          params: { ingredients: JSON.stringify(ingredients) },
        });
      } catch (e: any) {
        if (cancelled) return;
        if (__DEV__) console.error("[SCAN_SCREEN] Failed to scan ingredients:", e);
        setErrorMessage(e?.message || "Failed to scan ingredients.");
        Alert.alert("Error", e?.message || "Failed to scan ingredients.");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [imageUri, router]);

  if (errorMessage) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="alert-circle" size={48} color="#84A98C" />
        <Text className="text-text mt-4 text-center">{errorMessage}</Text>
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
    <View className="flex-1 bg-background items-center justify-center">
      <Ionicons name="hourglass" size={48} color="#84A98C" />
      <Text className="text-text mt-4">Scanning ingredients...</Text>
      <Text className="text-text/60 mt-2">Identifying food in your photo</Text>
    </View>
  );
}

