import React from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme";

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "purple" | "blue";
}

const GRADIENT_CONFIGS = {
  default: {
    colors: [colors.gradientStart, colors.gradientMid, colors.gradientEnd, colors.background] as [string, string, ...string[]],
    locations: [0, 0.3, 0.6, 1] as [number, number, ...number[]],
  },
  purple: {
    colors: ["#1a0533", "#140228", colors.gradientMid, colors.background] as [string, string, ...string[]],
    locations: [0, 0.25, 0.5, 1] as [number, number, ...number[]],
  },
  blue: {
    colors: [colors.gradientMid, colors.gradientEnd, colors.background] as [string, string, ...string[]],
    locations: [0, 0.4, 1] as [number, number, ...number[]],
  },
};

export function GradientBackground({
  children,
  style,
  variant = "default",
}: GradientBackgroundProps) {
  const config = GRADIENT_CONFIGS[variant];

  return (
    <LinearGradient
      colors={config.colors}
      locations={config.locations}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
