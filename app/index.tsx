import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth-context";

export default function Index() {
  const router = useRouter();
  const { session, loading, isGuest } = useAuth();

  useEffect(() => {
    if (loading) return;
    checkAppState();
  }, [loading, session]);

  const checkAppState = async () => {
    const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

    if (hasSeenOnboarding !== "true") {
      router.replace("/welcome");
    } else if (session || isGuest) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth");
    }
  };

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}
