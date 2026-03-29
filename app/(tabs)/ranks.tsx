import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
  LevelStreakBar,
} from "@/components";
import { LeaderboardFilter, LeaderboardScope, LeaderboardTab, FriendLeaderboardEntry } from "@/types";
import { getTriRank, getRankForPoints, formatPoints } from "@/lib/ranks";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { getGlowStyle, getRankGradient } from "@/lib/effects";

const FILTER_OPTIONS: { key: LeaderboardFilter; label: string; color?: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "swim", label: "Swim", color: colors.swim },
  { key: "bike", label: "Bike", color: colors.bike },
  { key: "run", label: "Run", color: colors.run },
];

const TAB_OPTIONS: { key: LeaderboardTab; label: string }[] = [
  { key: "friends", label: "FRIENDS" },
  { key: "global", label: "GLOBAL" },
  { key: "local", label: "LOCAL" },
];

const DISTANCE_OPTIONS = ["5 KM", "10 KM", "21 KM", "42 KM", "All"];

// Mock global leaderboard (different people, higher points)
const GLOBAL_LEADERBOARD: FriendLeaderboardEntry[] = [
  { rank: 1, userId: "g-001", displayName: "Tom Fischer", avatarUrl: null, points: 28400, tier: "Legendary", tierColor: "#FF4500", isFriend: false, avatarLetter: "T" },
  { rank: 2, userId: "g-002", displayName: "Anja Berger", avatarUrl: null, points: 25100, tier: "Elite", tierColor: "#80ED99", isFriend: false, avatarLetter: "A" },
  { rank: 3, userId: "g-003", displayName: "Yuki Tanaka", avatarUrl: null, points: 23600, tier: "Elite", tierColor: "#80ED99", isFriend: false, avatarLetter: "Y" },
  { rank: 4, userId: "g-004", displayName: "Ryan O'Brien", avatarUrl: null, points: 21200, tier: "Diamond", tierColor: "#22D3EE", isFriend: false, avatarLetter: "R" },
  { rank: 5, userId: "g-005", displayName: "Sofia Costa", avatarUrl: null, points: 19800, tier: "Diamond", tierColor: "#22D3EE", isFriend: false, avatarLetter: "S" },
  { rank: 6, userId: "g-006", displayName: "Liam Carter", avatarUrl: null, points: 18500, tier: "Diamond", tierColor: "#22D3EE", isFriend: false, avatarLetter: "L" },
  { rank: 7, userId: "u-020", displayName: "Marcus Chen", avatarUrl: null, points: 15200, tier: "Diamond", tierColor: "#22D3EE", isFriend: true, avatarLetter: "M" },
  { rank: 8, userId: "g-007", displayName: "Nina Volkov", avatarUrl: null, points: 14200, tier: "Platinum", tierColor: "#818CF8", isFriend: false, avatarLetter: "N" },
  { rank: 9, userId: "g-008", displayName: "Omar Hassan", avatarUrl: null, points: 12900, tier: "Platinum", tierColor: "#818CF8", isFriend: false, avatarLetter: "O" },
  { rank: 10, userId: "user-001", displayName: "Alex Rivera", avatarUrl: null, points: 4350, tier: "Silver", tierColor: "#94A3B8", isFriend: false, avatarLetter: "A" },
];

// Mock local leaderboard (nearby athletes)
const LOCAL_LEADERBOARD: FriendLeaderboardEntry[] = [
  { rank: 1, userId: "l-001", displayName: "Carlos Mendoza", avatarUrl: null, points: 13800, tier: "Platinum", tierColor: "#818CF8", isFriend: false, avatarLetter: "C" },
  { rank: 2, userId: "l-002", displayName: "Isabella Rossi", avatarUrl: null, points: 11200, tier: "Platinum", tierColor: "#818CF8", isFriend: false, avatarLetter: "I" },
  { rank: 3, userId: "l-003", displayName: "Mehdi Alaoui", avatarUrl: null, points: 9400, tier: "Gold", tierColor: "#F59E0B", isFriend: false, avatarLetter: "M" },
  { rank: 4, userId: "u-024", displayName: "Kai Nakamura", avatarUrl: null, points: 8650, tier: "Gold", tierColor: "#F59E0B", isFriend: true, avatarLetter: "K" },
  { rank: 5, userId: "l-004", displayName: "Amina Benziane", avatarUrl: null, points: 7200, tier: "Gold", tierColor: "#F59E0B", isFriend: false, avatarLetter: "A" },
  { rank: 6, userId: "l-005", displayName: "Lucas Martin", avatarUrl: null, points: 5800, tier: "Silver", tierColor: "#94A3B8", isFriend: false, avatarLetter: "L" },
  { rank: 7, userId: "user-001", displayName: "Alex Rivera", avatarUrl: null, points: 4350, tier: "Silver", tierColor: "#94A3B8", isFriend: false, avatarLetter: "A" },
  { rank: 8, userId: "l-006", displayName: "Fatima El Idrissi", avatarUrl: null, points: 3900, tier: "Silver", tierColor: "#94A3B8", isFriend: false, avatarLetter: "F" },
  { rank: 9, userId: "l-007", displayName: "Nour Tazi", avatarUrl: null, points: 2600, tier: "Bronze", tierColor: "#D97706", isFriend: false, avatarLetter: "N" },
  { rank: 10, userId: "l-008", displayName: "Youssef Benhaddou", avatarUrl: null, points: 1800, tier: "Bronze", tierColor: "#CD7F32", isFriend: false, avatarLetter: "Y" },
];

export default function RanksScreen() {
  const router = useRouter();
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);
  const isPremium = useAppStore((s) => s.user.isPremium);

  const friendsLeaderboard = useAppStore((s) => s.friendsLeaderboard);
  const leaderboardTab = useAppStore((s) => s.friendsLeaderboardTab);
  const setLeaderboardTab = useAppStore((s) => s.setFriendsLeaderboardTab);

  const [lbFilter, setLbFilter] = useState<LeaderboardFilter>("overall");
  const [selectedDistance, setSelectedDistance] = useState("10 KM");
  const [showDistancePicker, setShowDistancePicker] = useState(false);

  const rankInfo = useMemo(() => getRankForPoints(triRank.overallPoints), [triRank.overallPoints]);

  // Select leaderboard data based on active tab
  const currentLeaderboard = useMemo(() => {
    switch (leaderboardTab) {
      case "global": return GLOBAL_LEADERBOARD;
      case "local": return LOCAL_LEADERBOARD;
      case "friends":
      default: return friendsLeaderboard;
    }
  }, [leaderboardTab, friendsLeaderboard]);

  const topThree = currentLeaderboard.slice(0, 3);
  const rest = isPremium ? currentLeaderboard.slice(3) : currentLeaderboard.slice(3, 6);

  const PODIUM_CONFIG = [
    { idx: 1, size: 44, ringColor: "#94A3B8", label: "silver", glowOpacity: 0.4 },
    { idx: 0, size: 56, ringColor: "#F59E0B", label: "gold", glowOpacity: 0.6 },
    { idx: 2, size: 44, ringColor: "#D97706", label: "bronze", glowOpacity: 0.4 },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <LevelStreakBar />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Toggle */}
        <View style={styles.tabToggle}>
          {TAB_OPTIONS.map((tab) => {
            const active = leaderboardTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => setLeaderboardTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Distance filter */}
        <TouchableOpacity
          style={styles.distFilterRow}
          onPress={() => setShowDistancePicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.distFilter}>{selectedDistance}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Podium Section */}
        {topThree.length >= 3 && (
          <View style={styles.podium}>
            {PODIUM_CONFIG.map((config) => {
              const entry = topThree[config.idx];
              if (!entry) return null;
              const isFirst = config.idx === 0;
              return (
                <View
                  key={entry.userId}
                  style={[styles.podiumSpot, !isFirst && styles.podiumSide]}
                >
                  {isFirst && <Text style={styles.crown}>👑</Text>}
                  <View
                    style={[
                      styles.podiumAvatar,
                      {
                        width: config.size,
                        height: config.size,
                        borderRadius: config.size / 2,
                        borderColor: config.ringColor,
                        borderWidth: isFirst ? 3 : 2,
                        shadowColor: config.ringColor,
                        shadowOpacity: config.glowOpacity,
                        shadowRadius: isFirst ? 12 : 8,
                        elevation: isFirst ? 6 : 4,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.podiumAvatarText,
                        { color: config.ringColor, fontSize: isFirst ? fontSize.xl : fontSize.lg },
                      ]}
                    >
                      {entry.avatarLetter}
                    </Text>
                  </View>
                  <Text style={styles.podiumUsername} numberOfLines={1}>
                    {entry.displayName.split(" ")[0]}
                  </Text>
                  <RankBadge tier={entry.tier} tierColor={entry.tierColor} size="sm" />
                  <Text style={styles.podiumPoints}>{entry.points.toLocaleString()} RP</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Leaderboard list */}
        <GlassCard style={styles.listCard}>
          {rest.map((entry, idx) => {
            const isCurrentUser = entry.userId === "user-001";
            return (
              <View key={entry.userId}>
                <View style={[styles.listRow, isCurrentUser && styles.listRowCurrent]}>
                  <Text style={styles.listRank}>{entry.rank}</Text>
                  <View
                    style={[
                      styles.listAvatar,
                      { borderColor: entry.tierColor + "40" },
                    ]}
                  >
                    <Text style={styles.listAvatarText}>{entry.avatarLetter}</Text>
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={[styles.listName, isCurrentUser && { color: colors.glowCyan }]}>
                      {entry.displayName}
                    </Text>
                  </View>
                  <RankBadge tier={entry.tier} tierColor={entry.tierColor} size="sm" />
                  <Text style={styles.listPoints}>{entry.points.toLocaleString()}</Text>
                </View>
                {idx < rest.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
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
      </ScrollView>

      {/* Distance Picker Modal */}
      <Modal
        visible={showDistancePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDistancePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDistancePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Distance</Text>
            {DISTANCE_OPTIONS.map((option) => {
              const active = selectedDistance === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.modalOption, active && styles.modalOptionActive]}
                  onPress={() => {
                    setSelectedDistance(option);
                    setShowDistancePicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>
                    {option}
                  </Text>
                  {active && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
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
  tabToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 3,
    marginTop: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: borderRadius.full,
  },
  tabBtnActive: {
    backgroundColor: colors.glowCyan + "20",
    borderWidth: 1,
    borderColor: colors.glowCyan + "40",
  },
  tabBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  },
  tabBtnTextActive: {
    color: colors.glowCyan,
  },
  distFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distFilter: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
  },
  podiumSpot: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  podiumSide: {
    paddingTop: 28,
  },
  crown: {
    fontSize: 28,
    marginBottom: -2,
  },
  podiumAvatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowOffset: { width: 0, height: 0 },
  },
  podiumAvatarText: {
    fontWeight: fontWeight.bold,
  },
  podiumUsername: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  podiumPoints: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.semibold,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    gap: 4,
  },
  modalTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
  },
  modalOptionActive: {
    backgroundColor: colors.primary + "15",
  },
  modalOptionText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});
