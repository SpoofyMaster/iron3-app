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
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, SectionHeader, ActivityRow } from "@/components";
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

  useEffect(() => {
    if (showConfirmation) {
      Animated.parallel([
        Animated.spring(confirmAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.timing(confirmAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          dismissConfirmation();
          scaleAnim.setValue(0.5);
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
    logWorkout({
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
                  <View style={[styles.historyIcon, { backgroundColor: dC.main + "20" }]}>
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
        <View style={styles.header}>
          <Text style={styles.title}>Log Workout</Text>
          <TouchableOpacity onPress={() => setShowHistory(true)} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

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
                  active && { backgroundColor: dc.main + "20", borderColor: dc.main + "50" },
                ]}
                onPress={() => handleDisciplineChange(d.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={d.icon}
                  size={20}
                  color={active ? dc.main : colors.textMuted}
                />
                <Text style={[styles.disciplineLabel, active && { color: dc.main }]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <SectionHeader title="Duration" />
        <View style={styles.presetRow}>
          {DURATION_PRESETS.map((mins) => (
            <TouchableOpacity
              key={mins}
              style={[
                styles.presetChip,
                duration === mins && !customDuration && {
                  backgroundColor: dColors.main + "20",
                  borderColor: dColors.main + "50",
                },
              ]}
              onPress={() => { setDuration(mins); setCustomDuration(""); }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetText,
                  duration === mins && !customDuration && { color: dColors.main },
                ]}
              >
                {mins}m
              </Text>
            </TouchableOpacity>
          ))}
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
              {distConfig.presets.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetChip,
                    distance === val && !customDistance && {
                      backgroundColor: dColors.main + "20",
                      borderColor: dColors.main + "50",
                    },
                  ]}
                  onPress={() => { setDistance(val); setCustomDistance(""); }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetText,
                      distance === val && !customDistance && { color: dColors.main },
                    ]}
                  >
                    {val}{distConfig.unit === "m" && val >= 1000 ? "" : ""}{distConfig.unit}
                  </Text>
                </TouchableOpacity>
              ))}
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
          <View style={styles.effortRow}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((e) => (
              <TouchableOpacity
                key={e}
                style={[
                  styles.effortDot,
                  {
                    backgroundColor: e <= effort ? EFFORT_COLORS[e - 1] + "30" : colors.surfaceGlass,
                    borderColor: e <= effort ? EFFORT_COLORS[e - 1] : colors.surfaceGlassBorder,
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
                  active && { backgroundColor: dColors.main + "20", borderColor: dColors.main + "50" },
                ]}
                onPress={() => setWorkoutType(wt.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.typeText, active && { color: dColors.main }]}>
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
                      active && { backgroundColor: dColors.main + "20", borderColor: dColors.main + "50" },
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

        <TouchableOpacity
          style={[styles.logButton, { backgroundColor: dColors.main }]}
          onPress={handleLog}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.logButtonText}>LOG WORKOUT</Text>
        </TouchableOpacity>
      </ScrollView>

      {showConfirmation && (
        <Animated.View
          style={[
            styles.confirmOverlay,
            { opacity: confirmAnim },
          ]}
        >
          <Animated.View style={[styles.confirmCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.confirmEmoji}>🎉</Text>
            <Text style={styles.confirmTitle}>Workout Logged!</Text>
            <View style={styles.confirmPointsRow}>
              <Text style={styles.confirmPoints}>+{lastPoints}</Text>
              <Text style={styles.confirmPtsLabel}>points earned</Text>
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
    padding: spacing.lg,
    paddingBottom: 40,
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
  },
  disciplineRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  disciplineBtn: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    minWidth: 72,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
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
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    fontSize: fontSize.sm,
    minWidth: 70,
  },
  effortContainer: {
    gap: 8,
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
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
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
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
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
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    fontSize: fontSize.sm,
    padding: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  logButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: borderRadius.lg,
    marginTop: 8,
  },
  logButtonText: {
    color: "#fff",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
  },
  confirmCard: {
    alignItems: "center",
    gap: 12,
    padding: 32,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    width: SCREEN_WIDTH * 0.75,
  },
  confirmEmoji: {
    fontSize: 48,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
  },
  confirmPointsRow: {
    alignItems: "center",
    gap: 2,
  },
  confirmPoints: {
    color: colors.success,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
  },
  confirmPtsLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
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
