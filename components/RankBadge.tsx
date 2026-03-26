import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";
import { RankTier } from "@/types";
import { colors, fontSize, fontWeight } from "@/theme";
import { getGlowStyle, getRankGradient } from "@/lib/effects";

interface RankBadgeProps {
  tier: RankTier;
  tierColor: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  showLabel?: boolean;
  showPoints?: boolean;
  points?: number;
}

const sizeConfig = {
  sm: { badge: 32, icon: 12, labelSize: fontSize.xs, wingScale: 0.3 },
  md: { badge: 48, icon: 16, labelSize: fontSize.xs, wingScale: 0.5 },
  lg: { badge: 72, icon: 24, labelSize: fontSize.sm, wingScale: 0.7 },
  xl: { badge: 96, icon: 32, labelSize: fontSize.md, wingScale: 0.85 },
  xxl: { badge: 140, icon: 48, labelSize: fontSize.lg, wingScale: 1.0 },
};

const tierSymbols: Record<RankTier, string> = {
  Iron: "Fe",
  Bronze: "Br",
  Silver: "Ag",
  Gold: "Au",
  Platinum: "Pt",
  Diamond: "◇",
  Elite: "★",
  Legendary: "◆",
};

function ShieldShape({ size, tierColor, tier }: { size: number; tierColor: string; tier: RankTier }) {
  const gradientColors = getRankGradient(tier);
  const isLegendary = tier === "Legendary";
  const viewBox = "0 0 100 120";

  return (
    <Svg width={size} height={size * 1.2} viewBox={viewBox}>
      <Defs>
        <RadialGradient id="shieldGrad" cx="50%" cy="40%" r="60%">
          <Stop offset="0%" stopColor={gradientColors[2]} stopOpacity={isLegendary ? "0.9" : "0.7"} />
          <Stop offset="50%" stopColor={gradientColors[1]} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={gradientColors[0]} stopOpacity="0.2" />
        </RadialGradient>
        <RadialGradient id="innerGlow" cx="50%" cy="35%" r="40%">
          <Stop offset="0%" stopColor={tierColor} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={tierColor} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {/* Shield body */}
      <Path
        d="M50 5 L85 20 L90 55 L50 115 L10 55 L15 20 Z"
        fill="url(#shieldGrad)"
        stroke={tierColor}
        strokeWidth={isLegendary ? 2.5 : 1.5}
        strokeOpacity={isLegendary ? 0.9 : 0.6}
      />
      {/* Inner glow */}
      <Path
        d="M50 15 L78 27 L82 55 L50 105 L18 55 L22 27 Z"
        fill="url(#innerGlow)"
        stroke={tierColor}
        strokeWidth={0.5}
        strokeOpacity={0.3}
      />
      {/* Wing accents - left */}
      <Path
        d="M15 20 L2 30 L5 45 L10 55"
        fill="none"
        stroke={tierColor}
        strokeWidth={1.2}
        strokeOpacity={0.5}
        strokeLinecap="round"
      />
      {/* Wing accents - right */}
      <Path
        d="M85 20 L98 30 L95 45 L90 55"
        fill="none"
        stroke={tierColor}
        strokeWidth={1.2}
        strokeOpacity={0.5}
        strokeLinecap="round"
      />
      {isLegendary && (
        <>
          <Path
            d="M50 5 L85 20 L90 55 L50 115 L10 55 L15 20 Z"
            fill="none"
            stroke={tierColor}
            strokeWidth={1}
            strokeOpacity={0.4}
            strokeDasharray="3,3"
          />
        </>
      )}
    </Svg>
  );
}

export function RankBadge({
  tier,
  tierColor,
  size = "md",
  showLabel = false,
  showPoints = false,
  points,
}: RankBadgeProps) {
  const cfg = sizeConfig[size];
  const isLegendary = tier === "Legendary";
  const glowStyle = getGlowStyle(tierColor, isLegendary ? "lg" : "md");

  return (
    <View style={styles.container}>
      <View style={[styles.badgeWrapper, glowStyle, { width: cfg.badge, height: cfg.badge * 1.2 }]}>
        <ShieldShape size={cfg.badge} tierColor={tierColor} tier={tier} />
        <View style={[styles.symbolOverlay, { width: cfg.badge, height: cfg.badge * 1.2 }]}>
          <Text
            style={[
              styles.symbol,
              {
                fontSize: cfg.icon,
                color: tierColor,
                textShadowColor: tierColor,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: isLegendary ? 12 : 6,
              },
            ]}
          >
            {tierSymbols[tier]}
          </Text>
        </View>
      </View>
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: tierColor,
              fontSize: cfg.labelSize,
              textShadowColor: tierColor,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 4,
            },
          ]}
        >
          {tier.toUpperCase()}
        </Text>
      )}
      {showPoints && points !== undefined && (
        <Text style={styles.points}>
          {points.toLocaleString()} XP
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
  },
  badgeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  symbolOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "10%",
  },
  symbol: {
    fontWeight: fontWeight.extrabold,
  },
  label: {
    fontWeight: fontWeight.extrabold,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  points: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
});
