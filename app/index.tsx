import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      const userMode = await AsyncStorage.getItem("userMode");
      
      // Wait a brief moment for splash effect
      setTimeout(() => {
        if (hasSeenOnboarding !== "true") {
          // First time user - show onboarding
          router.replace("/welcome");
        } else if (!userMode) {
          // Seen onboarding but not authenticated - show auth
          router.replace("/auth");
        } else {
          // Returning user (guest or premium) - go to app
          router.replace("/(tabs)");
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to check app state:", error);
      router.replace("/welcome");
    }
  };

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}
