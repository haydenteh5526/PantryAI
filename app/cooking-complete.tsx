import { View, Text, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/lib/auth-context";
import { saveCookingSession, createSocialPost, uploadPhoto } from "@/lib/database";

export default function CookingCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session, isGuest } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const recipe = {
    title: params.title as string,
    steps: JSON.parse(params.steps as string) as string[],
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to take a photo");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery access is required");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const saveToHistory = async (shareToSocial: boolean) => {
    setSaving(true);
    try {
      if (session && !isGuest) {
        // Authenticated: save to Supabase
        let photoUrl: string | null = null;
        if (photoUri) photoUrl = await uploadPhoto(photoUri);

        const { error } = await saveCookingSession({
          title: recipe.title,
          steps: recipe.steps,
          rating,
          notes,
          photo_url: photoUrl,
          completed_at: new Date().toISOString(),
        });
        if (error) throw new Error(error);

        if (shareToSocial && photoUrl) {
          await createSocialPost({ title: recipe.title, photo_url: photoUrl, rating, notes });
        }
      } else {
        // Guest: save to AsyncStorage
        const session = {
          id: Date.now().toString(),
          title: recipe.title,
          completedAt: new Date().toISOString(),
          photoUri,
          rating,
          notes,
          steps: recipe.steps,
        };
        const historyJson = await AsyncStorage.getItem("cooking-history");
        const history = historyJson ? JSON.parse(historyJson) : [];
        history.unshift(session);
        await AsyncStorage.setItem("cooking-history", JSON.stringify(history));
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (shareToSocial) {
        Alert.alert("Shared! 🎉", "Your recipe has been shared to the community.", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
        ]);
      } else {
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!photoUri) {
      Alert.alert("Photo required", "Please add a photo to share");
      return;
    }
    if (isGuest) {
      Alert.alert("Premium Feature 🌟", "Sign up to share your creations with the community!", [
        { text: "Maybe Later", style: "cancel" },
        { text: "Sign Up", onPress: () => router.push("/auth") },
      ]);
      return;
    }
    await saveToHistory(true);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 pb-6 px-6 border-b border-muted">
        <Text className="text-text text-3xl font-bold mb-2">Cooking Complete! 🎉</Text>
        <Text className="text-text/60 text-base">
          Great job making {recipe.title.replace(/\*\*/g, "").replace(/\*/g, "")}
        </Text>
      </View>

      <View className="flex-1 px-6 py-6">
        {/* Photo */}
        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">Share Your Creation</Text>
          {photoUri ? (
            <View className="relative">
              <Image source={{ uri: photoUri }} className="w-full h-64 rounded-2xl" resizeMode="cover" />
              <TouchableOpacity onPress={() => setPhotoUri(null)} className="absolute top-3 right-3 bg-black/60 p-2 rounded-full">
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-surface rounded-2xl p-8 items-center">
              <Ionicons name="camera" size={48} color="#84A98C" />
              <Text className="text-text/60 text-center mt-3 mb-4">Add a photo of your finished dish</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={takePhoto} className="bg-primary px-6 py-3 rounded-xl flex-1 items-center">
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                  <Text className="text-surface font-medium mt-1">Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickFromGallery} className="bg-background px-6 py-3 rounded-xl flex-1 items-center border border-muted">
                  <Ionicons name="images" size={20} color="#2F3E46" />
                  <Text className="text-text font-medium mt-1">Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Rating */}
        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">How was it?</Text>
          <View className="flex-row justify-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => { setRating(star); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                <Ionicons name={star <= rating ? "star" : "star-outline"} size={40} color={star <= rating ? "#fbbf24" : "#CAD2C5"} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">Notes (Optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any thoughts or modifications you made?"
            placeholderTextColor="#84A98C"
            multiline
            numberOfLines={3}
            className="bg-surface rounded-2xl p-4 text-text"
            style={{ textAlignVertical: "top" }}
          />
        </View>
      </View>

      {/* Actions */}
      <View className="px-6 pb-8 pt-4 border-t border-muted">
        {photoUri && (
          <TouchableOpacity onPress={handleShare} disabled={saving} className="bg-primary py-4 rounded-2xl items-center mb-3 active:opacity-80">
            <View className="flex-row items-center">
              <Ionicons name="share-social" size={24} color="#FFFFFF" />
              <Text className="text-surface font-bold text-lg ml-2">
                {saving ? "Saving..." : "Share to Community"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => saveToHistory(false)} disabled={saving} className="bg-surface py-4 rounded-2xl items-center active:opacity-80">
          <Text className="text-text font-semibold text-base">
            {saving ? "Saving..." : photoUri ? "Save to History Only" : "Skip & Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
