import React, { useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, SectionList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { PrepPlanWeek, PrepSession, PrepPhase } from "@/types";
import { daysUntil } from "@/lib/ironmanEvents";

// ── Phase colors ─────────────────────────────────────────────────────────────
const PHASE_COLORS: Record<PrepPhase, string> = {
  Base:         "#3B82F6",  // blue
  Build:        "#F59E0B",  // orange
  Peak:         "#EF4444",  // red
  Taper:        "#10B981",  // green
  "Race Week":  "#8B5CF6",  // purple
};

const DISCIPLINE_ICONS: Record<string, string> = {
  swim: "water",
  bike: "bicycle",
  run:  "walk",
  brick: "flash",
  rest: "moon",
};

// ── Session Card ─────────────────────────────────────────────────────────────
function SessionCard({
  session,
  weekIndex,
  onToggle,
}: {
  session: PrepSession;
  weekIndex: number;
  onToggle: () => void;
}) {
  const icon = DISCIPLINE_ICONS[session.discipline] ?? "fitness";
  const isRest = session.discipline === "rest";

  return (
    <TouchableOpacity
      style={[styles.sessionCard, session.completed && styles.sessionCardDone, isRest && styles.sessionCardRest]}
      onPress={onToggle}
      activeOpacity={0.75}
    >
      <View style={styles.sessionLeft}>
        <View style={[styles.sessionDayPill, isRest && styles.sessionDayPillRest]}>
          <Text style={[styles.sessionDay, isRest && styles.sessionDayRest]}>{session.day}</Text>
        </View>
        <View style={styles.sessionIconWrap}>
          <Ionicons name={icon as any} size={16} color={isRest ? colors.textMuted : colors.primary} />
        </View>
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionDiscipline, isRest && styles.sessionDisciplineRest]}>
            {session.discipline === "rest" ? "Rest Day" :
             session.discipline.charAt(0).toUpperCase() + session.discipline.slice(1)}
            {" "}
            <Text style={styles.sessionType}>({session.type.replace("_", " ")})</Text>
          </Text>
          {session.durationMin > 0 && (
            <Text style={styles.sessionDuration}>{session.durationMin} min</Text>
          )}
          {session.notes ? (
            <Text style={styles.sessionNotes} numberOfLines={2}>{session.notes}</Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity style={styles.checkBtn} onPress={onToggle}>
        <Ionicons
          name={session.completed ? "checkmark-circle" : "ellipse-outline"}
          size={22}
          color={session.completed ? "#10B981" : colors.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Week Card ─────────────────────────────────────────────────────────────────
function WeekCard({
  week,
  weekIndex,
  isCurrentWeek,
  isExpanded,
  onToggleExpand,
  onToggleSession,
}: {
  week: PrepPlanWeek;
  weekIndex: number;
  isCurrentWeek: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleSession: (sessionId: string) => void;
}) {
  const phaseColor = PHASE_COLORS[week.phase];
  const completedCount = week.sessions.filter(s => s.completed).length;
  const totalCount = week.sessions.filter(s => s.discipline !== "rest").length;

  return (
    <View style={[styles.weekCard, isCurrentWeek && styles.weekCardCurrent]}>
      <TouchableOpacity style={styles.weekHeader} onPress={onToggleExpand} activeOpacity={0.8}>
        {/* Phase color bar */}
        <View style={[styles.phaseDot, { backgroundColor: phaseColor }]} />

        <View style={styles.weekHeaderInfo}>
          <View style={styles.weekTitleRow}>
            <Text style={styles.weekNum}>Week {week.weekNumber}</Text>
            {isCurrentWeek && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT</Text>
              </View>
            )}
          </View>
          <Text style={styles.weekTheme}>{week.theme}</Text>
          <View style={styles.weekMeta}>
            <View style={[styles.phaseBadge, { borderColor: phaseColor + "50", backgroundColor: phaseColor + "15" }]}>
              <Text style={[styles.phaseBadgeText, { color: phaseColor }]}>{week.phase.toUpperCase()}</Text>
            </View>
            <Text style={styles.weekHours}>{week.totalHours}h planned</Text>
            <Text style={styles.weekProgress}>{completedCount}/{totalCount} done</Text>
          </View>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.weekSessions}>
          {week.sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              weekIndex={weekIndex}
              onToggle={() => onToggleSession(session.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PrepPlanScreen() {
  const router = useRouter();
  const { prepPlan, selectedRaceEvent, markPrepSessionComplete } = useAppStore();
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(
    new Set(prepPlan ? [prepPlan.currentWeekIndex] : [])
  );

  if (!prepPlan || !selectedRaceEvent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PREP Plan</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={60} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No PREP Plan Yet</Text>
          <Text style={styles.emptySubtitle}>
            Go to Race Calendar and select your target event to generate a personalized plan.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push("/events" as any)}>
            <Text style={styles.emptyBtnText}>Browse Races</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const days = daysUntil(selectedRaceEvent.date);
  const currentWeek = prepPlan.weeks[prepPlan.currentWeekIndex];

  const toggleWeek = (idx: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // Group weeks by month for section headers
  type WeekSection = { title: string; data: { week: PrepPlanWeek; index: number }[] };
  const sections: WeekSection[] = [];
  prepPlan.weeks.forEach((week, i) => {
    const d = new Date(week.weekOf);
    const month = d.toLocaleString("default", { month: "long", year: "numeric" });
    const last = sections[sections.length - 1];
    if (!last || last.title !== month) {
      sections.push({ title: month, data: [{ week, index: i }] });
    } else {
      last.data.push({ week, index: i });
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PREP Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => `week-${item.index}`}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={() => (
          <View>
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.heroFlag}>{selectedRaceEvent.flag}</Text>
              <Text style={styles.heroRace}>{selectedRaceEvent.name}</Text>
              <Text style={styles.heroLocation}>{selectedRaceEvent.location}, {selectedRaceEvent.country}</Text>

              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNum}>{days}</Text>
                  <Text style={styles.heroStatLabel}>days to race</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNum}>{prepPlan.totalWeeks}</Text>
                  <Text style={styles.heroStatLabel}>total weeks</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNum}>{prepPlan.currentWeekIndex + 1}</Text>
                  <Text style={styles.heroStatLabel}>current week</Text>
                </View>
              </View>
            </View>

            {/* Current week highlight */}
            {currentWeek && (
              <View style={styles.currentWeekSection}>
                <Text style={styles.sectionLabel}>THIS WEEK</Text>
                <WeekCard
                  week={currentWeek}
                  weekIndex={prepPlan.currentWeekIndex}
                  isCurrentWeek
                  isExpanded
                  onToggleExpand={() => {}}
                  onToggleSession={(sid) => markPrepSessionComplete(prepPlan.currentWeekIndex, sid)}
                />
              </View>
            )}

            <Text style={styles.fullPlanLabel}>FULL PLAN</Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const { week, index } = item;
          if (index === prepPlan.currentWeekIndex) return null; // already shown above
          return (
            <WeekCard
              week={week}
              weekIndex={index}
              isCurrentWeek={false}
              isExpanded={expandedWeeks.has(index)}
              onToggleExpand={() => toggleWeek(index)}
              onToggleSession={(sid) => markPrepSessionComplete(index, sid)}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceGlassBorder,
  },
  backBtn: { width: 40 },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },

  // Hero
  hero: {
    padding: spacing.xl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceGlassBorder,
    marginBottom: spacing.lg,
  },
  heroFlag: { fontSize: 48, marginBottom: spacing.sm },
  heroRace: { fontSize: fontSize.xl, fontWeight: fontWeight.extrabold, color: colors.text, textAlign: "center" },
  heroLocation: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 0 },
  heroStat: { alignItems: "center", paddingHorizontal: spacing.xl },
  heroStatNum: { fontSize: 28, fontWeight: fontWeight.extrabold, color: colors.primary },
  heroStatLabel: { fontSize: fontSize.xs, color: colors.textMuted },
  heroStatDivider: { width: 1, height: 36, backgroundColor: colors.surfaceGlassBorder },

  // Sections
  currentWeekSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionLabel: {
    fontSize: 11, fontWeight: fontWeight.bold, color: colors.primary,
    letterSpacing: 1.5, marginBottom: spacing.sm,
  },
  fullPlanLabel: {
    fontSize: 11, fontWeight: fontWeight.bold, color: colors.textMuted,
    letterSpacing: 1.5, marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  monthHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  monthTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  // Week card
  weekCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    overflow: "hidden",
  },
  weekCardCurrent: {
    borderColor: `${colors.primary}40`,
    backgroundColor: `${colors.primary}08`,
  },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  phaseDot: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  weekHeaderInfo: { flex: 1 },
  weekTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 2 },
  weekNum: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  currentBadge: {
    backgroundColor: `${colors.primary}25`,
    borderRadius: borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: `${colors.primary}50`,
  },
  currentBadgeText: { fontSize: 9, fontWeight: fontWeight.bold, color: colors.primary, letterSpacing: 1 },
  weekTheme: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 6 },
  weekMeta: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  phaseBadge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  phaseBadgeText: { fontSize: 9, fontWeight: fontWeight.bold, letterSpacing: 0.8 },
  weekHours: { fontSize: fontSize.xs, color: colors.textMuted },
  weekProgress: { fontSize: fontSize.xs, color: colors.textMuted },

  // Sessions
  weekSessions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  sessionCardDone: {
    opacity: 0.55,
    backgroundColor: "rgba(16,185,129,0.06)",
    borderColor: "rgba(16,185,129,0.15)",
  },
  sessionCardRest: {
    opacity: 0.6,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  sessionLeft: { flexDirection: "row", alignItems: "flex-start", flex: 1, gap: spacing.sm },
  sessionDayPill: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 34,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  sessionDayPillRest: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  sessionDay: { fontSize: 11, fontWeight: fontWeight.bold, color: colors.primary },
  sessionDayRest: { color: colors.textMuted },
  sessionIconWrap: { paddingTop: 1 },
  sessionInfo: { flex: 1 },
  sessionDiscipline: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  sessionDisciplineRest: { color: colors.textMuted },
  sessionType: { color: colors.textMuted, fontWeight: fontWeight.regular ?? "400" },
  sessionDuration: { fontSize: fontSize.xs, color: colors.primary, marginTop: 1 },
  sessionNotes: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 3, lineHeight: 16 },
  checkBtn: { paddingLeft: spacing.sm, paddingTop: 2 },

  // Empty state
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl ?? 40 },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  emptySubtitle: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: "center", lineHeight: 22, marginBottom: spacing.xl },
  emptyBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  emptyBtnText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: "#fff" },
});
