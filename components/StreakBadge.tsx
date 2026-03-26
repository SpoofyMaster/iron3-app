import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ streak, size = "md" }: StreakBadgeProps) {
  const cfg = sizeMap[size];
  return (
    <View style={[styles.container, { paddingHorizontal: cfg.px, paddingVertical: cfg.py }]}>
      <Text style={[styles.fire, { fontSize: cfg.emoji }]}>🔥</Text>
      <Text style={[styles.count, { fontSize: cfg.font }]}>{streak}</Text>
    </View>
  );
}

const sizeMap = {
  sm: { emoji: 14, font: fontSize.sm, px: 8, py: 4 },
  md: { emoji: 18, font: fontSize.lg, px: 12, py: 6 },
  lg: { emoji: 28, font: fontSize.xxl, px: 16, py: 10 },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  fire: {},
  count: {
    color: colors.error,
    fontWeight: fontWeight.bold,
  },
});
