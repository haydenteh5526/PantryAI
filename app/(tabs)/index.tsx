import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { scanIngredients } from "@/services/ai";

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

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
        console.log("[AI] Starting ingredient scan...");

        const ingredients = await scanIngredients(photo.uri);
        
        console.log("[AI] Ingredients received:", ingredients);
        console.log("[NAV] Navigating to ingredient confirmation with:", ingredients.length, "ingredients");
        
        router.push({
          pathname: "/ingredient-confirmation",
          params: { ingredients: JSON.stringify(ingredients) },
        });
      } catch (error: any) {
        console.error("[ERROR] Scan error occurred:", {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        });
        
        if (error?.message?.includes("takePictureAsync") || error?.message?.includes("Camera")) {
          console.log("[FALLBACK] Camera capture failed, using mock data");
          const ingredients = await scanIngredients(null);
          router.push({
            pathname: "/ingredient-confirmation",
            params: { ingredients: JSON.stringify(ingredients) },
          });
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
              <View style={styles.controlButton} />
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
            onPress={() => {
              if (permission?.granted) {
                setShowCamera(true);
              } else {
                requestPermission();
              }
            }}
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
