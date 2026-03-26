import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";
import { getGlowStyle } from "@/lib/effects";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ streak, size = "md" }: StreakBadgeProps) {
  const cfg = sizeMap[size];
  const glowStyle = streak >= 7
    ? getGlowStyle("#F97316", "md")
    : streak >= 3
    ? getGlowStyle("#F97316", "sm")
    : {};

  return (
    <View style={[styles.container, { paddingHorizontal: cfg.px, paddingVertical: cfg.py }, glowStyle]}>
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
    backgroundColor: "rgba(249, 115, 22, 0.15)",
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.35)",
  },
  fire: {},
  count: {
    color: "#FB923C",
    fontWeight: fontWeight.extrabold,
  },
});
