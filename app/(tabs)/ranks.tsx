import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, RankBadge, LevelStreakBar } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { searchProfiles, sendFriendRequest } from "@/lib/dataService";

export default function RanksScreen() {
  const router = useRouter();
  const friendsLeaderboard = useAppStore((s) => s.friendsLeaderboard);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const refreshFriends = useAppStore((s) => s.refreshFriends);

  const [friendSearch, setFriendSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; display_name: string; avatar_url: string | null }>
  >([]);
  const [searching, setSearching] = useState(false);

  const topThree = useMemo(() => friendsLeaderboard.slice(0, 3), [friendsLeaderboard]);
  const hasFriends = friendsLeaderboard.filter((row) => row.userId !== currentUserId).length > 0;

  const handleSearchFriends = async () => {
    if (!currentUserId || !friendSearch.trim()) return;
    setSearching(true);
    try {
      const results = await searchProfiles(friendSearch.trim(), currentUserId, 10);
      setSearchResults(results);
    } catch (error) {
      console.error("Friend search failed:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    if (!currentUserId) return;
    try {
      await sendFriendRequest(currentUserId, friendId);
      await refreshFriends(currentUserId);
      setSearchResults((prev) => prev.filter((item) => item.id !== friendId));
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LevelStreakBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>FRIENDS</Text>

        <GlassCard style={styles.searchCard}>
          <Text style={styles.searchTitle}>Find and add athletes</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={friendSearch}
              onChangeText={setFriendSearch}
              placeholder="Search by display name"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearchFriends} activeOpacity={0.7}>
              <Ionicons name="search" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          {searching ? (
            <Text style={styles.searchStatus}>Searching...</Text>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <View key={result.id} style={styles.searchResultRow}>
                <Text style={styles.searchResultName}>{result.display_name}</Text>
                <TouchableOpacity onPress={() => handleAddFriend(result.id)} style={styles.addBtn} activeOpacity={0.7}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.searchStatus}>Search and add new friends.</Text>
          )}
        </GlassCard>

        {topThree.length >= 3 && (
          <View style={styles.podium}>
            {topThree.map((entry) => (
              <TouchableOpacity
                key={entry.userId}
                style={styles.podiumSpot}
                activeOpacity={0.7}
                onPress={() => {
                  if (entry.userId !== currentUserId) router.push(`/friends/${entry.userId}` as never);
                }}
              >
                <View style={[styles.podiumAvatar, { borderColor: entry.tierColor + "70" }]}>
                  <Text style={styles.podiumAvatarText}>{entry.avatarLetter}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {entry.displayName}
                </Text>
                <RankBadge tier={entry.tier} tierColor={entry.tierColor} size="sm" />
                <Text style={styles.podiumPoints}>{entry.points.toLocaleString()} RP</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <GlassCard style={styles.listCard}>
          {friendsLeaderboard.map((entry, idx) => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <View key={entry.userId}>
                <TouchableOpacity
                  style={[styles.listRow, isCurrentUser && styles.listRowCurrent]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (!isCurrentUser) router.push(`/friends/${entry.userId}` as never);
                  }}
                >
                  <Text style={styles.listRank}>{entry.rank}</Text>
                  <View style={[styles.listAvatar, { borderColor: entry.tierColor + "40" }]}>
                    <Text style={styles.listAvatarText}>{entry.avatarLetter}</Text>
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={[styles.listName, isCurrentUser && { color: colors.glowCyan }]}>
                      {entry.displayName}
                    </Text>
                  </View>
                  <RankBadge tier={entry.tier} tierColor={entry.tierColor} size="sm" />
                  <Text style={styles.listPoints}>{entry.points.toLocaleString()}</Text>
                </TouchableOpacity>
                {idx < friendsLeaderboard.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
          {!hasFriends && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Start your journey</Text>
              <Text style={styles.emptyText}>Add your first friend to unlock community stats and chat.</Text>
            </View>
          )}
        </GlassCard>

        <TouchableOpacity style={styles.openChatsBtn} onPress={() => router.push("/chat" as never)} activeOpacity={0.8}>
          <Ionicons name="chatbubbles" size={16} color={colors.text} />
          <Text style={styles.openChatsText}>Open Chats</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    marginTop: 8,
  },
  searchCard: {
    gap: 10,
  },
  searchTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: fontSize.sm,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  searchStatus: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchResultName: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  addBtn: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary + "50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primary + "20",
  },
  addBtnText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  podium: {
    flexDirection: "row",
    gap: 10,
  },
  podiumSpot: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceGlass,
  },
  podiumAvatarText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  podiumName: {
    color: colors.text,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  podiumPoints: {
    color: colors.textMuted,
    fontSize: 10,
  },
  listCard: {
    padding: 4,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  listRowCurrent: {
    backgroundColor: "rgba(6, 182, 212, 0.08)",
    borderRadius: borderRadius.md,
    marginHorizontal: -4,
    paddingHorizontal: 16,
  },
  listRank: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    width: 24,
    textAlign: "center",
  },
  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  listAvatarText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  listPoints: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginHorizontal: 12,
  },
  emptyState: {
    padding: spacing.lg,
    gap: 6,
    alignItems: "center",
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  openChatsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    paddingVertical: 12,
  },
  openChatsText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
