import { Stack } from "expo-router";
import { AuthProvider } from "@/lib/auth-context";
import { NetworkProvider } from "@/lib/network-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "../global.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="ingredient-confirmation" />
            <Stack.Screen name="vibe-selector" />
            <Stack.Screen name="recipe-detail" />
            <Stack.Screen name="scanning-ingredients" />
            <Stack.Screen name="active-cooking" />
            <Stack.Screen name="cooking-complete" />
            <Stack.Screen name="onboarding-1" />
            <Stack.Screen name="onboarding-2" />
            <Stack.Screen name="onboarding-3" />
          </Stack>
        </AuthProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
}
