import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold">Profile</Text>
      </View>
      <ScrollView className="flex-1 px-6 py-6">
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
          <TouchableOpacity className="bg-surface rounded-2xl p-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-text">About</Text>
              <Ionicons name="chevron-forward" size={20} color="#84A98C" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
