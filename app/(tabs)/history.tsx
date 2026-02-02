import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";

interface HistoryItem {
  id: string;
  title: string;
  completedAt: string;
  photoUri?: string;
  rating: number;
  notes: string;
  steps: string[];
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadHistory = async () => {
    try {
      const historyJson = await AsyncStorage.getItem("cooking-history");
      const historyData = historyJson ? JSON.parse(historyJson) : [];
      // Sort by most recent first
      setHistory(historyData.sort((a: HistoryItem, b: HistoryItem) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ));
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRecook = (item: HistoryItem) => {
    Alert.alert(
      "Cook Again?",
      `Would you like to cook ${item.title} again?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Let's Cook!",
          onPress: () => {
            router.push({
              pathname: "/active-cooking",
              params: {
                title: item.title,
                steps: JSON.stringify(item.steps),
              },
            });
          },
        },
      ]
    );
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this cooking session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedHistory = history.filter(item => item.id !== id);
              await AsyncStorage.setItem("cooking-history", JSON.stringify(updatedHistory));
              setHistory(updatedHistory);
            } catch (error) {
              console.error("Failed to delete history item:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold">History</Text>
        <Text className="text-text/60 mt-1">
          Your completed cooking sessions
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#84A98C" />
        }
      >
        {history.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="time-outline" size={64} color="#84A98C" />
            <Text className="text-text/60 text-lg mt-4 text-center px-6">
              No cooking history yet
            </Text>
            <Text className="text-text/60 text-sm mt-2 text-center px-6">
              Complete your first cooking session to see it here!
            </Text>
          </View>
        ) : (
          <View className="px-6 py-6">
            {history.map((item) => (
              <View key={item.id} className="bg-surface rounded-2xl mb-4 overflow-hidden">
                {/* Photo if available */}
                {item.photoUri && (
                  <Image
                    source={{ uri: item.photoUri }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                )}

                <View className="p-4">
                  {/* Title and Date */}
                  <Text className="text-text text-xl font-bold mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-text/60 text-sm mb-3">
                    {formatDate(item.completedAt)}
                  </Text>

                  {/* Rating */}
                  {item.rating > 0 && (
                    <View className="flex-row items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= item.rating ? "star" : "star-outline"}
                          size={16}
                          color={star <= item.rating ? "#fbbf24" : "#CAD2C5"}
                          style={{ marginRight: 2 }}
                        />
                      ))}
                    </View>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <Text className="text-text/60 text-sm mb-4">
                      {item.notes}
                    </Text>
                  )}

                  {/* Steps Count */}
                  <Text className="text-text/60 text-sm mb-4">
                    {item.steps.length} steps
                  </Text>

                  {/* Actions */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleRecook(item)}
                      className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center"
                    >
                      <Ionicons name="repeat" size={20} color="#FFFFFF" />
                      <Text className="text-surface font-semibold ml-2">Cook Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      className="bg-muted py-3 px-4 rounded-xl"
                    >
                      <Ionicons name="trash-outline" size={20} color="#E76F51" />
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
