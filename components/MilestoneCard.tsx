import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Milestone } from "@/types";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

interface MilestoneCardProps {
  milestone: Milestone;
  compact?: boolean;
}

export function MilestoneCard({ milestone, compact = false }: MilestoneCardProps) {
  const achieved = milestone.achievedAt !== null;
  const dateStr = achieved
    ? new Date(milestone.achievedAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  if (compact) {
    return (
      <View style={[styles.compactContainer, !achieved && styles.locked]}>
        <Text style={styles.compactIcon}>{milestone.icon}</Text>
        <View style={styles.compactText}>
          <Text style={[styles.compactTitle, !achieved && styles.lockedText]} numberOfLines={1}>
            {milestone.title}
          </Text>
          {dateStr && <Text style={styles.compactDate}>{dateStr}</Text>}
        </View>
        {achieved && (
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        )}
        {!achieved && (
          <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, !achieved && styles.locked]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{milestone.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !achieved && styles.lockedText]}>
          {milestone.title}
        </Text>
        <Text style={styles.description}>{milestone.description}</Text>
        {dateStr && <Text style={styles.date}>{dateStr}</Text>}
      </View>
      {achieved && (
        <Ionicons name="checkmark-circle" size={22} color={colors.success} />
      )}
      {!achieved && (
        <Ionicons name="lock-closed" size={20} color={colors.textMuted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  locked: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceGlass,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  lockedText: {
    color: colors.textMuted,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  compactIcon: {
    fontSize: 18,
  },
  compactText: {
    flex: 1,
    gap: 1,
  },
  compactTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  compactDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
