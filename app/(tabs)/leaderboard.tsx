import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, LeaderboardRow, FilterChip, RankBadge } from "@/components";
import { LeaderboardFilter, LeaderboardScope } from "@/types";
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

export default function LeaderboardScreen() {
  const leaderboardFilter = useAppStore((s) => s.leaderboardFilter);
  const leaderboardScope = useAppStore((s) => s.leaderboardScope);
  const setLeaderboardFilter = useAppStore((s) => s.setLeaderboardFilter);
  const setLeaderboardScope = useAppStore((s) => s.setLeaderboardScope);
  const leaderboard = useAppStore((s) => s.leaderboard);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const friendProfiles = useAppStore((s) => s.friendProfiles);
  const isPremium = useAppStore((s) => s.user.isPremium);
  const filteredLeaderboard = useMemo(() => {
    if (leaderboardScope === "friends") {
      const friendIds = new Set(friendProfiles.map((friend) => friend.id));
      if (currentUserId) friendIds.add(currentUserId);
      return leaderboard.filter((entry) => friendIds.has(entry.userId));
    }
    return leaderboard;
  }, [leaderboard, leaderboardScope, friendProfiles, currentUserId]);

  const topThree = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Compete with athletes worldwide</Text>
        </View>

        <View style={styles.scopeRow}>
          {SCOPE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.key}
              label={opt.label}
              isActive={leaderboardScope === opt.key}
              onPress={() => setLeaderboardScope(opt.key)}
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
              isActive={leaderboardFilter === opt.key}
              onPress={() => setLeaderboardFilter(opt.key)}
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
              <Text style={styles.podiumPoints}>{topThree[1].points}</Text>
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
              <Text style={styles.podiumPoints}>{topThree[0].points}</Text>
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
              <Text style={styles.podiumPoints}>{topThree[2].points}</Text>
            </View>
          </View>
        )}

        <GlassCard style={styles.listCard}>
          {rest.map((entry, idx) => (
            <View key={entry.userId}>
              <LeaderboardRow
                entry={entry}
                isCurrentUser={entry.userId === currentUserId}
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
              Upgrade to Iron3 Premium to see discipline-specific leaderboards,
              age group filters, and friend challenges.
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
