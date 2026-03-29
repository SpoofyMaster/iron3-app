import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DISCIPLINE_COLORS: Record<string, string> = {
  swim: colors.swim,
  bike: colors.bike,
  run: colors.run,
};

const DISCIPLINE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  swim: "water",
  bike: "bicycle",
  run: "walk",
};

export default function WeeklyReportScreen() {
  const router = useRouter();
  const activities = useAppStore((s) => s.activities);
  const weeklyVolumes = useAppStore((s) => s.weeklyVolumes);

  // Current week boundaries (Mon-Sun)
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // Mon=1..Sun=7
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekLabel = `${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${weekEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  // Filter activities to current week
  const weekActivities = useMemo(() => {
    const start = weekStart.getTime();
    const end = weekEnd.getTime() + 86400000; // include end day
    return activities.filter((a) => {
      const d = new Date(a.date).getTime();
      return d >= start && d < end;
    });
  }, [activities]);

  // Totals
  const totalDistance = weekActivities.reduce((s, a) => s + a.distance, 0);
  const totalDuration = weekActivities.reduce((s, a) => s + a.duration, 0);
  const totalPoints = weekActivities.reduce((s, a) => s + a.pointsEarned, 0);

  // Discipline summary
  const disciplineSummary = useMemo(() => {
    const summary: Record<
      string,
      { sessions: number; distance: number; duration: number; points: number }
    > = {};
    for (const a of weekActivities) {
      if (!summary[a.discipline]) {
        summary[a.discipline] = { sessions: 0, distance: 0, duration: 0, points: 0 };
      }
      summary[a.discipline].sessions += 1;
      summary[a.discipline].distance += a.distance;
      summary[a.discipline].duration += a.duration;
      summary[a.discipline].points += a.pointsEarned;
    }
    return summary;
  }, [weekActivities]);

  // Daily breakdown (Mon-Sun)
  const dailyBreakdown = useMemo(() => {
    return DAY_NAMES.map((dayName, idx) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + idx);
      const dateStr = dayDate.toISOString().split("T")[0];

      const dayActs = weekActivities.filter(
        (a) => new Date(a.date).toISOString().split("T")[0] === dateStr
      );

      if (dayActs.length === 0) {
        return { day: dayName, discipline: null as string | null, distance: 0, duration: 0, points: 0 };
      }

      // If multiple activities in a day, show the primary one (most points)
      const primary = dayActs.reduce((best, a) =>
        a.pointsEarned > best.pointsEarned ? a : best
      );
      const totalPts = dayActs.reduce((s, a) => s + a.pointsEarned, 0);
      const totalDist = dayActs.reduce((s, a) => s + a.distance, 0);
      const totalDur = dayActs.reduce((s, a) => s + a.duration, 0);

      return {
        day: dayName,
        discipline: primary.discipline,
        distance: totalDist,
        duration: totalDur,
        points: totalPts,
      };
    });
  }, [weekActivities]);

  const activeDays = dailyBreakdown.filter((d) => d.discipline !== null).length;

  // 8-week trend from weeklyVolumes
  const weeklyDistances = useMemo(() => {
    return weeklyVolumes.map((wv) => ({
      week: wv.week,
      distance:
        wv.swimHours * 2.5 + // rough: swim ~2.5km/hr
        wv.bikeHours * 25 + // rough: bike ~25km/hr
        wv.runHours * 9, // rough: run ~9km/hr
    }));
  }, [weeklyVolumes]);

  // If weeklyVolumes is empty or all zeros, compute from activities directly
  const effectiveWeeklyDistances = useMemo(() => {
    const hasData = weeklyDistances.some((w) => w.distance > 0);
    if (hasData) return weeklyDistances;

    // Compute from raw activities for last 8 weeks
    const weeks = [];
    for (let w = 7; w >= 0; w--) {
      const wStart = new Date(weekStart);
      wStart.setDate(wStart.getDate() - w * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wEnd.getDate() + 7);

      const wActs = activities.filter((a) => {
        const d = new Date(a.date);
        return d >= wStart && d < wEnd;
      });

      weeks.push({
        week: `W${8 - w}`,
        distance: wActs.reduce((s, a) => s + a.distance, 0),
      });
    }
    return weeks;
  }, [activities, weeklyDistances]);

  const maxDist = Math.max(...effectiveWeeklyDistances.map((w) => w.distance), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Week header */}
        <View style={styles.weekBanner}>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          <Text style={styles.weekSubtext}>
            {activeDays}/7 active days • {weekActivities.length} workout
            {weekActivities.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Summary stats */}
        <View style={styles.statRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{totalDistance.toFixed(1)}</Text>
            <Text style={styles.statUnit}>km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </Text>
            <Text style={styles.statUnit}> </Text>
            <Text style={styles.statLabel}>Time</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              +{totalPoints}
            </Text>
            <Text style={styles.statUnit}>RR</Text>
            <Text style={styles.statLabel}>Points</Text>
          </GlassCard>
        </View>

        {/* Weekly distance trend */}
        <SectionHeader title="8-Week Distance Trend" />
        <GlassCard>
          <View style={styles.chartContainer}>
            {effectiveWeeklyDistances.map((w, idx) => {
              const barHeight = maxDist > 0 ? (w.distance / maxDist) * 100 : 0;
              const isCurrentWeek = idx === effectiveWeeklyDistances.length - 1;
              return (
                <View key={idx} style={styles.chartBar}>
                  <Text style={styles.chartValue}>
                    {w.distance > 0 ? w.distance.toFixed(1) : ""}
                  </Text>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: Math.max(barHeight, 2),
                        backgroundColor: isCurrentWeek
                          ? colors.primary
                          : w.distance > 0
                          ? colors.glowCyan
                          : "rgba(255,255,255,0.05)",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.chartLabel,
                      isCurrentWeek && { color: colors.primary },
                    ]}
                  >
                    {w.week}
                  </Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        {/* Discipline breakdown */}
        {Object.keys(disciplineSummary).length > 0 && (
          <>
            <SectionHeader title="By Discipline" />
            {Object.entries(disciplineSummary).map(([disc, data]) => (
              <GlassCard key={disc} style={styles.discCard}>
                <View style={styles.discHeader}>
                  <View
                    style={[
                      styles.discIconBg,
                      {
                        backgroundColor:
                          (DISCIPLINE_COLORS[disc] ?? colors.textMuted) + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={DISCIPLINE_ICONS[disc] ?? "fitness"}
                      size={20}
                      color={DISCIPLINE_COLORS[disc] ?? colors.textMuted}
                    />
                  </View>
                  <Text
                    style={[
                      styles.discName,
                      { color: DISCIPLINE_COLORS[disc] ?? colors.text },
                    ]}
                  >
                    {disc.charAt(0).toUpperCase() + disc.slice(1)}
                  </Text>
                  <Text style={styles.discSessions}>
                    {data.sessions} session{data.sessions > 1 ? "s" : ""}
                  </Text>
                </View>
                <View style={styles.discStats}>
                  <View style={styles.discStatItem}>
                    <Text style={styles.discStatValue}>
                      {data.distance.toFixed(1)} km
                    </Text>
                    <Text style={styles.discStatLabel}>Distance</Text>
                  </View>
                  <View style={styles.discStatItem}>
                    <Text style={styles.discStatValue}>
                      {Math.floor(data.duration / 60)}h {data.duration % 60}m
                    </Text>
                    <Text style={styles.discStatLabel}>Time</Text>
                  </View>
                  <View style={styles.discStatItem}>
                    <Text
                      style={[styles.discStatValue, { color: colors.success }]}
                    >
                      +{data.points}
                    </Text>
                    <Text style={styles.discStatLabel}>Points</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </>
        )}

        {/* Daily breakdown */}
        <SectionHeader title="Daily Breakdown" />
        <GlassCard style={styles.dailyCard}>
          {dailyBreakdown.map((day, idx) => (
            <View key={day.day}>
              <View style={styles.dailyRow}>
                <Text style={styles.dailyDay}>{day.day}</Text>
                {day.discipline ? (
                  <>
                    <View
                      style={[
                        styles.dailyDot,
                        {
                          backgroundColor:
                            DISCIPLINE_COLORS[day.discipline] ?? colors.textMuted,
                        },
                      ]}
                    />
                    <View style={styles.dailyInfo}>
                      <Text style={styles.dailyDisc}>
                        {day.discipline.charAt(0).toUpperCase() +
                          day.discipline.slice(1)}
                      </Text>
                      <Text style={styles.dailyDetail}>
                        {day.distance > 0
                          ? `${day.distance.toFixed(1)} km • `
                          : ""}
                        {day.duration} min
                      </Text>
                    </View>
                    <Text style={styles.dailyPoints}>+{day.points} RR</Text>
                  </>
                ) : (
                  <>
                    <View
                      style={[
                        styles.dailyDot,
                        { backgroundColor: colors.textMuted },
                      ]}
                    />
                    <View style={styles.dailyInfo}>
                      <Text style={styles.dailyRest}>Rest Day</Text>
                    </View>
                    <Text style={styles.dailyPointsMuted}>—</Text>
                  </>
                )}
              </View>
              {idx < dailyBreakdown.length - 1 && (
                <View style={styles.dailyDivider} />
              )}
            </View>
          ))}
        </GlassCard>

        {weekActivities.length === 0 && (
          <GlassCard style={{ alignItems: "center", paddingVertical: 32 }}>
            <Ionicons
              name="fitness-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fontSize.md,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              No workouts this week yet.{"\n"}Get out there!
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: 14, paddingBottom: 40 },
  weekBanner: { alignItems: "center", gap: 4, paddingVertical: 8 },
  weekLabel: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  weekSubtext: { color: colors.textSecondary, fontSize: fontSize.sm },
  statRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 2 },
  statValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statUnit: { color: colors.textMuted, fontSize: fontSize.xs },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 140,
    paddingTop: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  chartBarFill: { width: "65%", borderRadius: 4, minHeight: 2 },
  chartValue: { color: colors.textMuted, fontSize: 8 },
  chartLabel: { color: colors.textMuted, fontSize: 9 },
  discCard: { gap: 12 },
  discHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  discIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  discName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    flex: 1,
  },
  discSessions: { color: colors.textMuted, fontSize: fontSize.xs },
  discStats: { flexDirection: "row", gap: 16 },
  discStatItem: { flex: 1, gap: 2 },
  discStatValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  discStatLabel: { color: colors.textMuted, fontSize: fontSize.xs },
  dailyCard: { padding: 0, overflow: "hidden" },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  dailyDay: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    width: 32,
  },
  dailyDot: { width: 8, height: 8, borderRadius: 4 },
  dailyInfo: { flex: 1, gap: 1 },
  dailyDisc: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  dailyDetail: { color: colors.textMuted, fontSize: fontSize.xs },
  dailyRest: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: "italic",
  },
  dailyPoints: {
    color: colors.success,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  dailyPointsMuted: { color: colors.textMuted, fontSize: fontSize.sm },
  dailyDivider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginHorizontal: 16,
  },
});
