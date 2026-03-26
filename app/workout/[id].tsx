import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius, disciplineColors } from "@/theme";
import { formatDuration, formatDistance, formatPace } from "@/lib/scoring";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MOCK_LAPS = [
  { km: 1, pace: 325 },
  { km: 2, pace: 310 },
  { km: 3, pace: 318 },
  { km: 4, pace: 305 },
  { km: 5, pace: 330 },
  { km: 6, pace: 298 },
  { km: 7, pace: 315 },
  { km: 8, pace: 340 },
  { km: 9, pace: 290 },
  { km: 10, pace: 285 },
  { km: 11, pace: 310 },
  { km: 12, pace: 305 },
  { km: 13, pace: 295 },
  { km: 14, pace: 288 },
];

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activities = useAppStore((s) => s.activities);
  const activity = useMemo(() => activities.find((a) => a.id === id), [activities, id]);

  if (!activity) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.notFoundText}>Activity not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dColors = disciplineColors[activity.discipline];
  const dateStr = new Date(activity.date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const timeStr = new Date(activity.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const locationName = activity.discipline === "swim"
    ? "Pool Session"
    : activity.discipline === "bike"
    ? "Road Cycling"
    : "Amsterdam Running";

  const laps = MOCK_LAPS.slice(0, Math.max(3, Math.floor(activity.distance)));
  const maxPace = Math.max(...laps.map((l) => l.pace));
  const minPace = Math.min(...laps.map((l) => l.pace));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerDate}>
              {dateStr} {timeStr}
            </Text>
            <Text style={styles.headerTitle}>{locationName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/workout/share", params: { id: activity.id } })}
            style={styles.shareBtn}
          >
            <Ionicons name="share-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Map placeholder */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={["#0a1628", "#0d2137", "#0a1628"]}
            style={styles.mapGradient}
          >
            <View style={styles.mapGrid}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 16}%` }]} />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 12}%` }]} />
              ))}
            </View>
            {/* Route visualization */}
            <View style={styles.routePath}>
              <View style={[styles.routeDot, { left: "15%", top: "70%", backgroundColor: dColors.main }]} />
              <View style={[styles.routeLine, { left: "17%", top: "62%", width: 50, transform: [{ rotate: "-35deg" }], backgroundColor: dColors.main + "80" }]} />
              <View style={[styles.routeDot, { left: "30%", top: "45%", backgroundColor: dColors.main }]} />
              <View style={[styles.routeLine, { left: "33%", top: "42%", width: 60, transform: [{ rotate: "15deg" }], backgroundColor: dColors.main + "80" }]} />
              <View style={[styles.routeDot, { left: "52%", top: "48%", backgroundColor: dColors.main }]} />
              <View style={[styles.routeLine, { left: "55%", top: "52%", width: 45, transform: [{ rotate: "40deg" }], backgroundColor: dColors.main + "80" }]} />
              <View style={[styles.routeDot, { left: "70%", top: "60%", backgroundColor: dColors.main }]} />
              <View style={[styles.routeLine, { left: "72%", top: "55%", width: 40, transform: [{ rotate: "-20deg" }], backgroundColor: dColors.main + "80" }]} />
              <View style={[styles.routeDot, { left: "85%", top: "40%", backgroundColor: dColors.main }]} />
            </View>
            <View style={[styles.disciplineBadge, { backgroundColor: dColors.main + "20", borderColor: dColors.main + "40" }]}>
              <Ionicons
                name={activity.discipline === "swim" ? "water" : activity.discipline === "bike" ? "bicycle" : "walk"}
                size={16}
                color={dColors.main}
              />
              <Text style={[styles.disciplineText, { color: dColors.main }]}>
                {activity.title}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatDuration(activity.duration)}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{formatDistance(activity.discipline, activity.distance)}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Avg. Pace</Text>
            <Text style={styles.statValue}>{formatPace(activity.discipline, activity.pace)}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Elevation</Text>
            <Text style={styles.statValue}>
              {activity.discipline === "bike" ? "234 m" : activity.discipline === "run" ? "15 m" : "0 m"}
            </Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Avg. Cadence</Text>
            <Text style={styles.statValue}>
              {activity.discipline === "run" ? "161 spm" : activity.discipline === "bike" ? "85 rpm" : "32 spm"}
            </Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>XP Earned</Text>
            <Text style={[styles.statValue, { color: dColors.main }]}>+{activity.pointsEarned}</Text>
          </GlassCard>
        </View>

        {/* Laps Section */}
        <SectionHeader title="Laps" />
        <GlassCard>
          <View style={styles.lapHeader}>
            <Text style={styles.lapCount}>{laps.length} total</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewLapDetails}>View lap details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lapsChart}>
            {laps.map((lap, idx) => {
              const normalized = (lap.pace - minPace) / (maxPace - minPace || 1);
              const barHeight = 20 + normalized * 60;
              return (
                <View key={idx} style={styles.lapBarContainer}>
                  <View
                    style={[
                      styles.lapBar,
                      {
                        height: barHeight,
                        backgroundColor: lap.pace <= 300 ? "#F59E0B" : "#F97316",
                        opacity: 0.7 + (1 - normalized) * 0.3,
                      },
                    ]}
                  />
                  <Text style={styles.lapNum}>{idx + 1}</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        {/* Points breakdown */}
        <SectionHeader title="Points Breakdown" />
        <GlassCard>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Distance Bonus</Text>
            <Text style={[styles.pointsValue, { color: dColors.main }]}>+{activity.distanceBonus}</Text>
          </View>
          <View style={styles.pointsDivider} />
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Pace Bonus</Text>
            <Text style={[styles.pointsValue, { color: dColors.main }]}>+{activity.paceBonus}</Text>
          </View>
          <View style={styles.pointsDivider} />
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Total XP</Text>
            <Text style={[styles.pointsTotal, { color: dColors.main }]}>+{activity.pointsEarned}</Text>
          </View>
        </GlassCard>
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
    gap: 16,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: spacing.lg,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    height: 200,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  mapGradient: {
    flex: 1,
    position: "relative",
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(6, 182, 212, 0.06)",
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(6, 182, 212, 0.06)",
  },
  routePath: {
    ...StyleSheet.absoluteFillObject,
  },
  routeDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  routeLine: {
    position: "absolute",
    height: 2,
    borderRadius: 1,
  },
  disciplineBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  disciplineText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  statCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - 10) / 2,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  lapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lapCount: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  viewLapDetails: {
    color: colors.glowCyan,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  lapsChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 100,
  },
  lapBarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  lapBar: {
    width: "80%",
    borderRadius: 3,
    minHeight: 10,
  },
  lapNum: {
    color: colors.textMuted,
    fontSize: 9,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  pointsLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  pointsValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  pointsTotal: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  pointsDivider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
});
