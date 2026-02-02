import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get('window');

export default function Onboarding3Screen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;

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

    // Wave animation for voice
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Timer pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(timerPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(timerPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Content */}
        <View className="flex-1 items-center justify-between px-6 py-12">
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
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 5,
              }}
            >
              <View className="items-center">
                {/* Mock Cooking Interface */}
                <LinearGradient
                  colors={['#d1fae5', '#a7f3d0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    width: '100%',
                    marginBottom: 16,
                  }}
                >
                  <View className="items-center mb-4">
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                        shadowColor: '#10b981',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                      }}
                    >
                      <Text className="text-surface text-2xl font-bold">3</Text>
                    </LinearGradient>
                    <Text className="text-text text-center font-semibold">
                      Stir-fry chicken until golden brown 🍳
                    </Text>
                  </View>
                  
                  {/* Timer Display */}
                  <Animated.View style={{ transform: [{ scale: timerPulse }] }}>
                    <LinearGradient
                      colors={['#fef3c7', '#fde68a']}
                      style={{
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12,
                      }}
                    >
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="timer" size={28} color="#f59e0b" />
                        <Text style={{ 
                          fontSize: 36, 
                          fontWeight: 'bold',
                          color: '#f59e0b',
                          marginLeft: 12,
                        }}>5:00</Text>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  {/* Voice Indicator */}
                  <View className="flex-row items-center justify-center gap-2 bg-white/80 px-4 py-2 rounded-full">
                    <Animated.View style={{ opacity: waveOpacity }}>
                      <Ionicons name="radio-button-on" size={8} color="#10b981" />
                    </Animated.View>
                    <Ionicons name="volume-high" size={20} color="#10b981" />
                    <Text style={{ color: '#10b981', fontWeight: '600', fontSize: 14 }}>
                      Voice guidance active
                    </Text>
                    <Animated.View style={{ opacity: waveOpacity }}>
                      <Ionicons name="radio-button-on" size={8} color="#10b981" />
                    </Animated.View>
                  </View>
                </LinearGradient>

                {/* Action Buttons */}
                <View className="flex-row gap-2 w-full">
                  <LinearGradient
                    colors={['#E5989B30', '#E5989B20']}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="refresh" size={24} color="#E5989B" />
                  </LinearGradient>
                  <LinearGradient
                    colors={['#84A98C30', '#84A98C20']}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="timer" size={24} color="#84A98C" />
                  </LinearGradient>
                </View>
              </View>
            </View>

            <Text className="text-text text-4xl font-bold text-center mb-4">
              Voice-guided{" "}
              <Text style={{ color: '#10b981' }}>cooking</Text> 🎙️
            </Text>
            <Text className="text-text/60 text-lg text-center leading-7">
              Hands-free step-by-step instructions with automatic timers and voice guidance.
            </Text>
          </Animated.View>

          {/* Progress & Navigation */}
          <View className="w-full gap-6">
            {/* Progress Dots */}
            <View className="flex-row items-center justify-center gap-2">
              <View className="bg-muted w-2 h-2 rounded-full" />
              <View className="bg-muted w-2 h-2 rounded-full" />
              <View className="bg-primary w-8 h-2 rounded-full" />
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => router.push("/auth")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 20,
                  borderRadius: 16,
                  alignItems: 'center',
                  shadowColor: '#10b981',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <Text className="text-surface font-bold text-lg">
                  Get Started 🚀
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
