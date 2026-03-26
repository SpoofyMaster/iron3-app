import React, { useMemo, useState } from "react";
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
  GlassCard,
  LeaderboardRow,
  FilterChip,
  RankBadge,
  PremiumLock,
} from "@/components";
import { LeaderboardFilter, LeaderboardScope } from "@/types";
import { getTriRank } from "@/lib/ranks";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

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
        <View style={styles.header}>
          <Text style={styles.title}>Ranks</Text>
          <Text style={styles.subtitle}>Your triathlon ranking</Text>
        </View>

        <TriRankDisplay triRank={triRank} />

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

        {topThree.length >= 3 && (
          <View style={styles.podium}>
            <View style={styles.podiumSpot}>
              <RankBadge
                tier={topThree[1].tier}
                tierColor={topThree[1].tierColor}
                size="md"
                showLabel
              />
              <View style={[styles.podiumBar, styles.podiumSecond]}>
                <Text style={styles.podiumRank}>2</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {topThree[1].displayName.split(" ")[0]}
              </Text>
              <Text style={styles.podiumPoints}>{topThree[1].points.toLocaleString()}</Text>
            </View>

            <View style={styles.podiumSpot}>
              <View style={styles.crownIcon}>
                <Text style={styles.crown}>👑</Text>
              </View>
              <RankBadge
                tier={topThree[0].tier}
                tierColor={topThree[0].tierColor}
                size="lg"
                showLabel
              />
              <View style={[styles.podiumBar, styles.podiumFirst]}>
                <Text style={styles.podiumRank}>1</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {topThree[0].displayName.split(" ")[0]}
              </Text>
              <Text style={styles.podiumPoints}>{topThree[0].points.toLocaleString()}</Text>
            </View>

            <View style={styles.podiumSpot}>
              <RankBadge
                tier={topThree[2].tier}
                tierColor={topThree[2].tierColor}
                size="md"
                showLabel
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
          <GlassCard style={styles.premiumLock}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockTitle}>Full Leaderboard</Text>
            <Text style={styles.lockDesc}>
              Upgrade to Iron3 Premium to see the full leaderboard,
              discipline-specific rankings, and friend challenges.
            </Text>
          </GlassCard>
        )}
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
    gap: 8,
    paddingVertical: 8,
  },
  podiumSpot: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  crownIcon: {
    marginBottom: -4,
  },
  crown: {
    fontSize: 24,
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
    height: 60,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.25)",
  },
  podiumSecond: {
    height: 44,
    backgroundColor: "rgba(192, 192, 192, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(192, 192, 192, 0.2)",
  },
  podiumThird: {
    height: 34,
    backgroundColor: "rgba(205, 127, 50, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(205, 127, 50, 0.2)",
  },
  podiumRank: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  podiumName: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  podiumPoints: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
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
