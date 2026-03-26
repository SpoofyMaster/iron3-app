import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DisciplineRank } from "@/types";
import { GlassCard } from "./GlassCard";
import { RankBadge } from "./RankBadge";
import { ProgressBar } from "./ProgressBar";
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
  disciplineColors,
  disciplineLabels,
  disciplineIcons,
} from "@/theme";
import { formatPoints, getNextRankTier } from "@/lib/ranks";
import { getGlowStyle } from "@/lib/effects";

interface DisciplineCardProps {
  rank: DisciplineRank;
  onPress?: () => void;
}

const ionIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: "water",
  bicycle: "bicycle",
  walk: "walk",
};

export function DisciplineCard({ rank, onPress }: DisciplineCardProps) {
  const dColors = disciplineColors[rank.discipline];
  const label = disciplineLabels[rank.discipline];
  const iconName = ionIconMap[disciplineIcons[rank.discipline]];
  const nextTier = getNextRankTier(rank.tier);

  return (
    <GlassCard onPress={onPress} variant="rank" rankColor={dColors.main}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconCircle, { backgroundColor: dColors.main + "20", borderColor: dColors.main + "40" }]}>
            <Ionicons name={iconName} size={22} color={dColors.main} />
          </View>
          <View>
            <Text style={styles.discipline}>{label}</Text>
            <Text style={[styles.tier, { color: rank.tierColor }]}>
              {rank.tier.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <RankBadge tier={rank.tier} tierColor={rank.tierColor} size="md" />
          <Text style={[styles.points, { color: dColors.main }]}>{formatPoints(rank.points)} XP</Text>
        </View>
      </View>
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressRank, { color: rank.tierColor }]}>
            {rank.tier}
          </Text>
          {nextTier && (
            <Text style={[styles.progressRank, { color: colors.textMuted }]}>
              {nextTier}
            </Text>
          )}
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.max(rank.progress * 100, 2)}%`,
                backgroundColor: dColors.main,
                shadowColor: dColors.main,
              },
            ]}
          />
        </View>
        {rank.pointsToNext !== null && (
          <Text style={styles.progressText}>
            {formatPoints(rank.pointsToNext)} pts to {nextTier}
          </Text>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  discipline: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  tier: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: 2,
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: "center",
    gap: 4,
  },
  points: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  progressSection: {
    gap: 6,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressRank: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: "right",
  },
});
