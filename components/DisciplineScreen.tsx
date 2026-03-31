import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Discipline, DisciplineRank, Activity, PersonalBest } from "@/types";
import { GlassCard } from "./GlassCard";
import { RankBadge } from "./RankBadge";
import { ProgressBar } from "./ProgressBar";
import { SectionHeader } from "./SectionHeader";
import { ActivityRow } from "./ActivityRow";
import { PersonalBestRow } from "./PersonalBestRow";
import { MiniChart } from "./MiniChart";
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  disciplineColors,
  disciplineLabels,
} from "@/theme";
import { formatPoints, getNextRankTier, RANK_THRESHOLDS } from "@/lib/ranks";

interface DisciplineScreenProps {
  discipline: Discipline;
  rank: DisciplineRank;
  activities: Activity[];
  personalBests: PersonalBest[];
  historyPoints: number[];
  historyLabels: string[];
}

export function DisciplineScreenView({
  discipline,
  rank,
  activities,
  personalBests,
  historyPoints,
  historyLabels,
}: DisciplineScreenProps) {
  const dColors = disciplineColors[discipline];
  const label = disciplineLabels[discipline];
  const nextTier = getNextRankTier(rank.tier);

  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0);
  const totalPoints = activities.reduce((sum, a) => sum + a.pointsEarned, 0);
  const avgPace =
    activities.length > 0
      ? activities.reduce((sum, a) => sum + a.pace, 0) / activities.length
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: dColors.main }]}>{label}</Text>
          <Text style={styles.subtitle}>Discipline Rank</Text>
        </View>

        <GlassCard style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <View style={styles.rankLeft}>
              <View
                style={[
                  styles.rankGlow,
                  { borderColor: rank.tierColor + "40" },
                ]}
              >
                <RankBadge
                  tier={rank.tier}
                  tierColor={rank.tierColor}
                  size="lg"
                />
              </View>
              <View>
                <Text style={[styles.rankTier, { color: rank.tierColor }]}>
                  {rank.tier}
                </Text>
                <Text style={styles.rankPoints}>
                  {formatPoints(rank.points)} pts
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.progressSection}>
            <ProgressBar
              progress={rank.progress}
              color={dColors.main}
              height={10}
              showPercentage
              label={nextTier ? `Progress to ${nextTier}` : "Diamond Rank"}
              sublabel={
                rank.pointsToNext
                  ? `${formatPoints(rank.pointsToNext)} pts remaining`
                  : "Max rank achieved"
              }
            />
          </View>

          <View style={styles.tierStrip}>
            {RANK_THRESHOLDS.map((t) => (
              <View
                key={t.tier}
                style={[
                  styles.tierDot,
                  {
                    backgroundColor:
                      rank.points >= t.min ? t.color : colors.surfaceLight,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.tierLabels}>
            {RANK_THRESHOLDS.map((t) => (
              <Text
                key={t.tier}
                style={[
                  styles.tierLabel,
                  rank.tier === t.tier && { color: t.color, fontWeight: fontWeight.bold },
                ]}
              >
                {t.tier.slice(0, 2)}
              </Text>
            ))}
          </View>
        </GlassCard>

        <View style={styles.statsRow}>
          <GlassCard style={styles.statItem}>
            <Text style={styles.statValue}>{activities.length}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </GlassCard>
          <GlassCard style={styles.statItem}>
            <Text style={[styles.statValue, { color: dColors.main }]}>
              {totalPoints}
            </Text>
            <Text style={styles.statLabel}>Total Pts</Text>
          </GlassCard>
          <GlassCard style={styles.statItem}>
            <Text style={styles.statValue}>
              {discipline === "swim"
                ? `${(totalDistance / 1000).toFixed(1)}k`
                : `${totalDistance.toFixed(0)}`}
            </Text>
            <Text style={styles.statLabel}>
              {discipline === "swim" ? "Meters" : "KM"}
            </Text>
          </GlassCard>
        </View>

        <SectionHeader title="Rank Progress" />
        <GlassCard>
          <MiniChart
            data={historyPoints}
            labels={historyLabels}
            color={dColors.main}
            height={140}
          />
        </GlassCard>

        <SectionHeader title="Personal Bests" />
        <GlassCard>
          {personalBests.map((pb, idx) => (
            <View key={pb.category}>
              <PersonalBestRow pb={pb} color={dColors.main} />
              {idx < personalBests.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
          {personalBests.length === 0 && (
            <Text style={styles.emptyText}>
              Complete activities to set personal bests
            </Text>
          )}
        </GlassCard>

        <SectionHeader title="Activity History" />
        <GlassCard>
          {activities.map((activity, idx) => (
            <View key={activity.id}>
              <ActivityRow activity={activity} showDiscipline={false} />
              {idx < activities.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
          {activities.length === 0 && (
            <Text style={styles.emptyText}>No activities yet</Text>
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  rankCard: {
    gap: 16,
  },
  rankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rankGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rankTier: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  rankPoints: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: 2,
  },
  progressSection: {
    marginTop: 4,
  },
  tierStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    gap: 4,
  },
  tierDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  tierLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  tierLabel: {
    flex: 1,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: fontWeight.medium,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: "center",
    paddingVertical: 20,
  },
});
