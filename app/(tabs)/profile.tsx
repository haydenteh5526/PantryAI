import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-dark-bg">
      <View className="pt-16 pb-6 px-6 border-b border-dark-border">
        <Text className="text-white text-3xl font-bold">Profile</Text>
      </View>
      <ScrollView className="flex-1 px-6 py-6">
        <View className="mb-6">
          <Text className="text-white text-xl font-semibold mb-4">
            Health Stats
          </Text>
          <View className="bg-dark-card rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-dark-textSecondary">Daily Calories</Text>
              <Text className="text-white font-bold">--</Text>
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-dark-textSecondary">Protein</Text>
              <Text className="text-white font-bold">--</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-dark-textSecondary">Carbs</Text>
              <Text className="text-white font-bold">--</Text>
            </View>
            <View className="mt-4 pt-4 border-t border-dark-border">
              <Text className="text-dark-textSecondary text-xs">
                Premium feature - Upgrade to track your macros
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-white text-xl font-semibold mb-4">Settings</Text>
          <TouchableOpacity className="bg-dark-card rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white">Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-dark-card rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white">Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-dark-card rounded-2xl p-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-white">About</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
