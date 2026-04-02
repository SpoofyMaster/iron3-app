import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import {
  TriRankDisplay,
  DisciplineCard,
  SectionHeader,
  StatCard,
  GlassCard,
  PremiumBanner,
  GradientBackground,
  LevelStreakBar,
  HomePrepPlanWeek,
  RecentActivities,
} from "@/components";
import { filterOffPlanWatchActivities } from "@/lib/prepSessionUi";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { formatDistance } from "@/lib/scoring";
import { getTriRank } from "@/lib/ranks";
import { MOTIVATIONAL_MESSAGES } from "@/lib/mockData";
import { getNextEvent, daysUntil } from "@/lib/ironmanEvents";
import { TargetRaceCard } from "@/components/TargetRaceCard";
import { XpDecayWarning } from "@/components/XpDecayWarning";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

const PREP_DAY_TO_MONDAY_IDX: Record<string, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
};

export default function HomeScreen() {
  const router = useRouter();
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);
  const activities = useAppStore((s) => s.activities);
  const weeklyStats = useAppStore((s) => s.weeklyStats);
  const isPremium = useAppStore((s) => s.user.isPremium);
  const displayName = useAppStore((s) => s.user.displayName);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const selectedRaceEvent = useAppStore((s) => s.selectedRaceEvent);
  const performanceStats = useAppStore((s) => s.performanceStats);
  const milestones = useAppStore((s) => s.milestones);
  const trainingPlan = useAppStore((s) => s.trainingPlan);
  const prepPlan = useAppStore((s) => s.prepPlan);

  const daysToRace = useMemo(() => {
    if (!selectedRaceEvent?.date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parse just the date portion to avoid UTC offset shifting the day
    const dateStr = selectedRaceEvent.date.slice(0, 10); // "YYYY-MM-DD"
    const [y, m, d] = dateStr.split("-").map(Number);
    const raceDay = new Date(y, m - 1, d);
    const diff = raceDay.getTime() - today.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }, [selectedRaceEvent]);

  // Next real Ironman event from global calendar
  const nextIronmanEvent = useMemo(() => getNextEvent(), []);

  const nextMilestone = useMemo(() => {
    return milestones.find((m) => m.achievedAt === null);
  }, [milestones]);

  const motivationalMsg = useMemo(() => {
    const idx = Math.floor(Date.now() / (1000 * 60 * 60)) % MOTIVATIONAL_MESSAGES.length;
    return MOTIVATIONAL_MESSAGES[idx];
  }, []);

  const weeklyGoal = 4;
  const weeklyProgress = useMemo(
    () => Math.min(weeklyStats.totalActivities / weeklyGoal, 1),
    [weeklyStats.totalActivities]
  );

  const lastSwim = useMemo(() => activities.filter((a) => a.discipline === "swim")[0], [activities]);
  const lastBike = useMemo(() => activities.filter((a) => a.discipline === "bike")[0], [activities]);
  const lastRun = useMemo(() => activities.filter((a) => a.discipline === "run")[0], [activities]);

  const trainingFocus = useMemo(() => {
    const now = Date.now();
    const swimDays = lastSwim ? Math.floor((now - new Date(lastSwim.date).getTime()) / 86400000) : 99;
    const bikeDays = lastBike ? Math.floor((now - new Date(lastBike.date).getTime()) / 86400000) : 99;
    const runDays = lastRun ? Math.floor((now - new Date(lastRun.date).getTime()) / 86400000) : 99;
    const max = Math.max(swimDays, bikeDays, runDays);
    if (max === swimDays) return { discipline: "Swim", icon: "water" as const, color: colors.swim, days: swimDays };
    if (max === bikeDays) return { discipline: "Bike", icon: "bicycle" as const, color: colors.bike, days: bikeDays };
    return { discipline: "Run", icon: "walk" as const, color: colors.run, days: runDays };
  }, [lastSwim, lastBike, lastRun]);

  // Today's planned workout from training plan
  const todayIdx = new Date().getDay();
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const todayName = dayNames[todayIdx];
  const prepDayNames: Record<number, string> = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
  const todayPrepDay = prepDayNames[todayIdx];
  const todayWorkout = useMemo(
    () => {
      if (prepPlan && prepPlan.weeks.length > 0) {
        const week = prepPlan.weeks[prepPlan.currentWeekIndex];
        const session = week?.sessions.find((s) => s.day === todayPrepDay);
        if (session) {
          return {
            day: todayName,
            discipline: session.discipline as string,
            title: session.notes,
            duration: session.durationMin,
            distance: session.distanceTarget ?? null,
            completed: session.completed,
          };
        }
        return undefined;
      }
      return trainingPlan.weeklyPlan.find((w) => w.day === todayName);
    },
    [prepPlan, trainingPlan, todayName, todayPrepDay]
  );

  // Training plan progress rings data
  const planProgress = useMemo(() => {
    if (prepPlan && prepPlan.weeks.length > 0) {
      const sessions = prepPlan.weeks[prepPlan.currentWeekIndex]?.sessions ?? [];
      const swimPlanned = sessions.filter((s) => s.discipline === "swim").reduce((sum, s) => sum + s.durationMin, 0);
      const swimDone = sessions.filter((s) => s.discipline === "swim" && s.completed).reduce((sum, s) => sum + s.durationMin, 0);
      const bikePlanned = sessions.filter((s) => s.discipline === "bike").reduce((sum, s) => sum + s.durationMin, 0);
      const bikeDone = sessions.filter((s) => s.discipline === "bike" && s.completed).reduce((sum, s) => sum + s.durationMin, 0);
      const runPlanned = sessions.filter((s) => s.discipline === "run").reduce((sum, s) => sum + s.durationMin, 0);
      const runDone = sessions.filter((s) => s.discipline === "run" && s.completed).reduce((sum, s) => sum + s.durationMin, 0);
      const totalPlanned = swimPlanned + bikePlanned + runPlanned;
      const totalDone = swimDone + bikeDone + runDone;
      return { swimPlanned, swimDone, bikePlanned, bikeDone, runPlanned, runDone, totalPlanned, totalDone };
    }
    const plan = trainingPlan.weeklyPlan;
    const swimPlanned = plan.filter((w) => w.discipline === "swim").reduce((sum, w) => sum + w.duration, 0);
    const swimDone = plan.filter((w) => w.discipline === "swim" && w.completed).reduce((sum, w) => sum + (w.actualDuration ?? w.duration), 0);
    const bikePlanned = plan.filter((w) => w.discipline === "bike").reduce((sum, w) => sum + w.duration, 0);
    const bikeDone = plan.filter((w) => w.discipline === "bike" && w.completed).reduce((sum, w) => sum + (w.actualDuration ?? w.duration), 0);
    const runPlanned = plan.filter((w) => w.discipline === "run").reduce((sum, w) => sum + w.duration, 0);
    const runDone = plan.filter((w) => w.discipline === "run" && w.completed).reduce((sum, w) => sum + (w.actualDuration ?? w.duration), 0);
    const totalPlanned = swimPlanned + bikePlanned + runPlanned;
    const totalDone = swimDone + bikeDone + runDone;
    return { swimPlanned, swimDone, bikePlanned, bikeDone, runPlanned, runDone, totalPlanned, totalDone };
  }, [prepPlan, trainingPlan]);

  const formatMinToHrMin = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h} hr ${m} min` : `${m} min`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LevelStreakBar />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header Area */}
        <GradientBackground style={styles.headerGradient} variant="purple">
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{displayName}</Text>
            </View>
          </View>

          {/* Today's Planned Workout */}
          {todayWorkout && todayWorkout.discipline !== "rest" && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/workout/live")}
            >
              <GlassCard style={styles.todayCard} variant="highlighted">
                <View style={styles.todayRow}>
                  <View style={[styles.todayIcon, { backgroundColor: (DISCIPLINE_COLORS[todayWorkout.discipline] ?? colors.textMuted) + "20" }]}>
                    <Ionicons
                      name={DISCIPLINE_ICONS[todayWorkout.discipline] ?? "fitness"}
                      size={22}
                      color={DISCIPLINE_COLORS[todayWorkout.discipline] ?? colors.textMuted}
                    />
                  </View>
                  <View style={styles.todayInfo}>
                    <Text style={styles.todayLabel}>TODAY'S WORKOUT</Text>
                    <Text style={styles.todayTitle}>{todayWorkout.title}</Text>
                    <Text style={styles.todaySub}>
                      {todayWorkout.duration} min
                      {todayWorkout.distance ? ` • ${todayWorkout.distance} km` : ""}
                    </Text>
                  </View>
                  <View style={styles.todayArrow}>
                    <Ionicons name="play-circle" size={36} color={colors.glowCyan} />
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}

          {nextIronmanEvent && (
            <TouchableOpacity
              onPress={() => router.push("/events" as never)}
              activeOpacity={0.85}
            >
              <GlassCard style={styles.raceCountdown} variant="highlighted">
                <View style={styles.raceRow}>
                  <Text style={{ fontSize: 28 }}>{nextIronmanEvent.flag}</Text>
                  <View style={styles.raceInfo}>
                    <Text style={styles.raceDays}>
                      {daysUntil(nextIronmanEvent.date)} days
                    </Text>
                    <Text style={styles.raceLabel} numberOfLines={1}>
                      to {nextIronmanEvent.name}
                    </Text>
                    <Text style={[styles.raceLabel, { color: colors.textMuted, fontSize: fontSize.xs }]}>
                      {nextIronmanEvent.location}, {nextIronmanEvent.country}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}

          <GlassCard style={styles.motivational}>
            <Text style={styles.motivationalText}>💬 {motivationalMsg}</Text>
          </GlassCard>

          <TriRankDisplay triRank={triRank} />
          <Text style={styles.watchHint}>Connect your watch to earn XP.</Text>
        </GradientBackground>

        {/* XP Decay Warning */}
        <XpDecayWarning />

        {/* Target Race Card */}
        <TargetRaceCard />
        {selectedRaceEvent && daysToRace !== null && (
          <GlassCard style={styles.goalSummaryCard} variant="highlighted">
            <Text style={styles.goalSummaryTitle}>Target Race</Text>
            <Text style={styles.goalSummaryValue}>
              {selectedRaceEvent.name} in {daysToRace} days
            </Text>
          </GlassCard>
        )}

        <SectionHeader title="Performance Evolution" />
        {performanceStats.workoutsCount === 0 ? (
          <GlassCard style={styles.emptyJourneyCard} variant="highlighted">
            <Text style={styles.emptyJourneyTitle}>Start your journey</Text>
            <Text style={styles.emptyJourneyText}>
              Log your first workout to unlock your progression charts and performance evolution.
            </Text>
          </GlassCard>
        ) : (
          <View style={styles.evolutionGrid}>
            <StatCard
              icon="water"
              iconColor={colors.swim}
              label="Swim Total"
              value={`${Math.round(performanceStats.totalSwimDistance)} m`}
            />
            <StatCard
              icon="bicycle"
              iconColor={colors.bike}
              label="Bike Total"
              value={`${performanceStats.totalBikeDistance.toFixed(1)} km`}
            />
            <StatCard
              icon="walk"
              iconColor={colors.run}
              label="Run Total"
              value={`${performanceStats.totalRunDistance.toFixed(1)} km`}
            />
            <StatCard
              icon="time"
              iconColor={colors.glowCyan}
              label="Training Time"
              value={`${Math.round(performanceStats.totalTrainingTime / 60)} min`}
            />
            <StatCard
              icon="barbell"
              iconColor={colors.glowPurple}
              label="Workouts"
              value={String(performanceStats.workoutsCount)}
            />
            <StatCard
              icon="trending-up"
              iconColor={colors.primary}
              label="Rank Progress"
              value={`${performanceStats.rankProgressPercentage}%`}
            />
          </View>
        )}

        {/* Training Plan Progress Rings */}
        <SectionHeader
          title={
            prepPlan && prepPlan.weeks.length > 0
              ? `PREP Plan — Week ${prepPlan.currentWeekIndex + 1} · ${prepPlan.weeks[prepPlan.currentWeekIndex]?.phase ?? ""}`
              : `${trainingPlan.name} — Week ${trainingPlan.currentWeek}`
          }
        />
        <View style={styles.ringsSection}>
          <View style={styles.ringsRow}>
            {(["swim", "bike", "run"] as const).map((disc) => {
              const planned = planProgress[`${disc}Planned` as keyof typeof planProgress] as number;
              const done = planProgress[`${disc}Done` as keyof typeof planProgress] as number;
              const progress = planned > 0 ? Math.min(done / planned, 1) : 0;
              const discColor = DISCIPLINE_COLORS[disc];
              return (
                <View key={disc} style={styles.ringItem}>
                  <View style={styles.ringOuter}>
                    <View
                      style={[
                        styles.ringProgress,
                        {
                          borderTopColor: discColor,
                          borderRightColor: progress > 0.25 ? discColor : "transparent",
                          borderBottomColor: progress > 0.5 ? discColor : "transparent",
                          borderLeftColor: progress > 0.75 ? discColor : "transparent",
                          transform: [{ rotate: `${progress * 360}deg` }],
                        },
                      ]}
                    />
                    <View style={styles.ringInner}>
                      <Ionicons name={DISCIPLINE_ICONS[disc]} size={16} color={discColor} />
                    </View>
                  </View>
                  <Text style={[styles.ringLabel, { color: discColor }]}>
                    {disc.charAt(0).toUpperCase() + disc.slice(1)}
                  </Text>
                  <Text style={styles.ringProgress2}>{formatMinToHrMin(done)}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.totalDuration}>
            Total: {formatMinToHrMin(planProgress.totalDone)} / {formatMinToHrMin(planProgress.totalPlanned)}
          </Text>
        </View>

        {/* Weekly Plan */}
        <GlassCard style={{ marginHorizontal: spacing.lg }}>
          {prepPlan && prepPlan.weeks.length > 0 ? (
            <HomePrepPlanWeek todayIdx={todayIdx} />
          ) : (
            trainingPlan.weeklyPlan.map((workout, idx) => {
              const wColor = DISCIPLINE_COLORS[workout.discipline] ?? colors.textMuted;
              const isToday = workout.day === todayName;
              return (
                <View key={workout.day}>
                  <View style={[styles.planRow, isToday && styles.planRowToday]}>
                    <Text style={[styles.planDay, isToday && { color: colors.glowCyan }]}>{workout.day}</Text>
                    <View style={[styles.planIcon, { backgroundColor: wColor + "15" }]}>
                      <Ionicons
                        name={DISCIPLINE_ICONS[workout.discipline] ?? "bed-outline"}
                        size={14}
                        color={wColor}
                      />
                    </View>
                    <View style={styles.planInfo}>
                      <Text style={styles.planTitle} numberOfLines={1}>{workout.title}</Text>
                      {workout.discipline !== "rest" && (
                        <Text style={styles.planStats}>
                          {workout.duration} min{workout.distance ? ` • ${workout.distance} km` : ""}
                        </Text>
                      )}
                    </View>
                    {workout.completed ? (
                      <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={14} color={colors.success} />
                      </View>
                    ) : workout.discipline !== "rest" ? (
                      <View style={styles.emptyCircle} />
                    ) : null}
                  </View>
                  {idx < trainingPlan.weeklyPlan.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })
          )}
        </GlassCard>

        {/* Monthly Calendar */}
        {(() => {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
          const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

          const prepSessionMap = new Map<number, { discipline: string; completed: boolean }>();
          if (prepPlan && prepPlan.weeks.length > 0) {
            for (const week of prepPlan.weeks) {
              const mondayDate = new Date(week.weekOf);
              for (const session of week.sessions) {
                if (session.discipline === "rest") continue;
                const offsetDays = PREP_DAY_TO_MONDAY_IDX[session.day] ?? 0;
                const sessionDate = new Date(mondayDate);
                sessionDate.setDate(mondayDate.getDate() + offsetDays);
                if (sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear) {
                  prepSessionMap.set(sessionDate.getDate(), {
                    discipline: session.discipline,
                    completed: session.completed,
                  });
                }
              }
            }
          }

          return (
            <>
              <SectionHeader title={`${monthNames[currentMonth]} ${currentYear}`} />
              <GlassCard style={{ marginHorizontal: spacing.lg }}>
                <View style={styles.calendarGrid}>
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <Text key={`hdr-${i}`} style={styles.calendarDayHeader}>{d}</Text>
                  ))}
                  {(() => {
                    const cells: React.ReactNode[] = [];
                    for (let i = 0; i < startOffset; i++) {
                      cells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
                    }
                    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
                      const dayOfWeek = new Date(currentYear, currentMonth, dayNum).getDay();
                      const mondayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                      const isToday = dayNum === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

                      let discColor: string | undefined;
                      let dotOpacity = 1;
                      if (prepPlan && prepPlan.weeks.length > 0) {
                        const entry = prepSessionMap.get(dayNum);
                        if (entry) {
                          discColor = DISCIPLINE_COLORS[entry.discipline] ?? colors.textMuted;
                          dotOpacity = entry.completed ? 1 : 0.35;
                        }
                      } else {
                        const planItem = trainingPlan.weeklyPlan.find((w) => {
                          const dayMap: Record<string, number> = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
                          return dayMap[w.day] === mondayIdx && w.discipline !== "rest";
                        });
                        discColor = planItem ? (DISCIPLINE_COLORS[planItem.discipline] ?? colors.textMuted) : undefined;
                      }

                      cells.push(
                        <View
                          key={dayNum}
                          style={[styles.calendarCell, isToday && styles.calendarCellToday]}
                        >
                          <Text style={[styles.calendarDayNum, isToday && { color: colors.glowCyan }]}>
                            {dayNum}
                          </Text>
                          {discColor && (
                            <View style={[styles.calendarDot, { backgroundColor: discColor, opacity: dotOpacity }]} />
                          )}
                        </View>
                      );
                    }
                    return cells;
                  })()}
                </View>
              </GlassCard>
            </>
          );
        })()}

        {/* Weekly Progress Section */}
        <View style={styles.weeklyRow}>
          <GlassCard style={styles.consistencyCard}>
            <Text style={styles.consistencyTitle}>Weekly Goal</Text>
            <View style={styles.consistencyRingContainer}>
              <View style={styles.consistencyRingOuter}>
                <View
                  style={[
                    styles.consistencyRingProgress,
                    {
                      transform: [{ rotate: `${weeklyProgress * 360}deg` }],
                      borderTopColor: colors.glowPurple,
                      borderRightColor: weeklyProgress > 0.25 ? colors.glowPurple : "transparent",
                      borderBottomColor: weeklyProgress > 0.5 ? colors.glowCyan : "transparent",
                      borderLeftColor: weeklyProgress > 0.75 ? colors.glowCyan : "transparent",
                    },
                  ]}
                />
                <View style={styles.consistencyRingInner}>
                  <Text style={styles.consistencyRingText}>{weeklyStats.totalActivities}/{weeklyGoal}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.consistencyLabel}>sessions</Text>
          </GlassCard>
          <View style={styles.weeklyStatsCol}>
            <StatCard
              icon="flame"
              iconColor="#F97316"
              label="Activities"
              value={String(weeklyStats.totalActivities)}
              subtitle="This week"
            />
            <StatCard
              icon="trending-up"
              iconColor={colors.glowCyan}
              label="Points"
              value={String(weeklyStats.totalPoints)}
              subtitle="This week"
            />
          </View>
        </View>

        {nextMilestone && (
          <GlassCard style={styles.milestonePreview} variant="highlighted">
            <View style={styles.milestoneRow}>
              <Text style={styles.milestoneEmoji}>{nextMilestone.icon}</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>Next: {nextMilestone.title}</Text>
                <Text style={styles.milestoneSub}>{nextMilestone.description}</Text>
              </View>
            </View>
          </GlassCard>
        )}

        <GlassCard style={styles.focusCard} accentColor={trainingFocus.color}>
          <View style={styles.focusRow}>
            <View style={[styles.focusIcon, { backgroundColor: trainingFocus.color + "20", borderColor: trainingFocus.color + "40" }]}>
              <Text style={styles.focusEmoji}>
                {trainingFocus.discipline === "Swim" ? "🏊" : trainingFocus.discipline === "Bike" ? "🚴" : "🏃"}
              </Text>
            </View>
            <View style={styles.focusInfo}>
              <Text style={styles.focusTitle}>Today's Focus: {trainingFocus.discipline}</Text>
              <Text style={styles.focusSub}>
                {trainingFocus.days === 0 ? "Last done today" : `Last done ${trainingFocus.days} day${trainingFocus.days > 1 ? "s" : ""} ago`}
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.weeklyDistRow}>
          <StatCard
            icon="water"
            iconColor={colors.swim}
            label="Swim"
            value={formatDistance("swim", weeklyStats.swimDistance)}
          />
          <StatCard
            icon="bicycle"
            iconColor={colors.bike}
            label="Bike"
            value={formatDistance("bike", weeklyStats.bikeDistance)}
          />
          <StatCard
            icon="walk"
            iconColor={colors.run}
            label="Run"
            value={formatDistance("run", weeklyStats.runDistance)}
          />
        </View>

        {!isPremium && <PremiumBanner />}

        <SectionHeader title="Discipline Ranks" />
        {!isPremium ? (
          <GlassCard style={styles.premiumPrompt}>
            <Text style={styles.premiumPromptIcon}>🔒</Text>
            <Text style={styles.premiumPromptText}>Upgrade to see discipline ranks</Text>
          </GlassCard>
        ) : (
          <View style={styles.disciplineCards}>
            <DisciplineCard
              rank={triRank.swimRank}
              onPress={() => router.push("/(tabs)/swim")}
            />
            <DisciplineCard
              rank={triRank.bikeRank}
              onPress={() => router.push("/(tabs)/bike")}
            />
            <DisciplineCard
              rank={triRank.runRank}
              onPress={() => router.push("/(tabs)/run")}
            />
          </View>
        )}

        <SectionHeader title="Off-plan (watch)" />
        <RecentActivities
          activities={filterOffPlanWatchActivities(activities)}
          hideTitle
        />
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
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    marginTop: 2,
  },
  todayCard: {
    paddingVertical: 14,
  },
  todayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  todayIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  todayInfo: {
    flex: 1,
    gap: 2,
  },
  todayLabel: {
    color: colors.glowCyan,
    fontSize: 9,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  todayTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  todaySub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  todayArrow: {
    opacity: 0.8,
  },
  raceCountdown: {
    paddingVertical: 14,
  },
  raceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  raceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(244, 63, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.3)",
  },
  raceEmoji: {
    fontSize: 22,
  },
  raceInfo: {
    flex: 1,
  },
  raceDays: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  raceLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  racePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F43F5E",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  motivational: {
    paddingVertical: 12,
  },
  goalSummaryCard: {
    marginHorizontal: spacing.lg,
    gap: 4,
  },
  goalSummaryTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  goalSummaryValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  emptyJourneyCard: {
    marginHorizontal: spacing.lg,
    gap: 6,
  },
  emptyJourneyTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  emptyJourneyText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  evolutionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  motivationalText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },
  watchHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: -4,
    paddingHorizontal: spacing.md,
  },
  ringsSection: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  ringsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  ringItem: {
    alignItems: "center",
    gap: 6,
  },
  ringOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ringProgress: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderRadius: 28,
  },
  ringInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  ringProgress2: {
    color: colors.textMuted,
    fontSize: 10,
  },
  totalDuration: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    width: 30,
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
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDayHeader: {
    width: `${100 / 7}%` as any,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    paddingBottom: 8,
  },
  calendarCell: {
    width: `${100 / 7}%` as any,
    alignItems: "center",
    paddingVertical: 6,
    gap: 2,
  },
  calendarCellToday: {
    backgroundColor: "rgba(6, 182, 212, 0.08)",
    borderRadius: borderRadius.sm,
  },
  calendarDayNum: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: fontWeight.medium,
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  weeklyRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  consistencyCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  consistencyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  consistencyRingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  consistencyRingOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  consistencyRingProgress: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderRadius: 32,
  },
  consistencyRingInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  consistencyRingText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  consistencyLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  weeklyStatsCol: {
    flex: 1,
    gap: 10,
  },
  weeklyDistRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  milestonePreview: {
    paddingVertical: 12,
    marginHorizontal: spacing.lg,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  milestoneEmoji: {
    fontSize: 24,
  },
  milestoneInfo: {
    flex: 1,
    gap: 2,
  },
  milestoneTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  milestoneSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  focusCard: {
    paddingVertical: 12,
    marginHorizontal: spacing.lg,
  },
  focusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  focusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  focusEmoji: {
    fontSize: 22,
  },
  focusInfo: {
    flex: 1,
    gap: 2,
  },
  focusTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  focusSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  disciplineCards: {
    gap: 12,
    paddingHorizontal: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
  },
  premiumPrompt: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    marginHorizontal: spacing.lg,
  },
  premiumPromptIcon: {
    fontSize: 24,
  },
  premiumPromptText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
