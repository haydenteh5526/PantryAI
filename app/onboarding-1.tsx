import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get('window');

export default function Onboarding1Screen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for camera icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Skip Button */}
        <View className="px-6 py-4 items-end">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="px-4 py-2"
          >
            <Text className="text-text/60 font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-between px-6 pb-12">
          {/* Visual */}
          <Animated.View 
            className="items-center mt-8"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View className="bg-surface rounded-3xl p-8 mb-8" 
              style={{ 
                width: width - 80,
                shadowColor: '#84A98C',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 5,
              }}
            >
              <LinearGradient
                colors={['#E5989B20', '#84A98C20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 16,
                  padding: 48,
                  alignItems: 'center',
                }}
              >
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <View style={{
                    backgroundColor: '#84A98C15',
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="camera" size={64} color="#84A98C" />
                  </View>
                </Animated.View>
              </LinearGradient>
            </View>

            <Text className="text-text text-4xl font-bold text-center mb-4">
              Scan your{" "}
              <Text style={{ color: '#E76F51' }}>ingredients</Text> 📸
            </Text>
            <Text className="text-text/60 text-lg text-center leading-7">
              Just point your camera at your fridge or pantry. AI will identify what you have instantly.
            </Text>
          </Animated.View>

          {/* Progress & Navigation */}
          <View className="w-full gap-6">
            {/* Progress Dots */}
            <View className="flex-row items-center justify-center gap-2">
              <View className="bg-primary w-8 h-2 rounded-full" />
              <View className="bg-muted w-2 h-2 rounded-full" />
              <View className="bg-muted w-2 h-2 rounded-full" />
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => router.push("/onboarding-2")}
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
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Text className="text-surface font-bold text-lg">
                  Continue →
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
