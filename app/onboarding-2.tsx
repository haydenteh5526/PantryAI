import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get('window');

export default function Onboarding2Screen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
                shadowColor: '#E5989B',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 5,
              }}
            >
              <View className="items-center">
                {/* Mock Recipe Card */}
                <LinearGradient
                  colors={['#fef3c7', '#fde68a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    width: '100%',
                    marginBottom: 16,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center bg-white/80 px-3 py-2 rounded-full">
                      <Ionicons name="flame" size={20} color="#E76F51" />
                      <Text className="text-text font-bold ml-2">450 cal</Text>
                    </View>
                    <View className="flex-row items-center bg-white/80 px-3 py-2 rounded-full">
                      <Ionicons name="time" size={18} color="#84A98C" />
                      <Text className="text-text/60 ml-1 font-semibold">20 min</Text>
                    </View>
                  </View>
                  <Animated.View 
                    className="items-center py-6"
                    style={{ transform: [{ rotate: spin }] }}
                  >
                    <View style={{
                      backgroundColor: '#84A98C',
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#84A98C',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                    }}>
                      <Ionicons name="restaurant" size={40} color="#FFFFFF" />
                    </View>
                  </Animated.View>
                  <Text className="text-text font-bold text-center text-lg">
                    Savory Chicken Rice Bowl
                  </Text>
                </LinearGradient>

                {/* Cuisine Options */}
                <View className="flex-row gap-2 flex-wrap justify-center">
                  {[
                    { emoji: '🍜', name: 'Japanese', color: '#E5989B' },
                    { emoji: '🍝', name: 'Italian', color: '#84A98C' },
                    { emoji: '🌮', name: 'Mexican', color: '#E76F51' }
                  ].map((cuisine, i) => (
                    <LinearGradient
                      key={i}
                      colors={[cuisine.color + '30', cuisine.color + '20']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: cuisine.color, fontWeight: '600' }}>
                        {cuisine.emoji} {cuisine.name}
                      </Text>
                    </LinearGradient>
                  ))}
                </View>
              </View>
            </View>

            <Text className="text-text text-4xl font-bold text-center mb-4">
              AI-powered{" "}
              <Text style={{ color: '#fbbf24' }}>recipes</Text> ✨
            </Text>
            <Text className="text-text/60 text-lg text-center leading-7">
              Get personalized recipes based on your ingredients and preferred cuisine style.
            </Text>
          </Animated.View>

          {/* Progress & Navigation */}
          <View className="w-full gap-6">
            {/* Progress Dots */}
            <View className="flex-row items-center justify-center gap-2">
              <View className="bg-muted w-2 h-2 rounded-full" />
              <View className="bg-primary w-8 h-2 rounded-full" />
              <View className="bg-muted w-2 h-2 rounded-full" />
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => router.push("/onboarding-3")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#fbbf24', '#f59e0b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 20,
                  borderRadius: 16,
                  alignItems: 'center',
                  shadowColor: '#fbbf24',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
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
