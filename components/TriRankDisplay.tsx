import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TriRank } from "@/types";
import { RankBadge } from "./RankBadge";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";
import { formatPoints, getNextRankTier, getRankForPoints } from "@/lib/ranks";
import { getGlowStyle, getRankGradient } from "@/lib/effects";

interface TriRankDisplayProps {
  triRank: TriRank;
  size?: "compact" | "full";
}

export function TriRankDisplay({ triRank, size = "compact" }: TriRankDisplayProps) {
  const glowStyle = getGlowStyle(triRank.tierColor, "lg");
  const rankGrad = getRankGradient(triRank.tier);
  const nextTier = getNextRankTier(triRank.tier);
  const rankInfo = getRankForPoints(triRank.overallPoints);
  const isFull = size === "full";

  return (
    <View style={styles.container}>
      <View style={[styles.glowRing, glowStyle]}>
        <View style={[styles.outerRing, { borderColor: triRank.tierColor + "30" }]}>
          <View style={[styles.innerRing, { borderColor: triRank.tierColor + "60" }]}>
            <RankBadge
              tier={triRank.tier}
              tierColor={triRank.tierColor}
              size={isFull ? "xxl" : "xl"}
            />
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>TRI-RANK</Text>
        <Text
          style={[
            styles.tier,
            {
              color: triRank.tierColor,
              textShadowColor: triRank.tierColor,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            },
          ]}
        >
          {triRank.tier.toUpperCase()}
        </Text>
        <Text style={styles.points}>
          {formatPoints(triRank.overallPoints)} XP
        </Text>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressRank, { color: triRank.tierColor }]}>
            {triRank.tier}
          </Text>
          {nextTier && (
            <Text style={[styles.progressRank, { color: colors.textMuted }]}>
              {nextTier}
            </Text>
          )}
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[rankGrad[0], rankGrad[1], rankGrad[2]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              { width: `${Math.max(rankInfo.progress * 100, 2)}%` },
            ]}
          />
        </View>
        <View style={styles.progressXpRow}>
          <Text style={styles.xpText}>
            {rankInfo.pointsToNext != null
              ? `${formatPoints(triRank.overallPoints)} XP earned`
              : "MAX RANK"}
          </Text>
          {rankInfo.pointsToNext != null && (
            <Text style={styles.xpText}>
              {formatPoints(rankInfo.pointsToNext)} to next
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 12,
    gap: 14,
  },
  glowRing: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    gap: 2,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 3,
  },
  tier: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 3,
  },
  points: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 8,
    gap: 6,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressRank: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  progressXpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xpText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
