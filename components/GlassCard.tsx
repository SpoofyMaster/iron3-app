import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from "react-native";
import { colors, borderRadius } from "@/theme";
import { getGlowStyle } from "@/lib/effects";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: "default" | "light" | "accent" | "highlighted" | "rank";
  accentColor?: string;
  rankColor?: string;
}

export function GlassCard({
  children,
  style,
  onPress,
  variant = "default",
  accentColor,
  rankColor,
}: GlassCardProps) {
  const glowStyles = (variant === "rank" && rankColor)
    ? getGlowStyle(rankColor, "sm")
    : undefined;

  const cardStyle: StyleProp<ViewStyle>[] = [
    styles.card,
    variant === "light" && styles.cardLight,
    variant === "highlighted" && styles.cardHighlighted,
    variant === "rank" && rankColor && [
      styles.cardRank,
      { borderColor: rankColor + "30" },
      glowStyles,
    ],
    accentColor && { borderLeftColor: accentColor, borderLeftWidth: 3 },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 16,
    overflow: "hidden",
  },
  cardLight: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
  },
  cardHighlighted: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  cardRank: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});
