import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ingredient-confirmation" />
      <Stack.Screen name="vibe-selector" />
      <Stack.Screen name="recipe-detail" />
    </Stack>
  );
}
