import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { getCookingHistory, deleteCookingSession, type CookingSession } from "@/lib/database";

interface LocalHistoryItem {
  id: string;
  title: string;
  completedAt: string;
  photoUri?: string;
  rating: number;
  notes: string;
  steps: string[];
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<LocalHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { session, isGuest } = useAuth();
  const router = useRouter();

  const loadHistory = async () => {
    try {
      if (session && !isGuest) {
        const data = await getCookingHistory();
        setHistory(data.map((d) => ({
          id: d.id,
          title: d.title,
          completedAt: d.completed_at,
          photoUri: d.photo_url ?? undefined,
          rating: d.rating,
          notes: d.notes,
          steps: d.steps,
        })));
      } else {
        const json = await AsyncStorage.getItem("cooking-history");
        const data = json ? JSON.parse(json) : [];
        setHistory(data.sort((a: LocalHistoryItem, b: LocalHistoryItem) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        ));
      }
    } catch (e) {
      if (__DEV__) console.error("Failed to load history:", e);
    }
  };

  useFocusEffect(useCallback(() => { loadHistory(); }, [session, isGuest]));

  const onRefresh = async () => { setRefreshing(true); await loadHistory(); setRefreshing(false); };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const handleRecook = (item: LocalHistoryItem) => {
    Alert.alert("Cook Again?", `Would you like to cook ${item.title} again?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Let's Cook!", onPress: () => router.push({ pathname: "/active-cooking", params: { title: item.title, steps: JSON.stringify(item.steps) } }) },
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Session", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          if (session && !isGuest) {
            await deleteCookingSession(id);
          } else {
            const updated = history.filter((i) => i.id !== id);
            await AsyncStorage.setItem("cooking-history", JSON.stringify(updated));
          }
          setHistory((h) => h.filter((i) => i.id !== id));
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold">History</Text>
        <Text className="text-text/60 mt-1">Your completed cooking sessions</Text>
      </View>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#84A98C" />}>
        {history.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="time-outline" size={64} color="#84A98C" />
            <Text className="text-text/60 text-lg mt-4 text-center px-6">No cooking history yet</Text>
            <Text className="text-text/60 text-sm mt-2 text-center px-6">Complete your first cooking session to see it here!</Text>
          </View>
        ) : (
          <View className="px-6 py-6">
            {history.map((item) => (
              <View key={item.id} className="bg-surface rounded-2xl mb-4 overflow-hidden">
                {item.photoUri && <Image source={{ uri: item.photoUri }} className="w-full h-48" resizeMode="cover" />}
                <View className="p-4">
                  <Text className="text-text text-xl font-bold mb-1">{item.title}</Text>
                  <Text className="text-text/60 text-sm mb-3">{formatDate(item.completedAt)}</Text>
                  {item.rating > 0 && (
                    <View className="flex-row items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons key={star} name={star <= item.rating ? "star" : "star-outline"} size={16} color={star <= item.rating ? "#fbbf24" : "#CAD2C5"} style={{ marginRight: 2 }} />
                      ))}
                    </View>
                  )}
                  {item.notes ? <Text className="text-text/60 text-sm mb-4">{item.notes}</Text> : null}
                  <Text className="text-text/60 text-sm mb-4">{item.steps.length} steps</Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => handleRecook(item)} className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center">
                      <Ionicons name="repeat" size={20} color="#FFFFFF" />
                      <Text className="text-surface font-semibold ml-2">Cook Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} className="bg-muted py-3 px-4 rounded-xl">
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
