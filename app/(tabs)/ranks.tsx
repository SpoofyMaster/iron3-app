import React, { useMemo, useState } from "react";
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
  GlassCard,
  LeaderboardRow,
  FilterChip,
  RankBadge,
  PremiumLock,
  GradientBackground,
} from "@/components";
import { LeaderboardFilter, LeaderboardScope } from "@/types";
import { getTriRank, getRankForPoints, formatPoints } from "@/lib/ranks";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { getGlowStyle, getRankGradient } from "@/lib/effects";

const FILTER_OPTIONS: { key: LeaderboardFilter; label: string; color?: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "swim", label: "Swim", color: colors.swim },
  { key: "bike", label: "Bike", color: colors.bike },
  { key: "run", label: "Run", color: colors.run },
];

const SCOPE_OPTIONS: { key: LeaderboardScope; label: string }[] = [
  { key: "global", label: "Global" },
  { key: "friends", label: "Friends" },
];

export default function RanksScreen() {
  const router = useRouter();
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);
  const isPremium = useAppStore((s) => s.user.isPremium);

  const leaderboard = useAppStore((s) => s.leaderboard);
  const [lbFilter, setLbFilter] = useState<LeaderboardFilter>("overall");
  const [lbScope, setLbScope] = useState<LeaderboardScope>("global");

  const rankInfo = useMemo(() => getRankForPoints(triRank.overallPoints), [triRank.overallPoints]);

  const filteredLeaderboard = useMemo(() => {
    if (lbScope === "friends") {
      return leaderboard.filter((e) => e.isFriend || e.userId === "user-001");
    }
    return leaderboard;
  }, [leaderboard, lbScope]);

  const topThree = filteredLeaderboard.slice(0, 3);
  const rest = isPremium ? filteredLeaderboard.slice(3) : filteredLeaderboard.slice(3, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dramatic header with gradient */}
        <GradientBackground style={styles.headerGradient}>
          <View style={styles.header}>
            <Text style={styles.title}>RANKS</Text>
            <Text style={styles.subtitle}>Your triathlon ranking</Text>
          </View>

          {/* HUGE rank emblem */}
          <TriRankDisplay triRank={triRank} size="full" />

          {/* Rank Standings */}
          <View style={styles.standingsRow}>
            <GlassCard style={styles.standingCard} variant="highlighted">
              <Text style={styles.standingLabel}>GLOBAL</Text>
              <Text style={styles.standingValue}>#1,234</Text>
              <Text style={styles.standingPct}>Top 15%</Text>
            </GlassCard>
            <GlassCard style={styles.standingCard} variant="highlighted">
              <Text style={styles.standingLabel}>REGIONAL</Text>
              <Text style={styles.standingValue}>#89</Text>
              <Text style={styles.standingPct}>Top 8%</Text>
            </GlassCard>
          </View>
        </GradientBackground>

        <View style={styles.body}>
          <SectionHeader title="Discipline Ranks" />
          <PremiumLock isLocked={!isPremium} message="Unlock Discipline Ranks">
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
          </PremiumLock>

          <SectionHeader title="Leaderboard" />
          <View style={styles.scopeRow}>
            {SCOPE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.key}
                label={opt.label}
                isActive={lbScope === opt.key}
                onPress={() => setLbScope(opt.key)}
              />
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.key}
                label={opt.label}
                isActive={lbFilter === opt.key}
                onPress={() => setLbFilter(opt.key)}
                activeColor={opt.color ?? colors.primary}
              />
            ))}
          </ScrollView>

          {/* Podium-style top 3 */}
          {topThree.length >= 3 && (
            <View style={styles.podium}>
              {/* 2nd place - left */}
              <View style={[styles.podiumSpot, styles.podiumSide]}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarSilver]}>
                  <Text style={[styles.podiumAvatarText, { color: "#94A3B8" }]}>
                    {topThree[1].displayName.charAt(0)}
                  </Text>
                </View>
                <RankBadge
                  tier={topThree[1].tier}
                  tierColor={topThree[1].tierColor}
                  size="sm"
                />
                <View style={[styles.podiumBar, styles.podiumSecond]}>
                  <Text style={styles.podiumRank}>2</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {topThree[1].displayName.split(" ")[0]}
                </Text>
                <Text style={styles.podiumPoints}>{topThree[1].points.toLocaleString()}</Text>
              </View>

              {/* 1st place - center */}
              <View style={[styles.podiumSpot, styles.podiumCenter]}>
                <Text style={styles.crown}>👑</Text>
                <View style={[styles.podiumAvatar, styles.podiumAvatarGold]}>
                  <Text style={[styles.podiumAvatarText, { color: "#F59E0B" }]}>
                    {topThree[0].displayName.charAt(0)}
                  </Text>
                </View>
                <RankBadge
                  tier={topThree[0].tier}
                  tierColor={topThree[0].tierColor}
                  size="md"
                />
                <View style={[styles.podiumBar, styles.podiumFirst]}>
                  <Text style={[styles.podiumRank, styles.podiumRankFirst]}>1</Text>
                </View>
                <Text style={[styles.podiumName, styles.podiumNameFirst]} numberOfLines={1}>
                  {topThree[0].displayName.split(" ")[0]}
                </Text>
                <Text style={[styles.podiumPoints, { color: "#F59E0B" }]}>{topThree[0].points.toLocaleString()}</Text>
              </View>

              {/* 3rd place - right */}
              <View style={[styles.podiumSpot, styles.podiumSide]}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarBronze]}>
                  <Text style={[styles.podiumAvatarText, { color: "#D97706" }]}>
                    {topThree[2].displayName.charAt(0)}
                  </Text>
                </View>
                <RankBadge
                  tier={topThree[2].tier}
                  tierColor={topThree[2].tierColor}
                  size="sm"
                />
                <View style={[styles.podiumBar, styles.podiumThird]}>
                  <Text style={styles.podiumRank}>3</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {topThree[2].displayName.split(" ")[0]}
                </Text>
                <Text style={styles.podiumPoints}>{topThree[2].points.toLocaleString()}</Text>
              </View>
            </View>
          )}

          <GlassCard style={styles.listCard}>
            {rest.map((entry, idx) => (
              <View key={entry.userId}>
                <LeaderboardRow
                  entry={entry}
                  isCurrentUser={entry.userId === "user-001"}
                />
                {idx < rest.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </GlassCard>

          {!isPremium && (
            <GlassCard style={styles.premiumLock} variant="highlighted">
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockTitle}>Full Leaderboard</Text>
              <Text style={styles.lockDesc}>
                Upgrade to Iron3 Premium to see the full leaderboard,
                discipline-specific rankings, and friend challenges.
              </Text>
            </GlassCard>
          )}
        </View>
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
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 24,
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
    letterSpacing: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  standingsRow: {
    flexDirection: "row",
    gap: 12,
  },
  standingCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 16,
  },
  standingLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  standingValue: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
  },
  standingPct: {
    color: colors.glowPurple,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: 16,
    gap: 16,
  },
  disciplineCards: {
    gap: 12,
  },
  scopeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: 4,
  },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  podiumSpot: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  podiumSide: {
    paddingTop: 20,
  },
  podiumCenter: {
    paddingTop: 0,
  },
  crown: {
    fontSize: 28,
    marginBottom: -2,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  podiumAvatarGold: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderColor: "#F59E0B",
    borderWidth: 2.5,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  podiumAvatarSilver: {
    borderColor: "#94A3B8",
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  podiumAvatarBronze: {
    borderColor: "#D97706",
    shadowColor: "#D97706",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  podiumAvatarText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  podiumBar: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    marginTop: 6,
  },
  podiumFirst: {
    height: 70,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  podiumSecond: {
    height: 50,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  podiumThird: {
    height: 38,
    backgroundColor: "rgba(217, 119, 6, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.2)",
  },
  podiumRank: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  podiumRankFirst: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: "#F59E0B",
  },
  podiumName: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  podiumNameFirst: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
  podiumPoints: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  listCard: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginHorizontal: 12,
  },
  premiumLock: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
  },
  lockIcon: {
    fontSize: 32,
  },
  lockTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  lockDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
