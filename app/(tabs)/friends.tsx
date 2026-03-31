import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GlassCard, RankBadge } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { LeaderboardTab } from "@/types";
import {
  getSupabaseLeaderboard,
  SupabaseLeaderboardEntry,
  acceptFriendRequest,
  declineFriendRequest,
  listFriendRequests,
  searchProfiles,
  sendFriendRequest,
} from "@/lib/dataService";

type DisciplineFilter = "overall" | "10k" | "swim" | "bike" | "run";
type SearchProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
};
type IncomingFriendRequestRow = {
  id: string;
  user: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

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
  const friendProfiles = useAppStore((s) => s.friendProfiles);
  const refreshFriends = useAppStore((s) => s.refreshFriends);
  const fallbackFriendsLeaderboard = useAppStore((s) => s.friendsLeaderboard);

  const storeTab = useAppStore((s) => s.friendsLeaderboardTab);
  const setStoreTab = useAppStore((s) => s.setFriendsLeaderboardTab);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>(storeTab);
  const [discipline, setDiscipline] = useState<DisciplineFilter>("overall");
  const [leaderboard, setLeaderboard] = useState<SupabaseLeaderboardEntry[]>([]);
  const [showDisciplineMenu, setShowDisciplineMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProfileRow[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [requestedFollowIds, setRequestedFollowIds] = useState<string[]>([]);
  const [sendingFollowIds, setSendingFollowIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<IncomingFriendRequestRow[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [processingRequestIds, setProcessingRequestIds] = useState<string[]>([]);

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
  const friendIdSet = useMemo(() => new Set(friendProfiles.map((friend) => friend.id)), [friendProfiles]);
  const pendingCount = pendingRequests.length;

  const loadPendingRequests = async () => {
    if (!currentUserId) {
      setPendingRequests([]);
      setPendingError(null);
      setPendingLoading(false);
      return;
    }

    setPendingLoading(true);
    setPendingError(null);
    try {
      const rows = (await listFriendRequests(currentUserId)) as IncomingFriendRequestRow[];
      setPendingRequests(rows);
    } catch (requestErr) {
      console.error("Failed to load pending requests:", requestErr);
      setPendingError("Unable to load pending requests.");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    loadPendingRequests();
  }, [currentUserId]);

  useEffect(() => {
    if (isSearchOpen) {
      loadPendingRequests();
    }
  }, [isSearchOpen, currentUserId]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!isSearchOpen || !currentUserId || query.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const rows = (await searchProfiles(query, currentUserId, 20)) as SearchProfileRow[];
        if (!cancelled) setSearchResults(rows);
      } catch (searchErr) {
        console.error("Failed to search profiles:", searchErr);
        if (!cancelled) {
          setSearchError("Unable to search athletes right now.");
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isSearchOpen, searchQuery, currentUserId]);

  const handleFollowFromSearch = async (userId: string) => {
    if (!currentUserId || friendIdSet.has(userId) || requestedFollowIds.includes(userId)) return;

    setSendingFollowIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    try {
      await sendFriendRequest(currentUserId, userId);
      setRequestedFollowIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
      await refreshFriends(currentUserId);
    } catch (followErr: any) {
      // Treat duplicate pending requests as already requested.
      const message = String(followErr?.message ?? "");
      if (message.toLowerCase().includes("duplicate")) {
        setRequestedFollowIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
        return;
      }
      console.error("Failed to send follow request:", followErr);
    } finally {
      setSendingFollowIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!currentUserId || processingRequestIds.includes(requestId)) return;
    setProcessingRequestIds((prev) => (prev.includes(requestId) ? prev : [...prev, requestId]));
    try {
      await acceptFriendRequest(requestId);
      await refreshFriends(currentUserId);
      await loadPendingRequests();
    } catch (acceptErr) {
      console.error("Failed to accept friend request:", acceptErr);
    } finally {
      setProcessingRequestIds((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!currentUserId || processingRequestIds.includes(requestId)) return;
    setProcessingRequestIds((prev) => (prev.includes(requestId) ? prev : [...prev, requestId]));
    try {
      await declineFriendRequest(requestId);
      await loadPendingRequests();
      await refreshFriends(currentUserId);
    } catch (declineErr) {
      console.error("Failed to decline friend request:", declineErr);
    } finally {
      setProcessingRequestIds((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const rankedList = leaderboard.slice(3);
  const selectedDisciplineLabel = DISCIPLINE_OPTIONS.find((opt) => opt.key === discipline)?.label ?? "Overall";

  const podiumOrder = [1, 0, 2];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconGroup}>
            <View style={styles.headerIconWrap}>
              <TouchableOpacity
                style={styles.searchIconButton}
                activeOpacity={0.75}
                onPress={() => setIsSearchOpen((prev) => !prev)}
              >
                <Ionicons name="search-outline" size={20} color={colors.text} />
              </TouchableOpacity>
              {pendingCount > 0 ? <View style={styles.searchNotificationDot} /> : null}
            </View>
            <TouchableOpacity
              style={styles.notificationIconButton}
              activeOpacity={0.75}
              onPress={() => setIsSearchOpen(true)}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              {pendingCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingCount > 99 ? "99+" : pendingCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>RANKINGS</Text>
        </View>
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
        {isSearchOpen ? (
          <GlassCard style={styles.searchCard}>
            <View style={styles.pendingSection}>
              <View style={styles.pendingHeaderRow}>
                <Text style={styles.pendingTitle}>Pending Requests</Text>
                {pendingLoading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
              </View>
              {pendingError ? (
                <Text style={styles.searchHint}>{pendingError}</Text>
              ) : pendingRequests.length === 0 ? (
                <Text style={styles.pendingEmptyText}>No pending follow requests.</Text>
              ) : (
                pendingRequests.map((request, idx) => {
                  const displayName = request.user?.display_name?.trim() || "Athlete";
                  const isProcessing = processingRequestIds.includes(request.id);
                  return (
                    <View key={request.id}>
                      <View style={styles.pendingRow}>
                        <TouchableOpacity
                          style={styles.pendingProfileTap}
                          activeOpacity={0.8}
                          onPress={() => {
                            const requesterId = request.user?.id;
                            if (!requesterId) return;
                            router.push(`/friends/${requesterId}` as never);
                          }}
                        >
                          <View style={styles.searchAvatar}>
                            <Text style={styles.searchAvatarText}>{displayName.charAt(0).toUpperCase()}</Text>
                          </View>
                          <Text style={styles.searchName} numberOfLines={1}>
                            {displayName}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.pendingActionsRow}>
                          <TouchableOpacity
                            style={[styles.pendingActionBtn, styles.pendingDeclineBtn]}
                            activeOpacity={0.8}
                            disabled={isProcessing}
                            onPress={() => handleDeclineRequest(request.id)}
                          >
                            <Text style={styles.pendingDeclineBtnText}>
                              {isProcessing ? "..." : "DECLINE"}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.pendingActionBtn, styles.pendingAcceptBtn]}
                            activeOpacity={0.8}
                            disabled={isProcessing}
                            onPress={() => handleAcceptRequest(request.id)}
                          >
                            <Text style={styles.pendingAcceptBtnText}>
                              {isProcessing ? "..." : "ACCEPT"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {idx < pendingRequests.length - 1 ? <View style={styles.divider} /> : null}
                    </View>
                  );
                })
              )}
            </View>

            <View style={styles.searchInputRow}>
              <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search athletes by name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity activeOpacity={0.7} onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {searchQuery.trim().length < 2 ? (
              <Text style={styles.searchHint}>Type at least 2 letters to search.</Text>
            ) : searchLoading ? (
              <View style={styles.searchStatusRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.searchHint}>Searching...</Text>
              </View>
            ) : searchError ? (
              <Text style={styles.searchHint}>{searchError}</Text>
            ) : searchResults.length === 0 ? (
              <Text style={styles.searchHint}>No athletes found.</Text>
            ) : (
              <View style={styles.searchResultsWrap}>
                {searchResults.map((result, idx) => {
                  const displayName = result.display_name?.trim() || "Athlete";
                  const isFriend = friendIdSet.has(result.id);
                  const isRequested = requestedFollowIds.includes(result.id);
                  const isSending = sendingFollowIds.includes(result.id);

                  return (
                    <View key={result.id}>
                      <View style={styles.searchResultRow}>
                        <TouchableOpacity
                          style={styles.searchResultProfileTap}
                          activeOpacity={0.8}
                          onPress={() => router.push(`/friends/${result.id}` as never)}
                        >
                          <View style={styles.searchAvatar}>
                            <Text style={styles.searchAvatarText}>{displayName.charAt(0).toUpperCase()}</Text>
                          </View>
                          <Text style={styles.searchName} numberOfLines={1}>
                            {displayName}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.searchActionButtons}>
                          <TouchableOpacity
                            style={styles.searchViewButton}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/friends/${result.id}` as never)}
                          >
                            <Text style={styles.searchViewButtonText}>VIEW</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.searchFollowButton,
                              (isFriend || isRequested) && styles.searchFollowButtonDisabled,
                            ]}
                            activeOpacity={0.8}
                            disabled={isFriend || isRequested || isSending}
                            onPress={() => handleFollowFromSearch(result.id)}
                          >
                            <Text
                              style={[
                                styles.searchFollowButtonText,
                                (isFriend || isRequested) && styles.searchFollowButtonTextDisabled,
                              ]}
                            >
                              {isFriend
                                ? "FOLLOWING"
                                : isRequested
                                ? "REQUESTED"
                                : isSending
                                ? "SENDING..."
                                : "FOLLOW"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {idx < searchResults.length - 1 ? <View style={styles.divider} /> : null}
                    </View>
                  );
                })}
              </View>
            )}
          </GlassCard>
        ) : null}

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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconWrap: {
    position: "relative",
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1.2,
  },
  searchIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  searchNotificationDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.background,
  },
  notificationIconButton: {
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
  searchCard: {
    gap: 10,
  },
  pendingSection: {
    gap: 8,
  },
  pendingHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pendingTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  pendingEmptyText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 8,
  },
  pendingProfileTap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  pendingActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pendingActionBtn: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 78,
    alignItems: "center",
  },
  pendingAcceptBtn: {
    borderColor: colors.success + "66",
    backgroundColor: colors.success + "1F",
  },
  pendingDeclineBtn: {
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  pendingAcceptBtnText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.4,
  },
  pendingDeclineBtnText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.4,
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceGlass,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.sm,
    paddingVertical: 0,
  },
  searchHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  searchStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchResultsWrap: {
    marginTop: 4,
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 10,
  },
  searchResultProfileTap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  searchActionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchViewButton: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 56,
    alignItems: "center",
  },
  searchViewButtonText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.4,
  },
  searchAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  searchAvatarText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  searchName: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  searchFollowButton: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary + "66",
    backgroundColor: colors.primary + "1F",
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 88,
    alignItems: "center",
  },
  searchFollowButtonDisabled: {
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  searchFollowButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.4,
  },
  searchFollowButtonTextDisabled: {
    color: colors.textMuted,
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
