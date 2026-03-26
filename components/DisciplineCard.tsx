import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DisciplineRank, Discipline } from "@/types";
import { GlassCard } from "./GlassCard";
import { RankBadge } from "./RankBadge";
import { ProgressBar } from "./ProgressBar";
import {
  colors,
  fontSize,
  fontWeight,
  disciplineColors,
  disciplineLabels,
  disciplineIcons,
} from "@/theme";
import { formatPoints, getNextRankTier } from "@/lib/ranks";

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
    <GlassCard onPress={onPress} accentColor={dColors.main}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconCircle, { backgroundColor: dColors.main + "20" }]}>
            <Ionicons name={iconName} size={20} color={dColors.main} />
          </View>
          <View>
            <Text style={styles.discipline}>{label}</Text>
            <Text style={[styles.tier, { color: rank.tierColor }]}>
              {rank.tier}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <RankBadge tier={rank.tier} tierColor={rank.tierColor} size="md" />
          <Text style={styles.points}>{formatPoints(rank.points)}</Text>
        </View>
      </View>
      <View style={styles.progressSection}>
        <ProgressBar
          progress={rank.progress}
          color={dColors.main}
          height={6}
          label={nextTier ? `Next: ${nextTier}` : "Max Rank"}
          sublabel={
            rank.pointsToNext
              ? `${formatPoints(rank.pointsToNext)} pts away`
              : undefined
          }
        />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  discipline: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  tier: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "center",
    gap: 4,
  },
  points: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  progressSection: {
    marginTop: 4,
  },
});
