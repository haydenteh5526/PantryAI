import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, session, isGuest, signOut } = useAuth();

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Guest User";
  const isAuthenticated = !!session && !isGuest;

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/auth");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold">Profile</Text>
      </View>
      <ScrollView className="flex-1 px-6 py-6">
        {/* User Info */}
        <View className="bg-surface rounded-2xl p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="bg-primary w-16 h-16 rounded-full items-center justify-center mr-4">
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-text text-xl font-bold">{displayName}</Text>
              {isAuthenticated ? (
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="text-primary font-semibold ml-1">Premium Member</Text>
                </View>
              ) : (
                <Text className="text-text/60 mt-1">Guest Mode</Text>
              )}
              {user?.email && <Text className="text-text/60 text-sm mt-1">{user.email}</Text>}
            </View>
          </View>

          {!isAuthenticated && (
            <TouchableOpacity onPress={() => router.push("/auth")} className="bg-primary py-3 rounded-xl items-center mt-2">
              <Text className="text-surface font-semibold">Sign Up for Premium ✨</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View className="bg-surface rounded-2xl p-6 mb-6">
          <Text className="text-text text-xl font-semibold mb-4">Health Stats</Text>
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
            <Text className="text-text/60 text-xs">Coming soon — track your macros automatically</Text>
          </View>
        </View>

        {/* Actions */}
        <View>
          {isAuthenticated ? (
            <TouchableOpacity onPress={handleSignOut} className="bg-danger/10 rounded-2xl p-6">
              <View className="flex-row items-center">
                <Ionicons name="log-out" size={20} color="#E76F51" />
                <Text className="text-danger ml-3 font-semibold">Sign Out</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                Alert.alert("View Onboarding", "Show the welcome tutorial again?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "View Tutorial", onPress: () => router.push("/welcome") },
                ]);
              }}
              className="bg-secondary/10 rounded-2xl p-6"
            >
              <View className="flex-row items-center">
                <Ionicons name="school" size={20} color="#E5989B" />
                <Text className="text-text ml-3 font-semibold">View Tutorial</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
