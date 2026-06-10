import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState, useRef } from "react";
import { scanIngredients } from "@/services/ai";
import * as Haptics from "expo-haptics";

export default function ScanningIngredientsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  const imageUri = useMemo(() => {
    const raw = params.imageUri;
    if (typeof raw !== "string") return null;
    if (!raw || raw === "null" || raw === "undefined") return null;
    return raw;
  }, [params.imageUri]);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();

    // Dots animation
    Animated.loop(
      Animated.timing(dotsAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
    ).start();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      try {
        const ingredients = await scanIngredients(imageUri);
        if (cancelled) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace({
          pathname: "/ingredient-confirmation",
          params: { ingredients: JSON.stringify(ingredients) },
        });
      } catch (e: any) {
        if (cancelled) return;
        if (__DEV__) console.error("[SCAN_SCREEN] Failed to scan ingredients:", e);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setErrorMessage(e?.message || "Failed to scan ingredients.");
      }
    };

    run();
    return () => { cancelled = true; };
  }, [imageUri, router]);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  if (errorMessage) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="alert-circle" size={48} color="#E76F51" />
        <Text className="text-text text-lg font-semibold mt-4 text-center">{errorMessage}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-primary px-6 py-3 rounded-xl">
          <Text className="text-surface font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View className="bg-primary/10 w-28 h-28 rounded-full items-center justify-center">
            <Ionicons name="scan" size={56} color="#84A98C" />
          </View>
        </Animated.View>
      </Animated.View>
      <Text className="text-text text-xl font-bold mt-8">Scanning ingredients...</Text>
      <Text className="text-text/60 mt-2 text-center">AI is identifying food in your photo</Text>
    </View>
  );
}
