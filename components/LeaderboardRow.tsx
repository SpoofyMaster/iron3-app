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
    1: "#FFD700",
    2: "#C0C0C0",
    3: "#CD7F32",
  };

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUser,
      ]}
    >
      <View style={styles.rankSection}>
        <Text
          style={[
            styles.rankNumber,
            entry.rank <= 3 && { color: rankColors[entry.rank] },
          ]}
        >
          {entry.rank}
        </Text>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
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
      <Text style={styles.points}>{formatPoints(entry.points)}</Text>
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
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
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
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
