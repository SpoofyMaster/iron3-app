import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/theme";

export default function RootLayout() {
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
          name="onboarding"
          options={{ animation: "fade", gestureEnabled: false }}
        />
        <Stack.Screen
          name="paywall"
          options={{ animation: "slide_from_bottom", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
