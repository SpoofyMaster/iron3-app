import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Activity, Discipline } from "@/types";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { GlassCard } from "./GlassCard";
import { formatDistance } from "@/lib/scoring";

const DISCIPLINE_COLORS: Record<Discipline, string> = {
  swim: colors.swim,
  bike: colors.bike,
  run: colors.run,
};

const ICONS: Record<Discipline, keyof typeof Ionicons.glyphMap> = {
  swim: "water",
  bike: "bicycle",
  run: "walk",
};

interface RecentActivitiesProps {
  activities: Activity[];
  title?: string;
}

export function RecentActivities({ activities, title = "Off-plan (watch)" }: RecentActivitiesProps) {
  const router = useRouter();

  if (activities.length === 0) {
    return (
      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.empty}>
          No off-plan watch workouts this week. Synced sessions that match your PREP plan appear above.
        </Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sub}>
        Watch-synced workouts that did not match a planned PREP session (base XP only).
      </Text>
      {activities.map((a, idx) => {
        const c = DISCIPLINE_COLORS[a.discipline];
        return (
          <View key={a.id}>
            {idx > 0 && <View style={styles.divider} />}
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push({ pathname: "/workout/[id]", params: { id: a.id } })}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, { backgroundColor: c + "18" }]}>
                <Ionicons name={ICONS[a.discipline]} size={16} color={c} />
              </View>
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {a.title}
                </Text>
                <Text style={styles.meta}>
                  {Math.round(a.duration / 60)} min
                  {a.discipline !== "swim" ? ` • ${formatDistance(a.discipline, a.distance)}` : ` • ${Math.round(a.distance)}m`}
                </Text>
              </View>
              <Text style={styles.xp}>+{a.pointsEarned} XP</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    gap: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  sub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: 4,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 2 },
  title: { color: colors.text, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  meta: { color: colors.textMuted, fontSize: fontSize.xs },
  xp: { color: colors.glowCyan, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
});
