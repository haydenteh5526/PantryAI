import { View, Text, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
  }, []);

  const handleContinueAsGuest = async () => {
    await AsyncStorage.setItem("userMode", "guest");
    router.replace("/(tabs)");
  };

  const handleAuth = async () => {
    // For now, just mock authentication
    // In production, this would call your backend API
    await AsyncStorage.setItem("userMode", "premium");
    await AsyncStorage.setItem("userEmail", email);
    if (isSignUp && name) {
      await AsyncStorage.setItem("userName", name);
    }
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View 
              className="flex-1 px-6 pt-12"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
              {/* Logo */}
              <View className="items-center mb-8">
                <LinearGradient
                  colors={['#84A98C', '#52796F']}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#84A98C',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Ionicons name="restaurant" size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>

              {/* Title */}
              <View className="mb-8">
                <Text className="text-text text-3xl font-bold text-center mb-2">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </Text>
                <Text className="text-text/60 text-center">
                  {isSignUp 
                    ? "Sign up to unlock premium features" 
                    : "Sign in to access your recipes"}
                </Text>
              </View>

              {/* Form */}
              <View className="gap-4 mb-6">
                {isSignUp && (
                  <View>
                    <Text className="text-text font-semibold mb-2">Name</Text>
                    <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center">
                      <Ionicons name="person-outline" size={20} color="#84A98C" />
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                        placeholderTextColor="#A0A0A0"
                        className="flex-1 ml-3 text-text"
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                )}

                <View>
                  <Text className="text-text font-semibold mb-2">Email</Text>
                  <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center">
                    <Ionicons name="mail-outline" size={20} color="#84A98C" />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="your@email.com"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="flex-1 ml-3 text-text"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-text font-semibold mb-2">Password</Text>
                  <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={20} color="#84A98C" />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry
                      className="flex-1 ml-3 text-text"
                    />
                  </View>
                </View>
              </View>

              {/* Sign In/Up Button */}
              <TouchableOpacity
                onPress={handleAuth}
                activeOpacity={0.8}
                className="mb-4"
              >
                <LinearGradient
                  colors={['#84A98C', '#52796F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
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
                    {isSignUp ? "Create Account" : "Sign In"} ✨
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Sign In/Up */}
              <TouchableOpacity
                onPress={() => setIsSignUp(!isSignUp)}
                className="py-3 items-center"
              >
                <Text className="text-text/60">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <Text className="text-primary font-semibold">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-muted" />
                <Text className="text-text/60 mx-4">or</Text>
                <View className="flex-1 h-px bg-muted" />
              </View>

              {/* Guest Mode */}
              <TouchableOpacity
                onPress={handleContinueAsGuest}
                className="bg-surface rounded-2xl py-4 items-center mb-6"
                style={{
                  borderWidth: 2,
                  borderColor: '#CAD2C5',
                }}
              >
                <Text className="text-text font-semibold">
                  Continue as Guest 🚶
                </Text>
              </TouchableOpacity>

              {/* Guest Mode Features */}
              <View className="bg-primary/5 rounded-2xl p-4 mb-6">
                <Text className="text-text font-semibold mb-3">Premium Features:</Text>
                <View className="gap-2">
                  {[
                    { icon: "cloud", text: "Cloud sync across devices", premium: true },
                    { icon: "people", text: "Share to community", premium: true },
                    { icon: "fitness", text: "Health & Travel vibes", premium: true },
                    { icon: "analytics", text: "Nutrition tracking", premium: true },
                  ].map((feature, i) => (
                    <View key={i} className="flex-row items-center">
                      <Ionicons 
                        name={feature.icon as any} 
                        size={16} 
                        color={feature.premium ? "#E76F51" : "#84A98C"} 
                      />
                      <Text className="text-text/60 text-sm ml-2 flex-1">
                        {feature.text}
                      </Text>
                      {feature.premium && (
                        <View className="bg-secondary/20 px-2 py-1 rounded">
                          <Text className="text-secondary text-xs font-semibold">Pro</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
