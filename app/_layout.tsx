import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { getSession, onAuthStateChange } from "@/lib/auth";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);

  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const setAuth = useAppStore((s) => s.setAuth);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setAuth(true, session.user.id);
        }
      } catch {
        // Supabase not configured yet — stay in mock/dev mode
        // isAuthenticated defaults to true so the app works without Supabase
      } finally {
        setInitializing(false);
      }
    };
    checkSession();
  }, [setAuth]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setAuth(true, session.user.id);
      } else if (event === "SIGNED_OUT") {
        setAuth(false);
      }
    });
    return unsubscribe;
  }, [setAuth]);

  // Redirect based on auth + onboarding state
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === ("auth" as string);

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login" as never);
    } else if (isAuthenticated && inAuthGroup) {
      if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments, initializing, router]);

  // Show loading splash while checking auth
  if (initializing) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="auth"
          options={{ animation: "fade", gestureEnabled: false }}
        />
        <Stack.Screen
          name="onboarding"
          options={{ animation: "fade", gestureEnabled: false }}
        />
        <Stack.Screen
          name="paywall"
          options={{ animation: "slide_from_bottom", presentation: "modal" }}
        />
        <Stack.Screen name="workout" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="events" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
