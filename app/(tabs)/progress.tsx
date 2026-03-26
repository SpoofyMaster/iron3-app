import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store/useAppStore";
import {
  GlassCard,
  SectionHeader,
  MiniChart,
  MilestoneCard,
  PremiumLock,
  StreakBadge,
} from "@/components";
import { getTriRank, RANK_THRESHOLDS } from "@/lib/ranks";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

export default function ProgressScreen() {
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const rankHistory = useAppStore((s) => s.rankHistory);
  const weeklyVolumes = useAppStore((s) => s.weeklyVolumes);
  const milestones = useAppStore((s) => s.milestones);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const weeklyStats = useAppStore((s) => s.weeklyStats);
  const workoutLogs = useAppStore((s) => s.workoutLogs);
  const isPremium = useAppStore((s) => s.user.isPremium);

  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);

  const rankProgressData = useMemo(() => rankHistory.map((h) => h.overallPoints), [rankHistory]);
  const rankProgressLabels = useMemo(
    () => rankHistory.map((h) => new Date(h.date).toLocaleDateString("en-US", { month: "short" })),
    [rankHistory]
  );

  const weeklyBarData = useMemo(() => {
    return weeklyVolumes.map((w) => ({
      label: w.week,
      swim: w.swimHours,
      bike: w.bikeHours,
      run: w.runHours,
      total: w.swimHours + w.bikeHours + w.runHours,
    }));
  }, [weeklyVolumes]);

  const maxWeeklyTotal = useMemo(
    () => Math.max(...weeklyBarData.map((w) => w.total), 1),
    [weeklyBarData]
  );

  const totalHours = useMemo(() => {
    return weeklyVolumes.reduce((sum, w) => sum + w.swimHours + w.bikeHours + w.runHours, 0);
  }, [weeklyVolumes]);

  const disciplineBalance = useMemo(() => {
    const totalSwim = weeklyVolumes.reduce((s, w) => s + w.swimHours, 0);
    const totalBike = weeklyVolumes.reduce((s, w) => s + w.bikeHours, 0);
    const totalRun = weeklyVolumes.reduce((s, w) => s + w.runHours, 0);
    const total = totalSwim + totalBike + totalRun || 1;
    return {
      swim: Math.round((totalSwim / total) * 100),
      bike: Math.round((totalBike / total) * 100),
      run: Math.round((totalRun / total) * 100),
    };
  }, [weeklyVolumes]);

  const completionRate = useMemo(() => {
    const goal = 4;
    return Math.min(Math.round((weeklyStats.totalActivities / goal) * 100), 100);
  }, [weeklyStats.totalActivities]);

  const achievedMilestones = useMemo(() => milestones.filter((m) => m.achievedAt !== null), [milestones]);
  const upcomingMilestones = useMemo(() => milestones.filter((m) => m.achievedAt === null), [milestones]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Your training analytics</Text>
        </View>

        <PremiumLock isLocked={!isPremium} message="Unlock Full Analytics">
          <View style={styles.analyticsContent}>
            <View style={styles.streakRow}>
              <GlassCard style={styles.streakCard}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakValue}>{currentStreak}</Text>
                <Text style={styles.streakLabel}>Current Streak</Text>
              </GlassCard>
              <GlassCard style={styles.streakCard}>
                <Text style={styles.streakEmoji}>🏆</Text>
                <Text style={styles.streakValue}>{longestStreak}</Text>
                <Text style={styles.streakLabel}>Best Streak</Text>
              </GlassCard>
              <GlassCard style={styles.streakCard}>
                <Text style={styles.streakEmoji}>📊</Text>
                <Text style={styles.streakValue}>{completionRate}%</Text>
                <Text style={styles.streakLabel}>Completion</Text>
              </GlassCard>
            </View>

            <SectionHeader title="Rank Progression" />
            <GlassCard>
              <MiniChart
                data={rankProgressData}
                labels={rankProgressLabels}
                color={colors.primary}
                height={160}
              />
            </GlassCard>

            <SectionHeader title="Weekly Volume" />
            <GlassCard style={styles.volumeCard}>
              {weeklyBarData.map((w, i) => (
                <View key={i} style={styles.volumeRow}>
                  <Text style={styles.volumeLabel}>{w.label}</Text>
                  <View style={styles.volumeBarContainer}>
                    <View style={styles.volumeBarStack}>
                      <View
                        style={[
                          styles.volumeBarSegment,
                          {
                            width: `${(w.swim / maxWeeklyTotal) * 100}%`,
                            backgroundColor: colors.swim,
                            borderTopLeftRadius: 4,
                            borderBottomLeftRadius: 4,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.volumeBarSegment,
                          {
                            width: `${(w.bike / maxWeeklyTotal) * 100}%`,
                            backgroundColor: colors.bike,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.volumeBarSegment,
                          {
                            width: `${(w.run / maxWeeklyTotal) * 100}%`,
                            backgroundColor: colors.run,
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.volumeTotal}>{w.total.toFixed(1)}h</Text>
                </View>
              ))}
              <View style={styles.volumeLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.swim }]} />
                  <Text style={styles.legendText}>Swim</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.bike }]} />
                  <Text style={styles.legendText}>Bike</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.run }]} />
                  <Text style={styles.legendText}>Run</Text>
                </View>
              </View>
            </GlassCard>

            <SectionHeader title="Discipline Balance" />
            <GlassCard style={styles.balanceCard}>
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <View style={[styles.balanceCircle, { borderColor: colors.swim }]}>
                    <Text style={[styles.balancePct, { color: colors.swim }]}>{disciplineBalance.swim}%</Text>
                  </View>
                  <Text style={styles.balanceLabel}>Swim</Text>
                </View>
                <View style={styles.balanceItem}>
                  <View style={[styles.balanceCircle, { borderColor: colors.bike }]}>
                    <Text style={[styles.balancePct, { color: colors.bike }]}>{disciplineBalance.bike}%</Text>
                  </View>
                  <Text style={styles.balanceLabel}>Bike</Text>
                </View>
                <View style={styles.balanceItem}>
                  <View style={[styles.balanceCircle, { borderColor: colors.run }]}>
                    <Text style={[styles.balancePct, { color: colors.run }]}>{disciplineBalance.run}%</Text>
                  </View>
                  <Text style={styles.balanceLabel}>Run</Text>
                </View>
              </View>
              <View style={styles.balanceBar}>
                <View style={[styles.balanceSeg, { flex: disciplineBalance.swim, backgroundColor: colors.swim }]} />
                <View style={[styles.balanceSeg, { flex: disciplineBalance.bike, backgroundColor: colors.bike }]} />
                <View style={[styles.balanceSeg, { flex: disciplineBalance.run, backgroundColor: colors.run }]} />
              </View>
              <Text style={styles.balanceTotal}>{totalHours.toFixed(1)} total hours</Text>
            </GlassCard>

            <SectionHeader title="Monthly Summary" />
            <View style={styles.monthlyRow}>
              <GlassCard style={styles.monthlyCard}>
                <Ionicons name="water" size={20} color={colors.swim} />
                <Text style={styles.monthlyValue}>{(weeklyStats.swimDistance / 1000).toFixed(1)}km</Text>
                <Text style={styles.monthlyLabel}>Swim</Text>
              </GlassCard>
              <GlassCard style={styles.monthlyCard}>
                <Ionicons name="bicycle" size={20} color={colors.bike} />
                <Text style={styles.monthlyValue}>{weeklyStats.bikeDistance}km</Text>
                <Text style={styles.monthlyLabel}>Bike</Text>
              </GlassCard>
              <GlassCard style={styles.monthlyCard}>
                <Ionicons name="walk" size={20} color={colors.run} />
                <Text style={styles.monthlyValue}>{weeklyStats.runDistance}km</Text>
                <Text style={styles.monthlyLabel}>Run</Text>
              </GlassCard>
            </View>

            <SectionHeader title="Personal Bests" />
            <GlassCard style={styles.pbCard}>
              <View style={styles.pbRow}>
                <Ionicons name="flash" size={18} color={colors.swim} />
                <Text style={styles.pbText}>100m Swim: 1:18</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.pbRow}>
                <Ionicons name="flash" size={18} color={colors.bike} />
                <Text style={styles.pbText}>20km Bike: 36:00</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.pbRow}>
                <Ionicons name="flash" size={18} color={colors.run} />
                <Text style={styles.pbText}>5km Run: 21:00</Text>
              </View>
            </GlassCard>

            <SectionHeader title="Milestones Achieved" />
            <GlassCard>
              {achievedMilestones.slice(0, 6).map((m, idx) => (
                <View key={m.id}>
                  <MilestoneCard milestone={m} compact />
                  {idx < Math.min(achievedMilestones.length, 6) - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </GlassCard>

            {upcomingMilestones.length > 0 && (
              <>
                <SectionHeader title="Upcoming Milestones" />
                <GlassCard>
                  {upcomingMilestones.slice(0, 3).map((m, idx) => (
                    <View key={m.id}>
                      <MilestoneCard milestone={m} compact />
                      {idx < Math.min(upcomingMilestones.length, 3) - 1 && (
                        <View style={styles.divider} />
                      )}
                    </View>
                  ))}
                </GlassCard>
              </>
            )}
          </View>
        </PremiumLock>
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
    gap: 16,
  },
  header: {
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  analyticsContent: {
    gap: 16,
  },
  streakRow: {
    flexDirection: "row",
    gap: 10,
  },
  streakCard: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 16,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakValue: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
  },
  streakLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  volumeCard: {
    gap: 12,
  },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  volumeLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    width: 50,
  },
  volumeBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  volumeBarStack: {
    flexDirection: "row",
    height: "100%",
  },
  volumeBarSegment: {
    height: "100%",
  },
  volumeTotal: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    width: 36,
    textAlign: "right",
  },
  volumeLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  balanceCard: {
    alignItems: "center",
    gap: 16,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  balanceItem: {
    alignItems: "center",
    gap: 8,
  },
  balanceCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  balancePct: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  balanceBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  balanceSeg: {
    height: "100%",
  },
  balanceTotal: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  monthlyRow: {
    flexDirection: "row",
    gap: 10,
  },
  monthlyCard: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
  },
  monthlyValue: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  monthlyLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  pbCard: {
    gap: 0,
  },
  pbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  pbText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
});
