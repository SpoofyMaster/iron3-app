import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, SectionHeader, ActivityRow, GradientBackground, LevelStreakBar } from "@/components";
import {
  WorkoutDiscipline,
  WorkoutType,
  SwimWorkoutType,
  BikeWorkoutType,
  RunWorkoutType,
  BrickWorkoutType,
  StrengthWorkoutType,
  IndoorOutdoor,
} from "@/types";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { workoutDisciplineColors } from "@/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DISCIPLINES: { key: WorkoutDiscipline; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "swim", label: "Swim", icon: "water" },
  { key: "bike", label: "Bike", icon: "bicycle" },
  { key: "run", label: "Run", icon: "walk" },
  { key: "brick", label: "Brick", icon: "layers" },
  { key: "strength", label: "Strength", icon: "barbell" },
];

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

const WORKOUT_TYPES: Record<WorkoutDiscipline, { key: WorkoutType; label: string }[]> = {
  swim: [
    { key: "drills" as SwimWorkoutType, label: "Drills" },
    { key: "endurance" as SwimWorkoutType, label: "Endurance" },
    { key: "intervals" as SwimWorkoutType, label: "Intervals" },
    { key: "open_water" as SwimWorkoutType, label: "Open Water" },
    { key: "technique" as SwimWorkoutType, label: "Technique" },
  ],
  bike: [
    { key: "endurance" as BikeWorkoutType, label: "Endurance" },
    { key: "intervals" as BikeWorkoutType, label: "Intervals" },
    { key: "hill_climb" as BikeWorkoutType, label: "Hill Climb" },
    { key: "time_trial" as BikeWorkoutType, label: "Time Trial" },
    { key: "recovery" as BikeWorkoutType, label: "Recovery" },
  ],
  run: [
    { key: "easy" as RunWorkoutType, label: "Easy" },
    { key: "tempo" as RunWorkoutType, label: "Tempo" },
    { key: "intervals" as RunWorkoutType, label: "Intervals" },
    { key: "long_run" as RunWorkoutType, label: "Long Run" },
    { key: "brick_run" as RunWorkoutType, label: "Brick Run" },
    { key: "recovery" as RunWorkoutType, label: "Recovery" },
  ],
  brick: [
    { key: "bike_to_run" as BrickWorkoutType, label: "Bike → Run" },
    { key: "swim_to_bike" as BrickWorkoutType, label: "Swim → Bike" },
  ],
  strength: [
    { key: "core" as StrengthWorkoutType, label: "Core" },
    { key: "upper_body" as StrengthWorkoutType, label: "Upper Body" },
    { key: "lower_body" as StrengthWorkoutType, label: "Lower Body" },
    { key: "mobility" as StrengthWorkoutType, label: "Mobility" },
    { key: "yoga" as StrengthWorkoutType, label: "Yoga" },
  ],
};

const DISTANCE_DEFAULTS: Partial<Record<WorkoutDiscipline, { label: string; unit: string; presets: number[] }>> = {
  swim: { label: "Distance (m)", unit: "m", presets: [500, 1000, 1500, 2000, 3000] },
  bike: { label: "Distance (km)", unit: "km", presets: [20, 30, 40, 60, 80, 100] },
  run: { label: "Distance (km)", unit: "km", presets: [3, 5, 8, 10, 15, 21] },
};

const EFFORT_COLORS = [
  "#22C55E", "#22C55E", "#84CC16", "#84CC16", "#EAB308",
  "#EAB308", "#F97316", "#F97316", "#EF4444", "#EF4444",
];

const EFFORT_LABELS = [
  "Rest", "Very Easy", "Easy", "Light", "Moderate",
  "Steady", "Hard", "Very Hard", "Max", "All Out",
];

export default function LogScreen() {
  const router = useRouter();
  const [discipline, setDiscipline] = useState<WorkoutDiscipline>("swim");
  const [duration, setDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [customDistance, setCustomDistance] = useState("");
  const [effort, setEffort] = useState(5);
  const [workoutType, setWorkoutType] = useState<WorkoutType>("endurance");
  const [indoorOutdoor, setIndoorOutdoor] = useState<IndoorOutdoor>("indoor");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const logWorkout = useAppStore((s) => s.logWorkout);
  const showConfirmation = useAppStore((s) => s.showWorkoutConfirmation);
  const lastPoints = useAppStore((s) => s.lastLoggedPoints);
  const dismissConfirmation = useAppStore((s) => s.dismissWorkoutConfirmation);
  const workoutLogs = useAppStore((s) => s.workoutLogs);

  const confirmAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showConfirmation) {
      Animated.parallel([
        Animated.spring(confirmAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.timing(ringAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.timing(confirmAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          dismissConfirmation();
          scaleAnim.setValue(0.5);
          ringAnim.setValue(0);
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  const dColors = useMemo(() => workoutDisciplineColors[discipline], [discipline]);
  const hasIndoorOutdoor = discipline === "swim" || discipline === "bike";
  const distConfig = useMemo(() => DISTANCE_DEFAULTS[discipline] ?? null, [discipline]);

  const handleDisciplineChange = useCallback((d: WorkoutDiscipline) => {
    setDiscipline(d);
    const types = WORKOUT_TYPES[d];
    if (types.length > 0) setWorkoutType(types[0].key);
    setDistance(null);
    setCustomDistance("");
  }, []);

  const effectiveDuration = useMemo(() => {
    const custom = parseInt(customDuration, 10);
    return custom > 0 ? custom : duration;
  }, [duration, customDuration]);

  const effectiveDistance = useMemo(() => {
    const custom = parseFloat(customDistance);
    return custom > 0 ? custom : distance;
  }, [distance, customDistance]);

  const handleLog = useCallback(() => {
    void logWorkout({
      discipline,
      workoutType,
      duration: effectiveDuration * 60,
      distance: effectiveDistance,
      effort,
      indoorOutdoor: hasIndoorOutdoor ? indoorOutdoor : null,
      notes,
      date: new Date().toISOString(),
    });
    setNotes("");
    setShowNotes(false);
    setCustomDuration("");
    setCustomDistance("");
  }, [discipline, workoutType, effectiveDuration, effectiveDistance, effort, indoorOutdoor, notes, hasIndoorOutdoor, logWorkout]);

  if (showHistory) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.historyHeader}>
          <TouchableOpacity onPress={() => setShowHistory(false)} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.historyTitle}>Workout History</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.historyContent}
          showsVerticalScrollIndicator={false}
        >
          {workoutLogs.map((log) => {
            const dC = workoutDisciplineColors[log.discipline];
            const dateStr = new Date(log.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });
            return (
              <GlassCard key={log.id} style={styles.historyCard} accentColor={dC.main}>
                <View style={styles.historyRow}>
                  <View style={[styles.historyIcon, { backgroundColor: dC.main + "20", borderColor: dC.main + "40" }]}>
                    <Ionicons
                      name={DISCIPLINES.find((d) => d.key === log.discipline)?.icon ?? "fitness"}
                      size={20}
                      color={dC.main}
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyType}>
                      {log.discipline.charAt(0).toUpperCase() + log.discipline.slice(1)} — {log.workoutType.replace(/_/g, " ")}
                    </Text>
                    <Text style={styles.historySub}>
                      {Math.round(log.duration / 60)} min
                      {log.distance ? ` • ${log.distance}${log.discipline === "swim" ? "m" : "km"}` : ""}
                      {" • Effort "}
                      {log.effort}/10
                    </Text>
                    <Text style={styles.historyDate}>{dateStr}</Text>
                  </View>
                  <Text style={[styles.historyPts, { color: dC.main }]}>+{log.pointsEarned}</Text>
                </View>
                {log.notes ? <Text style={styles.historyNotes}>{log.notes}</Text> : null}
              </GlassCard>
            );
          })}
          {workoutLogs.length === 0 && (
            <Text style={styles.emptyText}>No workouts logged yet</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GradientBackground style={styles.topGradient} variant="blue">
          <View style={styles.header}>
            <Text style={styles.title}>Log Workout</Text>
            <TouchableOpacity onPress={() => setShowHistory(true)} activeOpacity={0.7}>
              <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Discipline Selector with neon glow */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.disciplineRow}
          >
            {DISCIPLINES.map((d) => {
              const active = discipline === d.key;
              const dc = workoutDisciplineColors[d.key];
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.disciplineBtn,
                    active && {
                      backgroundColor: dc.main + "18",
                      borderColor: dc.main,
                      shadowColor: dc.main,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                    },
                  ]}
                  onPress={() => handleDisciplineChange(d.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={d.icon}
                    size={22}
                    color={active ? dc.main : colors.textMuted}
                  />
                  <Text style={[styles.disciplineLabel, active && { color: dc.main, fontWeight: fontWeight.bold }]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </GradientBackground>

        <View style={styles.formBody}>
          <SectionHeader title="Duration" />
          <View style={styles.presetRow}>
            {DURATION_PRESETS.map((mins) => {
              const active = duration === mins && !customDuration;
              return (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.presetChip,
                    active && {
                      backgroundColor: dColors.main + "20",
                      borderColor: dColors.main,
                    },
                  ]}
                  onPress={() => { setDuration(mins); setCustomDuration(""); }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetText,
                      active && { color: dColors.main, fontWeight: fontWeight.bold },
                    ]}
                  >
                    {mins}m
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TextInput
              style={styles.customInput}
              placeholder="Custom"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              value={customDuration}
              onChangeText={setCustomDuration}
              maxLength={3}
            />
          </View>

          {distConfig && (
            <>
              <SectionHeader title={distConfig.label} />
              <View style={styles.presetRow}>
                {distConfig.presets.map((val) => {
                  const active = distance === val && !customDistance;
                  return (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.presetChip,
                        active && {
                          backgroundColor: dColors.main + "20",
                          borderColor: dColors.main,
                        },
                      ]}
                      onPress={() => { setDistance(val); setCustomDistance(""); }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          active && { color: dColors.main, fontWeight: fontWeight.bold },
                        ]}
                      >
                        {val}{distConfig.unit}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TextInput
                  style={styles.customInput}
                  placeholder="Custom"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={customDistance}
                  onChangeText={setCustomDistance}
                  maxLength={5}
                />
              </View>
            </>
          )}

          <SectionHeader title={`Effort: ${effort}/10`} />
          <View style={styles.effortContainer}>
            <View style={styles.effortTrack}>
              <LinearGradient
                colors={["#22C55E", "#84CC16", "#EAB308", "#F97316", "#EF4444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.effortFill, { width: `${effort * 10}%` }]}
              />
            </View>
            <View style={styles.effortRow}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[
                    styles.effortDot,
                    {
                      backgroundColor: e <= effort ? EFFORT_COLORS[e - 1] + "25" : colors.surfaceGlass,
                      borderColor: e <= effort ? EFFORT_COLORS[e - 1] + "60" : colors.surfaceGlassBorder,
                    },
                  ]}
                  onPress={() => setEffort(e)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.effortNum,
                      e <= effort && { color: EFFORT_COLORS[e - 1] },
                    ]}
                  >
                    {e}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.effortLabel, { color: EFFORT_COLORS[effort - 1] }]}>
              {EFFORT_LABELS[effort - 1]}
            </Text>
          </View>

          <SectionHeader title="Workout Type" />
          <View style={styles.typeGrid}>
            {WORKOUT_TYPES[discipline].map((wt) => {
              const active = workoutType === wt.key;
              return (
                <TouchableOpacity
                  key={wt.key}
                  style={[
                    styles.typeChip,
                    active && { backgroundColor: dColors.main + "20", borderColor: dColors.main },
                  ]}
                  onPress={() => setWorkoutType(wt.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.typeText, active && { color: dColors.main, fontWeight: fontWeight.bold }]}>
                    {wt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {hasIndoorOutdoor && (
            <>
              <SectionHeader title="Location" />
              <View style={styles.toggleRow}>
                {(["indoor", "outdoor"] as IndoorOutdoor[]).map((opt) => {
                  const active = indoorOutdoor === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.toggleBtn,
                        active && { backgroundColor: dColors.main + "18", borderColor: dColors.main },
                      ]}
                      onPress={() => setIndoorOutdoor(opt)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={opt === "indoor" ? "home-outline" : "sunny-outline"}
                        size={18}
                        color={active ? dColors.main : colors.textMuted}
                      />
                      <Text style={[styles.toggleText, active && { color: dColors.main }]}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {!showNotes ? (
            <TouchableOpacity style={styles.notesToggle} onPress={() => setShowNotes(true)} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.notesToggleText}>Add Notes</Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.notesInput}
              placeholder="How did it feel? Any observations..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={500}
            />
          )}

          {/* Start Live Workout button */}
          <TouchableOpacity
            onPress={() => router.push("/workout/live")}
            activeOpacity={0.8}
            style={styles.startWorkoutWrapper}
          >
            <LinearGradient
              colors={[colors.glowCyan, colors.glowBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startWorkoutButton}
            >
              <Ionicons name="navigate" size={22} color="#fff" />
              <Text style={styles.startWorkoutText}>START WORKOUT</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Dramatic LOG WORKOUT button with gradient */}
          <TouchableOpacity
            onPress={handleLog}
            activeOpacity={0.8}
            style={styles.logButtonWrapper}
          >
            <LinearGradient
              colors={[colors.glowPurple, colors.glowBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logButton}
            >
              <Ionicons name="checkmark-circle" size={26} color="#fff" />
              <Text style={styles.logButtonText}>LOG WORKOUT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Confirmation Overlay */}
      {showConfirmation && (
        <Animated.View
          style={[
            styles.confirmOverlay,
            { opacity: confirmAnim },
          ]}
        >
          <Animated.View style={[styles.confirmCard, { transform: [{ scale: scaleAnim }] }]}>
            <Animated.View
              style={[
                styles.confirmRing,
                {
                  transform: [{ scale: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.5] }) }],
                  opacity: ringAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 0.4, 0] }),
                },
              ]}
            />
            <View style={styles.confirmCheck}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={styles.confirmTitle}>Workout Logged!</Text>
            <View style={styles.confirmPointsRow}>
              <Text style={styles.confirmPoints}>+{lastPoints}</Text>
              <Text style={styles.confirmPtsLabel}>XP earned</Text>
            </View>
            <Text style={styles.confirmSub}>Keep up the momentum!</Text>
          </Animated.View>
        </Animated.View>
      )}
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
    paddingBottom: 40,
  },
  topGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 16,
  },
  formBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  disciplineRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  disciplineBtn: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    minWidth: 76,
  },
  disciplineLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  presetText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  customInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    fontSize: fontSize.sm,
    minWidth: 70,
  },
  effortContainer: {
    gap: 10,
  },
  effortTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  effortFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  effortRow: {
    flexDirection: "row",
    gap: 4,
  },
  effortDot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 36,
  },
  effortNum: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  effortLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  typeText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  notesToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  notesToggleText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  notesInput: {
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    fontSize: fontSize.sm,
    padding: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  startWorkoutWrapper: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  startWorkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
  },
  startWorkoutText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 2,
  },
  logButtonWrapper: {
    marginTop: 8,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: colors.glowPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
    borderRadius: borderRadius.lg,
  },
  logButtonText: {
    color: "#fff",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 2,
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 8, 16, 0.85)",
    zIndex: 100,
  },
  confirmCard: {
    alignItems: "center",
    gap: 14,
    padding: 36,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    width: SCREEN_WIDTH * 0.78,
    shadowColor: colors.glowPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  confirmRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.success,
    top: "25%",
  },
  confirmCheck: {
    marginBottom: 4,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  confirmPointsRow: {
    alignItems: "center",
    gap: 2,
  },
  confirmPoints: {
    color: colors.success,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    textShadowColor: colors.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  confirmPtsLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  confirmSub: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: 4,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 8,
  },
  historyTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  historyContent: {
    padding: spacing.lg,
    paddingBottom: 32,
    gap: 10,
  },
  historyCard: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyType: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  historySub: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  historyDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  historyPts: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  historyNotes: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    paddingLeft: 52,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: "center",
    paddingVertical: 40,
  },
});
