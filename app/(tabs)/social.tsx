import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SocialScreen() {
  return (
    <View className="flex-1 bg-dark-bg">
      <View className="pt-16 pb-6 px-6 border-b border-dark-border">
        <Text className="text-white text-3xl font-bold">Social Feed</Text>
      </View>
      <ScrollView className="flex-1 px-6 py-6">
        <View className="items-center justify-center py-20">
          <Ionicons name="people-outline" size={64} color="#666" />
          <Text className="text-dark-textSecondary text-lg mt-4 text-center">
            Social feed coming soon
          </Text>
          <Text className="text-dark-textSecondary text-sm mt-2 text-center">
            Share your creations and discover recipes from others
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
