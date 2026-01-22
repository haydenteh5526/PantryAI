import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { scanIngredients } from "@/services/ai";

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

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
        <View className="flex-1 bg-dark-bg items-center justify-center px-6">
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text className="text-white text-xl font-bold mt-4 mb-2 text-center">
            Camera Permission Required
          </Text>
          <Text className="text-dark-textSecondary text-center mb-6">
            We need access to your camera to scan ingredients
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-white px-8 py-4 rounded-full"
          >
            <Text className="text-black font-semibold">Grant Permission</Text>
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
      // Take a photo using the camera ref
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

      // Scan ingredients from the photo
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
      
      // If camera capture fails, try with mock data
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
