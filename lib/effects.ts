import { Platform, ViewStyle } from "react-native";
import { RankTier } from "@/types";
import { colors } from "@/theme";

export function getGlowStyle(color: string, intensity: "sm" | "md" | "lg" | "xl" = "md"): ViewStyle {
  const config = {
    sm: { radius: 6, opacity: 0.3 },
    md: { radius: 12, opacity: 0.5 },
    lg: { radius: 20, opacity: 0.6 },
    xl: { radius: 30, opacity: 0.7 },
  };
  const { radius, opacity } = config[intensity];

  return Platform.select({
    web: {
      boxShadow: `0 0 ${radius}px ${Math.round(radius * 0.6)}px ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`,
    } as any,
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: Math.round(radius / 2),
    },
  }) as ViewStyle;
}

const RANK_GRADIENTS: Record<RankTier, readonly [string, string, string]> = {
  Iron: ["#4B5563", "#6B7280", "#9CA3AF"],
  Bronze: ["#92400E", "#B45309", "#D97706"],
  Silver: ["#475569", "#64748B", "#94A3B8"],
  Gold: ["#B45309", "#D97706", "#F59E0B"],
  Platinum: ["#4338CA", "#6366F1", "#818CF8"],
  Diamond: ["#0E7490", "#0891B2", "#22D3EE"],
  Legendary: ["#7F1D1D", "#E0115F", "#FBBF24"],
};

export function getRankGradient(rankTier: RankTier): readonly [string, string, string] {
  return RANK_GRADIENTS[rankTier];
}

export function getProgressGradient(fromRank: RankTier, toRank: RankTier): [string, string] {
  const fromColors = RANK_GRADIENTS[fromRank];
  const toColors = RANK_GRADIENTS[toRank];
  return [fromColors[2], toColors[1]];
}

export function getRankGlowColor(tier: RankTier): string {
  return colors.rankGlow[tier];
}
