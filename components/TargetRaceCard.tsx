import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { daysUntil } from "@/lib/ironmanEvents";

export function TargetRaceCard() {
  const router = useRouter();
  const { selectedRaceEvent, prepPlan } = useAppStore();

  if (!selectedRaceEvent) return null;

  const days = daysUntil(selectedRaceEvent.date);
  const totalWeeks = prepPlan?.totalWeeks ?? 0;
  const currentWeek = prepPlan?.currentWeekIndex ?? 0;
  const progress = totalWeeks > 0 ? Math.min(1, currentWeek / totalWeeks) : 0;

  return (
    <TouchableOpacity
      onPress={() => router.push("/prep-plan" as any)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#2d1200", "#1a0800"]}
        style={styles.card}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Ionicons name="flag" size={11} color={colors.primary} />
            <Text style={styles.badgeText}>TARGET RACE</Text>
          </View>
          <Text style={styles.flag}>{selectedRaceEvent.flag}</Text>
        </View>

        {/* Race name */}
        <Text style={styles.raceName} numberOfLines={1}>
          {selectedRaceEvent.name}
        </Text>
        <Text style={styles.location}>
          <Ionicons name="location-outline" size={12} color={colors.textMuted} />{" "}
          {selectedRaceEvent.location}, {selectedRaceEvent.country}
        </Text>

        {/* Countdown */}
        <View style={styles.countdownRow}>
          <View style={styles.countdownBlock}>
            <Text style={styles.countdownNum}>{days}</Text>
            <Text style={styles.countdownLabel}>days to race</Text>
          </View>
          {totalWeeks > 0 && (
            <View style={styles.countdownBlock}>
              <Text style={styles.countdownNum}>
                {currentWeek + 1}<Text style={styles.countdownOf}>/{totalWeeks}</Text>
              </Text>
              <Text style={styles.countdownLabel}>current week</Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        {totalWeeks > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        )}

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaText}>View PREP Plan</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: `${colors.primary}35`,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.primary}18`,
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  flag: { fontSize: 28 },
  raceName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  countdownRow: {
    flexDirection: "row",
    gap: spacing.xl,
    marginBottom: spacing.sm,
  },
  countdownBlock: { alignItems: "flex-start" },
  countdownNum: {
    fontSize: 36,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    lineHeight: 40,
  },
  countdownOf: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
  countdownLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ctaText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
