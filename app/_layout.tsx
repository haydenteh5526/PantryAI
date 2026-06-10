import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { NetworkProvider } from "@/lib/network-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initSentry } from "@/lib/sentry";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync();
initSentry();

function AppContent() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;

  return (
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
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
}
