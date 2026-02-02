import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [userMode, setUserMode] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserMode();
  }, []);

  const loadUserMode = async () => {
    const mode = await AsyncStorage.getItem("userMode");
    setUserMode(mode);
  };

  // If camera is shown, display camera view
  if (showCamera) {
    if (!permission) {
      return (
        <SafeAreaView style={styles.container} edges={[]}>
          <View className="flex-1 bg-dark-bg" />
        </SafeAreaView>
      );
    }

    if (!permission.granted) {
      return (
        <SafeAreaView style={styles.container} edges={[]}>
          <View className="flex-1 bg-background items-center justify-center px-6">
            <Ionicons name="camera-outline" size={64} color="#84A98C" />
            <Text className="text-text text-xl font-bold mt-4 mb-2 text-center">
              Camera Permission Required
            </Text>
            <Text className="text-text/60 text-center mb-6">
              We need access to your camera to scan ingredients
            </Text>
            <TouchableOpacity
              onPress={requestPermission}
              className="bg-primary px-8 py-4 rounded-full"
            >
              <Text className="text-surface font-semibold">Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const handlePickFromGallery = async () => {
      try {
        setIsScanning(true);
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== "granted") {
          Alert.alert("Permission required", "Please allow photo library access.");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.9,
        });

        if (result.canceled) return;

        const uri = result.assets?.[0]?.uri;
        if (!uri) throw new Error("No image selected");

        setShowCamera(false);
        router.push({ pathname: "/scanning-ingredients", params: { imageUri: uri } });
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Failed to pick image.");
      } finally {
        setIsScanning(false);
      }
    };

    const handleScan = async () => {
      console.log("[CAMERA] Scan button pressed");
      
      if (!cameraRef.current) {
        console.error("[CAMERA] Camera ref is null");
        Alert.alert("Error", "Camera not ready");
        return;
      }

      console.log("[CAMERA] Camera ref is available");
      setIsScanning(true);
      
      try {
        console.log("[CAMERA] Attempting to capture photo...");
        const photo = await (cameraRef.current as any).takePictureAsync({
          quality: 0.8,
          base64: false,
          shutterSound: false,
        });

        console.log("[CAMERA] Photo capture result:", {
          uri: photo?.uri,
          width: photo?.width,
          height: photo?.height,
          hasUri: !!photo?.uri,
        });

        if (!photo?.uri) {
          console.error("[CAMERA] Photo captured but no URI returned");
          throw new Error("Failed to capture photo");
        }

        console.log("[CAMERA] Photo captured successfully:", photo.uri);

        setShowCamera(false);
        router.push({ pathname: "/scanning-ingredients", params: { imageUri: photo.uri } });
      } catch (error: any) {
        console.error("[ERROR] Scan error occurred:", {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        });
        
        if (error?.message?.includes("takePictureAsync") || error?.message?.includes("Camera")) {
          console.log("[FALLBACK] Camera capture failed, using mock data");
          setShowCamera(false);
          router.push({ pathname: "/scanning-ingredients" });
        } else {
          console.error("[ERROR] Non-camera error, showing alert to user");
          Alert.alert(
            "Error",
            error?.message || "Failed to scan ingredients. Please try again."
          );
        }
      } finally {
        console.log("[CAMERA] Scan process completed");
        setIsScanning(false);
      }
    };

    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={() => setIsScanning(false)}
        />
        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => setShowCamera(false)}
            className="absolute top-12 left-6 bg-black/50 p-3 rounded-full"
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.controls}>
            <View style={styles.controlRow}>
              <TouchableOpacity
                onPress={() => setFacing(facing === "back" ? "front" : "back")}
                style={styles.controlButton}
              >
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={{ width: 24 }} />
              <TouchableOpacity
                onPress={handleScan}
                disabled={isScanning}
                style={styles.scanButton}
              >
                {isScanning ? (
                  <Ionicons name="hourglass" size={32} color="#000" />
                ) : (
                  <View style={styles.scanButtonInner} />
                )}
              </TouchableOpacity>
              <View style={{ width: 24 }} />
              <TouchableOpacity
                onPress={handlePickFromGallery}
                disabled={isScanning}
                style={styles.controlButton}
              >
                <Ionicons name="images" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.instructionText}>
              {isScanning ? "Scanning..." : "Tap to scan ingredients"}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Home screen with Flo-inspired design
  return (
    <SafeAreaView className="flex-1 bg-background" edges={[]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-8">
          <Text className="text-text text-4xl font-bold mb-2">
            PantryAI
          </Text>
          <Text className="text-text/60 text-lg">
            Your AI cooking companion
          </Text>
        </View>

        {/* Main Cards */}
        <View className="px-6 pb-6">
          {/* Scan Ingredients Card */}
          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            className="bg-primary rounded-3xl p-6 mb-4 active:opacity-90"
            style={{
              shadowColor: '#84A98C',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-surface/20 w-16 h-16 rounded-full items-center justify-center">
                <Ionicons name="camera" size={32} color="#fff" />
              </View>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </View>
            <Text className="text-surface text-2xl font-bold mb-2">
              Scan Ingredients
            </Text>
            <Text className="text-surface/90 text-base">
              Take a photo of your fridge or pantry to detect ingredients
            </Text>
          </TouchableOpacity>

          {/* Premium Upsell Card (only for guests) */}
          {userMode === "guest" && (
            <TouchableOpacity
              onPress={() => router.push("/auth")}
              activeOpacity={0.8}
              className="mb-4 overflow-hidden rounded-3xl"
              style={{
                shadowColor: '#fbbf24',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={['#fbbf24', '#f59e0b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 24 }}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="bg-white/20 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold text-xs">UPGRADE</Text>
                  </View>
                  <Ionicons name="star" size={32} color="#fff" />
                </View>
                <Text className="text-white text-2xl font-bold mb-2">
                  Unlock Premium Features
                </Text>
                <Text className="text-white/90 text-base mb-4">
                  Get cloud sync, social sharing, and exclusive vibes
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold mr-2">Start Free Trial</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Manual Input Card */}
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/ingredient-confirmation",
                params: { ingredients: JSON.stringify([]) },
              });
            }}
            className="bg-surface rounded-3xl p-6 mb-4 active:opacity-90"
            style={{
              borderWidth: 2,
              borderColor: '#CAD2C5',
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-primary/10 w-16 h-16 rounded-full items-center justify-center">
                <Ionicons name="create-outline" size={32} color="#52796F" />
              </View>
              <Ionicons name="arrow-forward" size={24} color="#52796F" />
            </View>
            <Text className="text-text text-2xl font-bold mb-2">
              Enter Manually
            </Text>
            <Text className="text-text/60 text-base">
              Type in your ingredients if you prefer not to scan
            </Text>
          </TouchableOpacity>

          {/* Info Cards */}
          <View className="mt-6">
            <Text className="text-text text-xl font-semibold mb-4">
              How it works
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-start bg-surface rounded-2xl p-4">
                <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-accent font-bold text-lg">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold text-base mb-1">
                    Add Ingredients
                  </Text>
                  <Text className="text-text/60 text-sm">
                    Scan or type what you have
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start bg-surface rounded-2xl p-4 mt-3">
                <View className="bg-secondary/20 w-10 h-10 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-secondary font-bold text-lg">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold text-base mb-1">
                    Pick Your Style
                  </Text>
                  <Text className="text-text/60 text-sm">
                    Choose cuisine & preferences
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start bg-surface rounded-2xl p-4 mt-3">
                <View className="bg-accent/20 w-10 h-10 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-accent font-bold text-lg">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold text-base mb-1">
                    Start Cooking
                  </Text>
                  <Text className="text-text/60 text-sm">
                    Voice-guided step-by-step
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  controls: {
    alignItems: "center",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(42, 42, 42, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(42, 42, 42, 0.8)",
  },
  scanButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  instructionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
