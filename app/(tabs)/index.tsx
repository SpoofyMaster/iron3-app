import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
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
} from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { formatDistance } from "@/lib/scoring";
import { getTriRank } from "@/lib/ranks";
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          <StreakBadge streak={currentStreak} size="md" />
        </View>

        {daysToRace !== null && (
          <GlassCard style={styles.raceCountdown}>
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
            </View>
          </GlassCard>
        )}

        <GlassCard style={styles.motivational}>
          <Text style={styles.motivationalText}>💬 {motivationalMsg}</Text>
        </GlassCard>

        <TriRankDisplay triRank={triRank} />

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
                      borderTopColor: colors.primary,
                      borderRightColor: weeklyProgress > 0.25 ? colors.primary : "transparent",
                      borderBottomColor: weeklyProgress > 0.5 ? colors.primary : "transparent",
                      borderLeftColor: weeklyProgress > 0.75 ? colors.primary : "transparent",
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
              iconColor={colors.error}
              label="Activities"
              value={String(weeklyStats.totalActivities)}
              subtitle="This week"
            />
            <StatCard
              icon="trending-up"
              iconColor={colors.success}
              label="Points"
              value={String(weeklyStats.totalPoints)}
              subtitle="This week"
            />
          </View>
        </View>

        {nextMilestone && (
          <GlassCard style={styles.milestonePreview}>
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
            <View style={[styles.focusIcon, { backgroundColor: trainingFocus.color + "20" }]}>
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
    padding: spacing.lg,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
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
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
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
  },
  milestonePreview: {
    paddingVertical: 12,
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
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
  premiumPrompt: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },
  premiumPromptIcon: {
    fontSize: 24,
  },
  premiumPromptText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
