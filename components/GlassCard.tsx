import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from "react-native";
import { colors, borderRadius } from "@/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: "default" | "light" | "accent";
  accentColor?: string;
}

export function GlassCard({
  children,
  style,
  onPress,
  variant = "default",
  accentColor,
}: GlassCardProps) {
  const cardStyle = [
    styles.card,
    variant === "light" && styles.cardLight,
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
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    padding: 16,
    overflow: "hidden",
  },
  cardLight: {
    backgroundColor: colors.surfaceGlassLight,
  },
});
