import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components";
import {
  Discipline,
  ExperienceLevel,
  TriathlonLevel,
  RaceDistanceGoal,
  DisciplineLevel,
  WeeklyAvailability,
  PrimaryGoal,
  AppMode,
} from "@/types";
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  disciplineColors,
} from "@/theme";

const { width } = Dimensions.get("window");
const TOTAL_STEPS = 11;

const EXPERIENCE_LEVELS: {
  key: ExperienceLevel;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "beginner", label: "Beginner", desc: "New to triathlon or returning after a long break", icon: "leaf-outline" },
  { key: "intermediate", label: "Intermediate", desc: "Completed a few races, training regularly", icon: "fitness-outline" },
  { key: "advanced", label: "Advanced", desc: "Multiple race finishes, structured training", icon: "flash-outline" },
  { key: "pro", label: "Pro / Elite", desc: "Competitive racer, high-level performance", icon: "trophy-outline" },
];

const TRIATHLON_LEVELS: { key: TriathlonLevel; label: string; desc: string }[] = [
  { key: "first_timer", label: "First-Timer", desc: "This is my first triathlon journey" },
  { key: "experienced", label: "Experienced", desc: "I've done triathlons before" },
];

const RACE_DISTANCES: { key: RaceDistanceGoal; label: string; desc: string }[] = [
  { key: "sprint", label: "Sprint", desc: "750m / 20km / 5km" },
  { key: "olympic", label: "Olympic", desc: "1.5km / 40km / 10km" },
  { key: "half_ironman", label: "Ironman 70.3", desc: "1.9km / 90km / 21.1km" },
  { key: "full_ironman", label: "Full Ironman", desc: "3.8km / 180km / 42.2km" },
  { key: "none", label: "No Race Yet", desc: "Just training for now" },
];

const DISCIPLINE_LEVELS: { key: DisciplineLevel; label: string }[] = [
  { key: "beginner", label: "Beginner" },
  { key: "comfortable", label: "Comfortable" },
  { key: "strong", label: "Strong" },
];

const WEEKLY_AVAIL: { key: WeeklyAvailability; label: string; desc: string }[] = [
  { key: "2-3", label: "2-3 days", desc: "Casual training" },
  { key: "4-5", label: "4-5 days", desc: "Regular training" },
  { key: "6-7", label: "6-7 days", desc: "Dedicated training" },
];

const PRIMARY_GOALS: { key: PrimaryGoal; label: string; icon: string }[] = [
  { key: "finish_first_race", label: "Finish my first race", icon: "🏁" },
  { key: "get_fitter", label: "Get fitter", icon: "💪" },
  { key: "improve_time", label: "Improve my time", icon: "⏱️" },
  { key: "become_consistent", label: "Become more consistent", icon: "📅" },
  { key: "train_seriously", label: "Train seriously", icon: "🔥" },
];

const APP_MODES: { key: AppMode; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "beginner_guided", label: "Guided Mode", desc: "Step-by-step guidance and tips", icon: "compass-outline" },
  { key: "performance_focused", label: "Performance Mode", desc: "Data-driven, advanced analytics", icon: "speedometer-outline" },
];

const DISCIPLINES: { key: Discipline; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "swim", label: "Swimming", icon: "water" },
  { key: "bike", label: "Cycling", icon: "bicycle" },
  { key: "run", label: "Running", icon: "walk" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [triathlonLevel, setTriathlonLevel] = useState<TriathlonLevel | null>(null);
  const [raceDistance, setRaceDistance] = useState<RaceDistanceGoal | null>(null);
  const [raceDate, setRaceDate] = useState("");
  const [swimLevel, setSwimLevel] = useState<DisciplineLevel | null>(null);
  const [bikeLevel, setBikeLevel] = useState<DisciplineLevel | null>(null);
  const [runLevel, setRunLevel] = useState<DisciplineLevel | null>(null);
  const [weeklyAvail, setWeeklyAvail] = useState<WeeklyAvailability | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | null>(null);
  const [preferredMode, setPreferredMode] = useState<AppMode | null>(null);

  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setExperienceLevel = useAppStore((s) => s.setExperienceLevel);
  const setOnboardingName = useAppStore((s) => s.setOnboardingName);
  const setOnboardingAge = useAppStore((s) => s.setOnboardingAge);
  const setTriathlonLevelStore = useAppStore((s) => s.setTriathlonLevel);
  const setRaceDistanceGoal = useAppStore((s) => s.setRaceDistanceGoal);
  const setTargetRaceDate = useAppStore((s) => s.setTargetRaceDate);
  const setSwimLevelStore = useAppStore((s) => s.setSwimLevel);
  const setBikeLevelStore = useAppStore((s) => s.setBikeLevel);
  const setRunLevelStore = useAppStore((s) => s.setRunLevel);
  const setWeeklyAvailability = useAppStore((s) => s.setWeeklyAvailability);
  const setPrimaryGoalStore = useAppStore((s) => s.setPrimaryGoal);
  const setPreferredModeStore = useAppStore((s) => s.setPreferredMode);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      if (name) setOnboardingName(name);
      if (age) setOnboardingAge(parseInt(age, 10));
      if (experience) setExperienceLevel(experience);
      if (triathlonLevel) setTriathlonLevelStore(triathlonLevel);
      if (raceDistance) setRaceDistanceGoal(raceDistance);
      if (raceDate) setTargetRaceDate(raceDate);
      if (swimLevel) setSwimLevelStore(swimLevel);
      if (bikeLevel) setBikeLevelStore(bikeLevel);
      if (runLevel) setRunLevelStore(runLevel);
      if (weeklyAvail) setWeeklyAvailability(weeklyAvail);
      if (primaryGoal) setPrimaryGoalStore(primaryGoal);
      if (preferredMode) setPreferredModeStore(preferredMode);
      completeOnboarding();
      router.replace("/(tabs)");
    }
  };

  const canProgress = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return experience !== null;
      case 3: return triathlonLevel !== null;
      case 4: return raceDistance !== null;
      case 6: return swimLevel !== null && bikeLevel !== null && runLevel !== null;
      case 7: return weeklyAvail !== null;
      case 8: return primaryGoal !== null;
      case 9: return preferredMode !== null;
      default: return true;
    }
  };

  const progressDots = useMemo(() => Array.from({ length: TOTAL_STEPS }, (_, i) => i), []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressBar}
          scrollEnabled={false}
        >
          {progressDots.map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </ScrollView>

        <ScrollView
          style={styles.stepScroll}
          contentContainerStyle={styles.stepScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && (
            <View style={styles.stepContent}>
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 8 }}
                resizeMode="contain"
              />
              <Text style={styles.stepTitle}>Welcome to Iron3</Text>
              <Text style={[styles.stepDesc, { letterSpacing: 2, color: colors.primary, fontWeight: "600", marginBottom: 16 }]}>
                KNOW YOUR RANK
              </Text>
              <Text style={styles.stepDesc}>
                The gamified triathlon experience. Track your swim, bike, and run
                activities, earn points, climb the ranks, and compete with athletes worldwide.
              </Text>
              <View style={styles.featureList}>
                {[
                  { icon: "flash" as const, text: "Earn XP across three disciplines", color: colors.run },
                  { icon: "trophy" as const, text: "Climb from Iron to Legendary rank", color: colors.accentGold },
                  { icon: "globe" as const, text: "Compete on global leaderboards", color: colors.swim },
                  { icon: "trending-up" as const, text: "Track personal bests & progress", color: colors.bike },
                ].map((feat, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name={feat.icon} size={20} color={feat.color} />
                    <Text style={styles.featureText}>{feat.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>What's your name?</Text>
              <Text style={styles.stepDesc}>Let's personalize your experience</Text>
              <TextInput
                style={styles.textInputLarge}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={30}
              />
              <TextInput
                style={styles.textInputLarge}
                placeholder="Age (optional)"
                placeholderTextColor={colors.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Training Level</Text>
              <Text style={styles.stepDesc}>This helps us personalize your training insights</Text>
              <View style={styles.optionList}>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <TouchableOpacity key={lvl.key} activeOpacity={0.7} onPress={() => setExperience(lvl.key)}>
                    <GlassCard style={[styles.optionCard, experience === lvl.key && styles.optionCardActive]}>
                      <Ionicons
                        name={lvl.icon}
                        size={24}
                        color={experience === lvl.key ? colors.primary : colors.textSecondary}
                      />
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, experience === lvl.key && { color: colors.primaryLight }]}>
                          {lvl.label}
                        </Text>
                        <Text style={styles.optionDesc}>{lvl.desc}</Text>
                      </View>
                      {experience === lvl.key && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Triathlon Experience</Text>
              <Text style={styles.stepDesc}>Have you done a triathlon before?</Text>
              <View style={styles.optionList}>
                {TRIATHLON_LEVELS.map((lvl) => (
                  <TouchableOpacity key={lvl.key} activeOpacity={0.7} onPress={() => setTriathlonLevel(lvl.key)}>
                    <GlassCard style={[styles.optionCard, triathlonLevel === lvl.key && styles.optionCardActive]}>
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, triathlonLevel === lvl.key && { color: colors.primaryLight }]}>
                          {lvl.label}
                        </Text>
                        <Text style={styles.optionDesc}>{lvl.desc}</Text>
                      </View>
                      {triathlonLevel === lvl.key && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Race Distance Goal</Text>
              <Text style={styles.stepDesc}>What distance are you training for?</Text>
              <View style={styles.optionList}>
                {RACE_DISTANCES.map((rd) => (
                  <TouchableOpacity key={rd.key} activeOpacity={0.7} onPress={() => setRaceDistance(rd.key)}>
                    <GlassCard style={[styles.optionCard, raceDistance === rd.key && styles.optionCardActive]}>
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, raceDistance === rd.key && { color: colors.primaryLight }]}>
                          {rd.label}
                        </Text>
                        <Text style={styles.optionDesc}>{rd.desc}</Text>
                      </View>
                      {raceDistance === rd.key && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Target Race Date</Text>
              <Text style={styles.stepDesc}>When is your race? (Optional)</Text>
              <TextInput
                style={styles.textInputLarge}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                value={raceDate}
                onChangeText={setRaceDate}
                maxLength={10}
              />
              <Text style={styles.skipHint}>Skip if you don't have a race date yet</Text>
            </View>
          )}

          {step === 6 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Self-Assessment</Text>
              <Text style={styles.stepDesc}>Rate your current level in each discipline</Text>

              {DISCIPLINES.map((d) => {
                const current =
                  d.key === "swim" ? swimLevel : d.key === "bike" ? bikeLevel : runLevel;
                const setter =
                  d.key === "swim" ? setSwimLevel : d.key === "bike" ? setBikeLevel : setRunLevel;
                const dColor = disciplineColors[d.key].main;
                return (
                  <View key={d.key} style={styles.assessmentSection}>
                    <View style={styles.assessmentHeader}>
                      <Ionicons name={d.icon} size={20} color={dColor} />
                      <Text style={[styles.assessmentLabel, { color: dColor }]}>{d.label}</Text>
                    </View>
                    <View style={styles.assessmentRow}>
                      {DISCIPLINE_LEVELS.map((lvl) => (
                        <TouchableOpacity
                          key={lvl.key}
                          style={[
                            styles.assessmentChip,
                            current === lvl.key && {
                              backgroundColor: dColor + "20",
                              borderColor: dColor + "50",
                            },
                          ]}
                          onPress={() => setter(lvl.key)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.assessmentChipText,
                              current === lvl.key && { color: dColor },
                            ]}
                          >
                            {lvl.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {step === 7 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Weekly Availability</Text>
              <Text style={styles.stepDesc}>How many days per week can you train?</Text>
              <View style={styles.optionList}>
                {WEEKLY_AVAIL.map((wa) => (
                  <TouchableOpacity key={wa.key} activeOpacity={0.7} onPress={() => setWeeklyAvail(wa.key)}>
                    <GlassCard style={[styles.optionCard, weeklyAvail === wa.key && styles.optionCardActive]}>
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, weeklyAvail === wa.key && { color: colors.primaryLight }]}>
                          {wa.label}
                        </Text>
                        <Text style={styles.optionDesc}>{wa.desc}</Text>
                      </View>
                      {weeklyAvail === wa.key && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 8 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Primary Goal</Text>
              <Text style={styles.stepDesc}>What's your main motivation?</Text>
              <View style={styles.optionList}>
                {PRIMARY_GOALS.map((g) => (
                  <TouchableOpacity key={g.key} activeOpacity={0.7} onPress={() => setPrimaryGoal(g.key)}>
                    <GlassCard style={[styles.optionCard, primaryGoal === g.key && styles.optionCardActive]}>
                      <Text style={styles.goalIcon}>{g.icon}</Text>
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, primaryGoal === g.key && { color: colors.primaryLight }]}>
                          {g.label}
                        </Text>
                      </View>
                      {primaryGoal === g.key && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 9 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Mode Preference</Text>
              <Text style={styles.stepDesc}>How would you like to use Iron3?</Text>
              <View style={styles.optionList}>
                {APP_MODES.map((m) => (
                  <TouchableOpacity key={m.key} activeOpacity={0.7} onPress={() => setPreferredMode(m.key)}>
                    <GlassCard style={[styles.modeCard, preferredMode === m.key && styles.optionCardActive]}>
                      <Ionicons
                        name={m.icon}
                        size={32}
                        color={preferredMode === m.key ? colors.primary : colors.textSecondary}
                      />
                      <Text style={[styles.modeLabel, preferredMode === m.key && { color: colors.primaryLight }]}>
                        {m.label}
                      </Text>
                      <Text style={styles.modeDesc}>{m.desc}</Text>
                      {preferredMode === m.key && (
                        <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={styles.modeCheck} />
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 10 && (
            <View style={styles.stepContent}>
              <View style={styles.welcomeIcon}>
                <Text style={styles.welcomeEmoji}>🚀</Text>
              </View>
              <Text style={styles.stepTitle}>You're All Set!</Text>
              <Text style={styles.stepDesc}>Here's your personalized profile</Text>
              <GlassCard style={styles.summaryCard}>
                {name ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Name</Text>
                    <Text style={styles.summaryValue}>{name}</Text>
                  </View>
                ) : null}
                {experience && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Level</Text>
                    <Text style={styles.summaryValue}>{experience}</Text>
                  </View>
                )}
                {raceDistance && raceDistance !== "none" && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Race Goal</Text>
                    <Text style={styles.summaryValue}>
                      {RACE_DISTANCES.find((r) => r.key === raceDistance)?.label}
                    </Text>
                  </View>
                )}
                {raceDate ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Race Date</Text>
                    <Text style={styles.summaryValue}>{raceDate}</Text>
                  </View>
                ) : null}
                {weeklyAvail && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Training</Text>
                    <Text style={styles.summaryValue}>{weeklyAvail} days/week</Text>
                  </View>
                )}
                {primaryGoal && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Goal</Text>
                    <Text style={styles.summaryValue}>
                      {PRIMARY_GOALS.find((g) => g.key === primaryGoal)?.label}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Swim</Text>
                  <Text style={styles.summaryValue}>{swimLevel ?? "—"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Bike</Text>
                  <Text style={styles.summaryValue}>{bikeLevel ?? "—"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Run</Text>
                  <Text style={styles.summaryValue}>{runLevel ?? "—"}</Text>
                </View>
              </GlassCard>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(step - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, !canProgress() && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.7}
            disabled={!canProgress()}
          >
            <Text style={styles.nextButtonText}>
              {step === TOTAL_STEPS - 1 ? "Get Started" : "Continue"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
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
    padding: spacing.lg,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  progressDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  stepScroll: {
    flex: 1,
  },
  stepScrollContent: {
    paddingBottom: 24,
  },
  stepContent: {
    gap: 16,
  },
  welcomeIcon: {
    alignItems: "center",
    marginVertical: 16,
  },
  welcomeEmoji: {
    fontSize: 48,
  },
  stepTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  stepDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featureList: {
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  textInputLarge: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    color: colors.text,
    fontSize: fontSize.lg,
    padding: 16,
    textAlign: "center",
  },
  skipHint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginTop: 4,
  },
  optionList: {
    gap: 10,
    marginTop: 8,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  optionCardActive: {
    borderColor: colors.primary + "40",
    backgroundColor: colors.primary + "08",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  optionDesc: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  goalIcon: {
    fontSize: 22,
  },
  assessmentSection: {
    gap: 10,
    marginTop: 8,
  },
  assessmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  assessmentLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  assessmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  assessmentChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
    alignItems: "center",
  },
  assessmentChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  modeCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
    position: "relative",
  },
  modeLabel: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  modeDesc: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  modeCheck: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  summaryCard: {
    gap: 12,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  summaryValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    textTransform: "capitalize",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.full,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
