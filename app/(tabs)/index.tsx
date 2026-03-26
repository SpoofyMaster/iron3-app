import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import {
  TriRankDisplay,
  DisciplineCard,
  SectionHeader,
  ActivityRow,
  StatCard,
  GlassCard,
  PremiumBanner,
  StreakBadge,
  GradientBackground,
} from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { formatDistance } from "@/lib/scoring";
import { getTriRank, getRankForPoints } from "@/lib/ranks";
import { MOTIVATIONAL_MESSAGES } from "@/lib/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);
  const activities = useAppStore((s) => s.activities);
  const weeklyStats = useAppStore((s) => s.weeklyStats);
  const isPremium = useAppStore((s) => s.user.isPremium);
  const displayName = useAppStore((s) => s.user.displayName);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const raceGoal = useAppStore((s) => s.raceGoal);
  const milestones = useAppStore((s) => s.milestones);

  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);

  const daysToRace = useMemo(() => {
    if (!raceGoal?.raceDate) return null;
    const diff = new Date(raceGoal.raceDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [raceGoal]);

  const nextMilestone = useMemo(() => {
    return milestones.find((m) => m.achievedAt === null);
  }, [milestones]);

  const motivationalMsg = useMemo(() => {
    const idx = Math.floor(Date.now() / (1000 * 60 * 60)) % MOTIVATIONAL_MESSAGES.length;
    return MOTIVATIONAL_MESSAGES[idx];
  }, []);

  const weeklyGoal = 4;
  const weeklyProgress = useMemo(
    () => Math.min(weeklyStats.totalActivities / weeklyGoal, 1),
    [weeklyStats.totalActivities]
  );

  const lastSwim = useMemo(() => activities.filter((a) => a.discipline === "swim")[0], [activities]);
  const lastBike = useMemo(() => activities.filter((a) => a.discipline === "bike")[0], [activities]);
  const lastRun = useMemo(() => activities.filter((a) => a.discipline === "run")[0], [activities]);

  const trainingFocus = useMemo(() => {
    const now = Date.now();
    const swimDays = lastSwim ? Math.floor((now - new Date(lastSwim.date).getTime()) / 86400000) : 99;
    const bikeDays = lastBike ? Math.floor((now - new Date(lastBike.date).getTime()) / 86400000) : 99;
    const runDays = lastRun ? Math.floor((now - new Date(lastRun.date).getTime()) / 86400000) : 99;
    const max = Math.max(swimDays, bikeDays, runDays);
    if (max === swimDays) return { discipline: "Swim", icon: "water" as const, color: colors.swim, days: swimDays };
    if (max === bikeDays) return { discipline: "Bike", icon: "bicycle" as const, color: colors.bike, days: bikeDays };
    return { discipline: "Run", icon: "walk" as const, color: colors.run, days: runDays };
  }, [lastSwim, lastBike, lastRun]);

  const levelInfo = useMemo(() => {
    const totalXp = triRank.overallPoints;
    const level = Math.floor(totalXp / 500) + 1;
    const levelXp = totalXp % 500;
    return { level, progress: levelXp / 500, xp: levelXp };
  }, [triRank.overallPoints]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header Area */}
        <GradientBackground style={styles.headerGradient} variant="purple">
          {/* XP Level Bar */}
          <View style={styles.levelBar}>
            <View style={styles.levelLeft}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelNumber}>{levelInfo.level}</Text>
              </View>
              <View style={styles.levelProgress}>
                <View style={styles.levelTrack}>
                  <LinearGradient
                    colors={[colors.glowPurple, colors.glowCyan]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.levelFill, { width: `${Math.max(levelInfo.progress * 100, 3)}%` }]}
                  />
                </View>
                <Text style={styles.levelXp}>{levelInfo.xp}/500 XP</Text>
              </View>
            </View>
            <StreakBadge streak={currentStreak} size="md" />
          </View>

          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{displayName}</Text>
            </View>
          </View>

          {daysToRace !== null && (
            <GlassCard style={styles.raceCountdown} variant="highlighted">
              <View style={styles.raceRow}>
                <View style={styles.raceIcon}>
                  <Text style={styles.raceEmoji}>🏁</Text>
                </View>
                <View style={styles.raceInfo}>
                  <Text style={styles.raceDays}>{daysToRace} days</Text>
                  <Text style={styles.raceLabel}>
                    to {raceGoal?.raceName ?? "Race Day"}
                  </Text>
                </View>
                <View style={styles.racePulse} />
              </View>
            </GlassCard>
          )}

          <GlassCard style={styles.motivational}>
            <Text style={styles.motivationalText}>💬 {motivationalMsg}</Text>
          </GlassCard>

          {/* HUGE TriRank Display */}
          <TriRankDisplay triRank={triRank} />
        </GradientBackground>

        {/* Weekly Progress Section */}
        <View style={styles.weeklyRow}>
          <GlassCard style={styles.consistencyCard}>
            <Text style={styles.consistencyTitle}>Weekly Goal</Text>
            <View style={styles.ringContainer}>
              <View style={styles.ringOuter}>
                <View
                  style={[
                    styles.ringProgress,
                    {
                      transform: [{ rotate: `${weeklyProgress * 360}deg` }],
                      borderTopColor: colors.glowPurple,
                      borderRightColor: weeklyProgress > 0.25 ? colors.glowPurple : "transparent",
                      borderBottomColor: weeklyProgress > 0.5 ? colors.glowCyan : "transparent",
                      borderLeftColor: weeklyProgress > 0.75 ? colors.glowCyan : "transparent",
                    },
                  ]}
                />
                <View style={styles.ringInner}>
                  <Text style={styles.ringText}>{weeklyStats.totalActivities}/{weeklyGoal}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.consistencyLabel}>sessions</Text>
          </GlassCard>
          <View style={styles.weeklyStatsCol}>
            <StatCard
              icon="flame"
              iconColor="#F97316"
              label="Activities"
              value={String(weeklyStats.totalActivities)}
              subtitle="This week"
            />
            <StatCard
              icon="trending-up"
              iconColor={colors.glowCyan}
              label="Points"
              value={String(weeklyStats.totalPoints)}
              subtitle="This week"
            />
          </View>
        </View>

        {nextMilestone && (
          <GlassCard style={styles.milestonePreview} variant="highlighted">
            <View style={styles.milestoneRow}>
              <Text style={styles.milestoneEmoji}>{nextMilestone.icon}</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>Next: {nextMilestone.title}</Text>
                <Text style={styles.milestoneSub}>{nextMilestone.description}</Text>
              </View>
            </View>
          </GlassCard>
        )}

        <GlassCard style={styles.focusCard} accentColor={trainingFocus.color}>
          <View style={styles.focusRow}>
            <View style={[styles.focusIcon, { backgroundColor: trainingFocus.color + "20", borderColor: trainingFocus.color + "40" }]}>
              <Text style={styles.focusEmoji}>
                {trainingFocus.discipline === "Swim" ? "🏊" : trainingFocus.discipline === "Bike" ? "🚴" : "🏃"}
              </Text>
            </View>
            <View style={styles.focusInfo}>
              <Text style={styles.focusTitle}>Today's Focus: {trainingFocus.discipline}</Text>
              <Text style={styles.focusSub}>
                {trainingFocus.days === 0 ? "Last done today" : `Last done ${trainingFocus.days} day${trainingFocus.days > 1 ? "s" : ""} ago`}
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.weeklyDistRow}>
          <StatCard
            icon="water"
            iconColor={colors.swim}
            label="Swim"
            value={formatDistance("swim", weeklyStats.swimDistance)}
          />
          <StatCard
            icon="bicycle"
            iconColor={colors.bike}
            label="Bike"
            value={formatDistance("bike", weeklyStats.bikeDistance)}
          />
          <StatCard
            icon="walk"
            iconColor={colors.run}
            label="Run"
            value={formatDistance("run", weeklyStats.runDistance)}
          />
        </View>

        {!isPremium && <PremiumBanner />}

        <SectionHeader title="Discipline Ranks" />
        {!isPremium ? (
          <GlassCard style={styles.premiumPrompt}>
            <Text style={styles.premiumPromptIcon}>🔒</Text>
            <Text style={styles.premiumPromptText}>Upgrade to see discipline ranks</Text>
          </GlassCard>
        ) : (
          <View style={styles.disciplineCards}>
            <DisciplineCard
              rank={triRank.swimRank}
              onPress={() => router.push("/(tabs)/swim")}
            />
            <DisciplineCard
              rank={triRank.bikeRank}
              onPress={() => router.push("/(tabs)/bike")}
            />
            <DisciplineCard
              rank={triRank.runRank}
              onPress={() => router.push("/(tabs)/run")}
            />
          </View>
        )}

        <SectionHeader title="Recent Activities" />
        <GlassCard>
          {recentActivities.map((activity, idx) => (
            <View key={activity.id}>
              <ActivityRow activity={activity} />
              {idx < recentActivities.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
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
    paddingBottom: 32,
    gap: 16,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  levelBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  levelLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(139, 92, 246, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: {
    color: colors.glowPurple,
    fontSize: fontSize.md,
    fontWeight: fontWeight.extrabold,
  },
  levelProgress: {
    flex: 1,
    gap: 3,
  },
  levelTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  levelFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  levelXp: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    marginTop: 2,
  },
  raceCountdown: {
    paddingVertical: 14,
  },
  raceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  raceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(244, 63, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.3)",
  },
  raceEmoji: {
    fontSize: 22,
  },
  raceInfo: {
    flex: 1,
  },
  raceDays: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  raceLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  racePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F43F5E",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  motivational: {
    paddingVertical: 12,
  },
  motivationalText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },
  weeklyRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  consistencyCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  consistencyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ringProgress: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderRadius: 32,
  },
  ringInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  consistencyLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  weeklyStatsCol: {
    flex: 1,
    gap: 10,
  },
  weeklyDistRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  milestonePreview: {
    paddingVertical: 12,
    marginHorizontal: spacing.lg,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  milestoneEmoji: {
    fontSize: 24,
  },
  milestoneInfo: {
    flex: 1,
    gap: 2,
  },
  milestoneTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  milestoneSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  focusCard: {
    paddingVertical: 12,
    marginHorizontal: spacing.lg,
  },
  focusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  focusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  focusEmoji: {
    fontSize: 22,
  },
  focusInfo: {
    flex: 1,
    gap: 2,
  },
  focusTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  focusSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  disciplineCards: {
    gap: 12,
    paddingHorizontal: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
  premiumPrompt: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    marginHorizontal: spacing.lg,
  },
  premiumPromptIcon: {
    fontSize: 24,
  },
  premiumPromptText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
