import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { PrepSessionStatus } from "./PrepSessionStatus";
import { computePrepRowStatus } from "@/lib/prepSessionUi";
import { listPrepSessionVerifications } from "@/lib/prepVerifications";

const DISCIPLINE_COLORS: Record<string, string> = {
  swim: colors.swim,
  bike: "#EC4899",
  run: "#F97316",
  brick: "#F97316",
};

const DISCIPLINE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  swim: "water",
  bike: "bicycle",
  run: "walk",
  rest: "bed-outline",
  brick: "flash",
};

const PREP_DAY_TO_WEEKDAY: Record<string, number> = {
  Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0,
};

interface HomePrepPlanWeekProps {
  todayIdx: number;
}

export function HomePrepPlanWeek({ todayIdx }: HomePrepPlanWeekProps) {
  const prepPlan = useAppStore((s) => s.prepPlan);
  const activities = useAppStore((s) => s.activities);
  const currentUserId = useAppStore((s) => s.currentUserId);

  const week = prepPlan?.weeks[prepPlan.currentWeekIndex];
  const weekNumber = week?.weekNumber ?? 0;

  const [verifications, setVerifications] = useState<Awaited<
    ReturnType<typeof listPrepSessionVerifications>
  >>([]);

  useEffect(() => {
    if (!currentUserId || !weekNumber) {
      setVerifications([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      const rows = await listPrepSessionVerifications(currentUserId, weekNumber);
      if (!cancelled) setVerifications(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId, weekNumber, activities.length]);

  const rows = useMemo(() => {
    if (!prepPlan || !week) return null;
    return week.sessions.map((session) => {
      const status = computePrepRowStatus(session, week, verifications, activities);
      return { session, status };
    });
  }, [prepPlan, week, verifications, activities]);

  if (!prepPlan || !week || !rows) return null;

  return (
    <>
      {rows.map(({ session, status }, idx, arr) => {
        const sColor = DISCIPLINE_COLORS[session.discipline] ?? colors.textMuted;
        const dayWeekday = PREP_DAY_TO_WEEKDAY[session.day];
        const isToday = dayWeekday === todayIdx;
        const isRest = session.discipline === "rest";
        return (
          <View key={session.id}>
            <View style={[styles.planRow, isToday && styles.planRowToday]}>
              <Text style={[styles.planDay, isToday && { color: colors.glowCyan }]}>
                {session.day.toUpperCase()}
              </Text>
              <View style={[styles.planIcon, { backgroundColor: sColor + "15" }]}>
                <Ionicons
                  name={DISCIPLINE_ICONS[session.discipline] ?? "fitness"}
                  size={14}
                  color={sColor}
                />
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle} numberOfLines={1}>
                  {session.notes}
                </Text>
                {!isRest && <Text style={styles.planStats}>{session.durationMin} min</Text>}
              </View>
              <View style={styles.statusCol}>
                <PrepSessionStatus status={status} compact />
              </View>
            </View>
            {idx < arr.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  planRowToday: {
    backgroundColor: "rgba(6, 182, 212, 0.05)",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: borderRadius.sm,
  },
  planDay: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    width: 28,
    letterSpacing: 0.5,
  },
  planIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  planInfo: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  planTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  planStats: {
    color: colors.textMuted,
    fontSize: 10,
  },
  statusCol: {
    width: 28,
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
});
