import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="live"
        options={{ animation: "slide_from_bottom", gestureEnabled: false }}
      />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="share"
        options={{ animation: "slide_from_bottom", presentation: "modal" }}
      />
    </Stack>
  );
}
