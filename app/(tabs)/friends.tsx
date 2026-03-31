import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GlassCard, RankBadge } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { LeaderboardTab } from "@/types";
import { getSupabaseLeaderboard, SupabaseLeaderboardEntry } from "@/lib/dataService";

type DisciplineFilter = "overall" | "10k" | "swim" | "bike" | "run";

const TAB_OPTIONS: { key: LeaderboardTab; label: string }[] = [
  { key: "friends", label: "FRIENDS" },
  { key: "global", label: "GLOBAL" },
  { key: "local", label: "LOCAL" },
];

const DISCIPLINE_OPTIONS: { key: DisciplineFilter; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "10k", label: "10 KM" },
  { key: "swim", label: "Swim" },
  { key: "bike", label: "Bike" },
  { key: "run", label: "Run" },
];

export default function FriendsTabScreen() {
  const router = useRouter();
  const currentUserId = useAppStore((s) => s.currentUserId);
  const chats = useAppStore((s) => s.chatConversations);
  const fallbackFriendsLeaderboard = useAppStore((s) => s.friendsLeaderboard);

  const storeTab = useAppStore((s) => s.friendsLeaderboardTab);
  const setStoreTab = useAppStore((s) => s.setFriendsLeaderboardTab);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>(storeTab);
  const [discipline, setDiscipline] = useState<DisciplineFilter>("overall");
  const [leaderboard, setLeaderboard] = useState<SupabaseLeaderboardEntry[]>([]);
  const [showDisciplineMenu, setShowDisciplineMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(storeTab);
  }, [storeTab]);

  const handleTabChange = (tab: LeaderboardTab) => {
    setActiveTab(tab);
    setStoreTab(tab);
  };

  useEffect(() => {
    const fallbackRows: SupabaseLeaderboardEntry[] = fallbackFriendsLeaderboard.map((entry) => ({
      rank: entry.rank,
      userId: entry.userId,
      displayName: entry.displayName,
      avatarUrl: entry.avatarUrl,
      points: entry.points,
      tier: entry.tier,
      tierColor: entry.tierColor,
      isFriend: entry.isFriend,
    }));

    const loadLeaderboard = async () => {
      if (!currentUserId) {
        setLeaderboard(fallbackRows);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const rows = await getSupabaseLeaderboard(currentUserId, {
          scope: activeTab,
          discipline,
          limit: 100,
        });
        setLeaderboard(rows);
      } catch (e) {
        console.error("Failed to load leaderboard:", e);
        setError("Unable to load live rankings. Showing cached data.");
        setLeaderboard(fallbackRows);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentUserId, activeTab, discipline, fallbackFriendsLeaderboard]);

  const unreadCount = useMemo(
    () => chats.reduce((sum, conversation) => sum + conversation.unreadCount, 0),
    [chats]
  );

  const topThree = leaderboard.slice(0, 3);
  const rankedList = leaderboard.slice(3);
  const selectedDisciplineLabel = DISCIPLINE_OPTIONS.find((opt) => opt.key === discipline)?.label ?? "Overall";

  const podiumOrder = [1, 0, 2];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>RANKINGS</Text>
        <TouchableOpacity
          style={styles.chatIconButton}
          activeOpacity={0.75}
          onPress={() => router.push("/chat" as never)}
        >
          <Ionicons name="chatbubbles-outline" size={22} color={colors.text} />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabRow}>
          {TAB_OPTIONS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, active && styles.tabButtonActive]}
                onPress={() => handleTabChange(tab.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dropdownWrap}>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.8}
            onPress={() => setShowDisciplineMenu((prev) => !prev)}
          >
            <Text style={styles.dropdownText}>{selectedDisciplineLabel}</Text>
            <Ionicons
              name={showDisciplineMenu ? "chevron-up-outline" : "chevron-down-outline"}
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          {showDisciplineMenu ? (
            <View style={styles.dropdownMenu}>
              {DISCIPLINE_OPTIONS.map((opt) => {
                const active = opt.key === discipline;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.dropdownItem, active && styles.dropdownItemActive]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setDiscipline(opt.key);
                      setShowDisciplineMenu(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, active && styles.dropdownItemTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {loading ? (
          <GlassCard style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </GlassCard>
        ) : (
          <>
            {error ? (
              <GlassCard style={styles.errorCard}>
                <Text style={styles.loadingText}>{error}</Text>
              </GlassCard>
            ) : null}
            <View style={styles.podium}>
              {podiumOrder.map((positionIndex) => {
                const athlete = topThree[positionIndex];
                if (!athlete) return <View key={`empty-${positionIndex}`} style={styles.podiumSpot} />;

                const isFirst = athlete.rank === 1;
                const size = isFirst ? 78 : 64;
                const isCurrentUser = athlete.userId === currentUserId;

                return (
                  <TouchableOpacity
                    key={athlete.userId}
                    style={styles.podiumSpot}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/friends/${athlete.userId}` as never)}
                  >
                    {isFirst ? (
                      <View style={styles.crownWrap}>
                        <Text style={styles.crownIcon}>👑</Text>
                      </View>
                    ) : null}
                    <View
                      style={[
                        styles.podiumAvatar,
                        {
                          width: size,
                          height: size,
                          borderRadius: size / 2,
                          borderColor: athlete.tierColor,
                        },
                        isCurrentUser && styles.currentUserOutline,
                      ]}
                    >
                      <Text style={styles.podiumAvatarText}>
                        {athlete.displayName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {athlete.displayName}
                    </Text>
                    <RankBadge tier={athlete.tier} tierColor={athlete.tierColor} size="sm" showLabel />
                    <Text style={styles.podiumPoints}>{athlete.points.toLocaleString()} RP</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <GlassCard style={styles.listCard}>
              {rankedList.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No athletes in this ranking yet.</Text>
                </View>
              ) : (
                rankedList.map((entry, idx) => {
                  const isCurrentUser = entry.userId === currentUserId;
                  return (
                    <View key={entry.userId}>
                      <TouchableOpacity
                        style={[styles.listRow, isCurrentUser && styles.listRowCurrent]}
                        activeOpacity={0.8}
                        onPress={() => router.push(`/friends/${entry.userId}` as never)}
                      >
                        <Text style={styles.listRank}>{entry.rank}</Text>
                        <View style={[styles.listAvatar, { borderColor: entry.tierColor + "66" }]}>
                          <Text style={styles.listAvatarText}>
                            {entry.displayName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <Text
                          style={[styles.listName, isCurrentUser && styles.listNameCurrent]}
                          numberOfLines={1}
                        >
                          {entry.displayName}
                        </Text>
                        <RankBadge tier={entry.tier} tierColor={entry.tierColor} size="sm" />
                        <Text style={styles.listPoints}>{entry.points.toLocaleString()} RP</Text>
                      </TouchableOpacity>
                      {idx < rankedList.length - 1 ? <View style={styles.divider} /> : null}
                    </View>
                  );
                })
              )}
            </GlassCard>
          </>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1.2,
  },
  chatIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.background,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
    gap: 14,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    padding: 3,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.full,
    paddingVertical: 9,
  },
  tabButtonActive: {
    backgroundColor: colors.primary + "26",
    borderWidth: 1,
    borderColor: colors.primary + "55",
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: colors.text,
  },
  dropdownWrap: {
    position: "relative",
    zIndex: 5,
  },
  dropdownButton: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemActive: {
    backgroundColor: colors.primary + "1A",
  },
  dropdownItemText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  dropdownItemTextActive: {
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  loadingCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 26,
  },
  errorCard: {
    alignItems: "center",
    paddingVertical: 12,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  podiumSpot: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingTop: 6,
  },
  crownWrap: {
    marginBottom: -2,
  },
  crownIcon: {
    fontSize: 18,
  },
  podiumAvatar: {
    borderWidth: 2,
    backgroundColor: colors.surfaceGlass,
    alignItems: "center",
    justifyContent: "center",
  },
  currentUserOutline: {
    shadowColor: colors.glowCyan,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  podiumAvatarText: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  podiumName: {
    color: colors.text,
    fontSize: fontSize.xs,
    maxWidth: "100%",
  },
  podiumPoints: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.semibold,
  },
  listCard: {
    padding: 4,
    marginTop: 4,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  listRowCurrent: {
    backgroundColor: colors.swim + "22",
    borderRadius: borderRadius.md,
    marginHorizontal: -2,
    paddingHorizontal: 14,
  },
  listRank: {
    color: colors.textMuted,
    width: 26,
    textAlign: "center",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  listAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceGlass,
  },
  listAvatarText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  listName: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  listNameCurrent: {
    color: colors.swim,
    fontWeight: fontWeight.semibold,
  },
  listPoints: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    minWidth: 56,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginHorizontal: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
