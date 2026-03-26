import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RankTier } from "@/types";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

interface RankBadgeProps {
  tier: RankTier;
  tierColor: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

const sizeConfig = {
  sm: { badge: 28, icon: 14, fontSize: fontSize.xs },
  md: { badge: 40, icon: 20, fontSize: fontSize.sm },
  lg: { badge: 56, icon: 28, fontSize: fontSize.md },
  xl: { badge: 80, icon: 40, fontSize: fontSize.xl },
};

const tierSymbols: Record<RankTier, string> = {
  Iron: "Fe",
  Bronze: "Br",
  Silver: "Ag",
  Gold: "Au",
  Elite: "★",
  Legendary: "◆",
};

export function RankBadge({
  tier,
  tierColor,
  size = "md",
  showLabel = false,
}: RankBadgeProps) {
  const cfg = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: cfg.badge,
            height: cfg.badge,
            borderRadius: cfg.badge / 2,
            borderColor: tierColor,
            shadowColor: tierColor,
          },
        ]}
      >
        <Text
          style={[
            styles.symbol,
            { fontSize: cfg.icon, color: tierColor },
          ]}
        >
          {tierSymbols[tier]}
        </Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: tierColor }]}>{tier}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  badge: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  symbol: {
    fontWeight: fontWeight.bold,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
