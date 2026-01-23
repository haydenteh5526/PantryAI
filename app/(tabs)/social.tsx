import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

interface SocialPost {
  id: string;
  title: string;
  photoUri: string;
  rating: number;
  notes: string;
  postedAt: string;
  user: string;
}

export default function SocialScreen() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const socialJson = await AsyncStorage.getItem("social-feed");
      const socialFeed = socialJson ? JSON.parse(socialJson) : [];
      setPosts(socialFeed);
    } catch (error) {
      console.error("Failed to load social feed:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold">Community</Text>
        <Text className="text-text/60 mt-1">
          Recipes shared by our cooking community
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#84A98C" />
        }
      >
        {posts.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="restaurant" size={64} color="#84A98C" />
            <Text className="text-text/60 text-lg mt-4 text-center px-6">
              No shared recipes yet
            </Text>
            <Text className="text-text/60 text-sm mt-2 text-center px-6">
              Complete a cooking session and share your creation!
            </Text>
          </View>
        ) : (
          <View className="px-6 py-6">
            {posts.map((post) => (
              <View key={post.id} className="bg-surface rounded-2xl mb-4 overflow-hidden">
                {/* Post Header */}
                <View className="flex-row items-center p-4 pb-3">
                  <View className="bg-primary w-10 h-10 rounded-full items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text font-semibold">{post.user}</Text>
                    <Text className="text-text/60 text-sm">
                      {formatDate(post.postedAt)}
                    </Text>
                  </View>
                </View>

                {/* Photo */}
                <Image
                  source={{ uri: post.photoUri }}
                  className="w-full h-80"
                  resizeMode="cover"
                />

                {/* Post Content */}
                <View className="p-4">
                  <Text className="text-text text-xl font-bold mb-2">
                    {post.title}
                  </Text>

                  {/* Rating */}
                  {post.rating > 0 && (
                    <View className="flex-row items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= post.rating ? "star" : "star-outline"}
                          size={16}
                          color={star <= post.rating ? "#fbbf24" : "#CAD2C5"}
                          style={{ marginRight: 2 }}
                        />
                      ))}
                    </View>
                  )}

                  {/* Notes */}
                  {post.notes && (
                    <Text className="text-text/60 text-sm">
                      {post.notes}
                    </Text>
                  )}

                  {/* Actions */}
                  <View className="flex-row items-center mt-4 pt-4 border-t border-muted">
                    <TouchableOpacity className="flex-row items-center mr-6">
                      <Ionicons name="heart-outline" size={24} color="#2F3E46" />
                      <Text className="text-text ml-2">Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={22} color="#2F3E46" />
                      <Text className="text-text ml-2">Comment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
