import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

export default function WelcomeScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale and fade in animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-between px-6 py-12">
          {/* Logo/Brand */}
          <Animated.View 
            className="items-center mt-8"
            style={{ 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }}
          >
            <Animated.View 
              style={{ 
                transform: [{ translateY: floatAnim }],
                marginBottom: 24,
              }}
            >
              <LinearGradient
                colors={['#84A98C', '#52796F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#84A98C',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                <Ionicons name="restaurant" size={48} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
            <Text className="text-text text-5xl font-bold text-center">
              PantryAI
            </Text>
          </Animated.View>

          {/* Hero Message */}
          <Animated.View 
            className="items-center"
            style={{ opacity: fadeAnim }}
          >
            <Text className="text-text text-3xl font-bold text-center mb-4">
              Never waste{" "}
              <Text 
                style={{
                  color: '#E76F51',
                  textShadowColor: 'rgba(231, 111, 81, 0.3)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 8,
                }}
              >
                food
              </Text>
              {"\n"}again
            </Text>
            <Text className="text-text/60 text-lg text-center leading-7">
              Transform your ingredients into delicious recipes with AI-powered cooking guidance
            </Text>
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View 
            className="w-full gap-4"
            style={{ opacity: fadeAnim }}
          >
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem("hasSeenOnboarding", "true");
                router.push("/onboarding-1");
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#84A98C', '#52796F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 20,
                  borderRadius: 16,
                  alignItems: 'center',
                  shadowColor: '#84A98C',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <Text className="text-surface font-bold text-lg">
                  Get Started ✨
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem("hasSeenOnboarding", "true");
                router.push("/(tabs)");
              }}
              className="py-5 rounded-2xl items-center"
            >
              <Text className="text-text/60 font-semibold">
                Skip for now
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
