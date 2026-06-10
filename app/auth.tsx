import { View, Text, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, setGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (isSignUp && !name.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAuth = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = isSignUp
      ? await signUp(email.trim(), password, name.trim())
      : await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert(isSignUp ? "Sign Up Failed" : "Sign In Failed", error);
      return;
    }

    if (isSignUp) {
      Alert.alert("Check your email", "We sent a confirmation link to verify your account.", [
        { text: "OK", onPress: () => setIsSignUp(false) },
      ]);
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleContinueAsGuest = () => {
    setGuest();
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Animated.View className="flex-1 px-6 pt-12" style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              {/* Logo */}
              <View className="items-center mb-8">
                <LinearGradient
                  colors={["#84A98C", "#52796F"]}
                  style={{ width: 80, height: 80, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
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
                  {isSignUp ? "Sign up to unlock premium features" : "Sign in to access your recipes"}
                </Text>
              </View>

              {/* Form */}
              <View className="gap-4 mb-6">
                {isSignUp && (
                  <View>
                    <Text className="text-text font-semibold mb-2">Name</Text>
                    <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center" style={{ borderWidth: errors.name ? 1 : 0, borderColor: "#E76F51" }}>
                      <Ionicons name="person-outline" size={20} color="#84A98C" />
                      <TextInput value={name} onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }} placeholder="Your name" placeholderTextColor="#A0A0A0" className="flex-1 ml-3 text-text" autoCapitalize="words" />
                    </View>
                    {errors.name && <Text className="text-danger text-sm mt-1 ml-1">{errors.name}</Text>}
                  </View>
                )}

                <View>
                  <Text className="text-text font-semibold mb-2">Email</Text>
                  <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center" style={{ borderWidth: errors.email ? 1 : 0, borderColor: "#E76F51" }}>
                    <Ionicons name="mail-outline" size={20} color="#84A98C" />
                    <TextInput value={email} onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }} placeholder="your@email.com" placeholderTextColor="#A0A0A0" keyboardType="email-address" autoCapitalize="none" className="flex-1 ml-3 text-text" />
                  </View>
                  {errors.email && <Text className="text-danger text-sm mt-1 ml-1">{errors.email}</Text>}
                </View>

                <View>
                  <Text className="text-text font-semibold mb-2">Password</Text>
                  <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center" style={{ borderWidth: errors.password ? 1 : 0, borderColor: "#E76F51" }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#84A98C" />
                    <TextInput value={password} onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }} placeholder="••••••••" placeholderTextColor="#A0A0A0" secureTextEntry className="flex-1 ml-3 text-text" />
                  </View>
                  {errors.password && <Text className="text-danger text-sm mt-1 ml-1">{errors.password}</Text>}
                </View>
              </View>

              {/* Sign In/Up Button */}
              <TouchableOpacity onPress={handleAuth} disabled={loading} activeOpacity={0.8} className="mb-4">
                <LinearGradient
                  colors={["#84A98C", "#52796F"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 18, borderRadius: 16, alignItems: "center", opacity: loading ? 0.7 : 1 }}
                >
                  <Text className="text-surface font-bold text-lg">
                    {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Sign In/Up */}
              <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setErrors({}); }} className="py-3 items-center">
                <Text className="text-text/60">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <Text className="text-primary font-semibold">{isSignUp ? "Sign In" : "Sign Up"}</Text>
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-muted" />
                <Text className="text-text/60 mx-4">or</Text>
                <View className="flex-1 h-px bg-muted" />
              </View>

              {/* Guest Mode */}
              <TouchableOpacity onPress={handleContinueAsGuest} className="bg-surface rounded-2xl py-4 items-center mb-6" style={{ borderWidth: 2, borderColor: "#CAD2C5" }}>
                <Text className="text-text font-semibold">Continue as Guest 🚶</Text>
              </TouchableOpacity>

              {/* Feature list */}
              <View className="bg-primary/5 rounded-2xl p-4 mb-6">
                <Text className="text-text font-semibold mb-3">Premium Features:</Text>
                <View className="gap-2">
                  {[
                    { icon: "cloud", text: "Cloud sync across devices" },
                    { icon: "people", text: "Share to community" },
                    { icon: "fitness", text: "Health & Travel vibes" },
                    { icon: "analytics", text: "Nutrition tracking" },
                  ].map((feature, i) => (
                    <View key={i} className="flex-row items-center">
                      <Ionicons name={feature.icon as any} size={16} color="#E76F51" />
                      <Text className="text-text/60 text-sm ml-2 flex-1">{feature.text}</Text>
                      <View className="bg-secondary/20 px-2 py-1 rounded">
                        <Text className="text-secondary text-xs font-semibold">Pro</Text>
                      </View>
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
