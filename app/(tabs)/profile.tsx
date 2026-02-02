import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const [userMode, setUserMode] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const mode = await AsyncStorage.getItem("userMode");
    const name = await AsyncStorage.getItem("userName");
    setUserMode(mode);
    setUserName(name);
  };
  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold">Profile</Text>
      </View>
      <ScrollView className="flex-1 px-6 py-6">
        {/* User Info */}
        <View className="mb-6">
          <View className="bg-surface rounded-2xl p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-primary w-16 h-16 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-text text-xl font-bold">
                  {userName || (userMode === "guest" ? "Guest User" : "User")}
                </Text>
                <View className="flex-row items-center mt-1">
                  {userMode === "premium" ? (
                    <>
                      <Ionicons name="star" size={16} color="#fbbf24" />
                      <Text className="text-primary font-semibold ml-1">Premium Member</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="person-outline" size={16} color="#84A98C" />
                      <Text className="text-text/60 ml-1">Guest Mode</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            
            {userMode === "guest" && (
              <TouchableOpacity
                onPress={() => router.push("/auth")}
                className="bg-primary py-3 rounded-xl items-center mt-2"
              >
                <Text className="text-surface font-semibold">
                  Upgrade to Premium ✨
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-text text-xl font-semibold mb-4">
            Health Stats
          </Text>
          <View className="bg-surface rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-text/60">Daily Calories</Text>
              <Text className="text-text font-bold">--</Text>
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-text/60">Protein</Text>
              <Text className="text-text font-bold">--</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text/60">Carbs</Text>
              <Text className="text-text font-bold">--</Text>
            </View>
            <View className="mt-4 pt-4 border-t border-muted">
              <Text className="text-text/60 text-xs">
                Premium feature - Upgrade to track your macros
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-text text-xl font-semibold mb-4">Settings</Text>
          <TouchableOpacity className="bg-surface rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-text">Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#84A98C" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-surface rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-text">Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#84A98C" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-surface rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-text">About</Text>
              <Ionicons name="chevron-forward" size={20} color="#84A98C" />
            </View>
          </TouchableOpacity>

          {/* Account Actions */}
          {userMode === "premium" ? (
            <TouchableOpacity 
              className="bg-danger/10 rounded-2xl p-6"
              onPress={() => {
                Alert.alert(
                  "Sign Out",
                  "Are you sure you want to sign out?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Sign Out",
                      style: "destructive",
                      onPress: async () => {
                        await AsyncStorage.removeItem("userMode");
                        await AsyncStorage.removeItem("userEmail");
                        await AsyncStorage.removeItem("userName");
                        router.replace("/auth");
                      },
                    },
                  ]
                );
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="log-out" size={20} color="#E76F51" />
                  <Text className="text-danger ml-3">Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E76F51" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="bg-secondary/10 rounded-2xl p-6"
              onPress={async () => {
                Alert.alert(
                  "View Onboarding",
                  "This will show you the welcome tutorial again.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "View Tutorial",
                      onPress: async () => {
                        await AsyncStorage.removeItem("hasSeenOnboarding");
                        router.push("/welcome");
                      },
                    },
                  ]
                );
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="school" size={20} color="#E5989B" />
                  <Text className="text-text ml-3">View Tutorial</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E5989B" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
