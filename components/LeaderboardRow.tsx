import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LeaderboardEntry } from "@/types";
import { RankBadge } from "./RankBadge";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";
import { formatPoints } from "@/lib/ranks";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

export function LeaderboardRow({ entry, isCurrentUser }: LeaderboardRowProps) {
  const rankColors: Record<number, string> = {
    1: "#F59E0B",
    2: "#94A3B8",
    3: "#D97706",
  };

  const isEven = entry.rank % 2 === 0;

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUser,
        !isCurrentUser && isEven && styles.evenRow,
      ]}
    >
      <View style={styles.rankSection}>
        <Text
          style={[
            styles.rankNumber,
            entry.rank <= 3 && { color: rankColors[entry.rank], fontWeight: fontWeight.extrabold },
          ]}
        >
          {entry.rank}
        </Text>
      </View>
      <View style={[styles.avatar, { borderColor: entry.tierColor + "60" }]}>
        <Text style={[styles.avatarText, { color: entry.tierColor }]}>
          {entry.displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, isCurrentUser && styles.currentUserName]}
            numberOfLines={1}
          >
            {entry.displayName}
          </Text>
          {entry.isFriend && (
            <View style={styles.friendBadge}>
              <Text style={styles.friendText}>Friend</Text>
            </View>
          )}
        </View>
        <View style={styles.rankInfo}>
          <RankBadge tier={entry.tier} tierColor={entry.tierColor} size="sm" />
          <Text style={[styles.tierName, { color: entry.tierColor }]}>
            {entry.tier}
          </Text>
        </View>
      </View>
      <Text style={[styles.points, { color: entry.tierColor }]}>{formatPoints(entry.points)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    borderRadius: borderRadius.md,
  },
  currentUser: {
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.25)",
  },
  evenRow: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  rankSection: {
    width: 28,
    alignItems: "center",
  },
  rankNumber: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  currentUserName: {
    color: colors.primaryLight,
    fontWeight: fontWeight.bold,
  },
  friendBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  friendText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: fontWeight.semibold,
  },
  rankInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tierName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  points: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.extrabold,
  },
});
