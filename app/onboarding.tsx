import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components";
import { Discipline, ExperienceLevel } from "@/types";
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  disciplineColors,
} from "@/theme";

const { width } = Dimensions.get("window");

const EXPERIENCE_LEVELS: {
  key: ExperienceLevel;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "beginner",
    label: "Beginner",
    desc: "New to triathlon or returning after a long break",
    icon: "leaf-outline",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    desc: "Completed a few races, training regularly",
    icon: "fitness-outline",
  },
  {
    key: "advanced",
    label: "Advanced",
    desc: "Multiple race finishes, structured training",
    icon: "flash-outline",
  },
  {
    key: "pro",
    label: "Pro / Elite",
    desc: "Competitive racer, high-level performance",
    icon: "trophy-outline",
  },
];

const DISCIPLINES: {
  key: Discipline;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "swim", label: "Swimming", icon: "water" },
  { key: "bike", label: "Cycling", icon: "bicycle" },
  { key: "run", label: "Running", icon: "walk" },
];

const WEEKLY_GOALS = [2, 3, 4, 5, 6, 7];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>(
    []
  );
  const [weeklyGoal, setWeeklyGoal] = useState(3);

  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setExperienceLevel = useAppStore((s) => s.setExperienceLevel);
  const setOnboardingDisciplines = useAppStore(
    (s) => s.setOnboardingDisciplines
  );
  const setWeeklyGoalStore = useAppStore((s) => s.setWeeklyGoal);

  const toggleDiscipline = (d: Discipline) => {
    setSelectedDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (experience) setExperienceLevel(experience);
      setOnboardingDisciplines(selectedDisciplines);
      setWeeklyGoalStore(weeklyGoal);
      completeOnboarding();
      router.replace("/(tabs)");
    }
  };

  const canProgress = () => {
    if (step === 1 && !experience) return false;
    if (step === 2 && selectedDisciplines.length === 0) return false;
    return true;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.progressBar}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.stepContent}>
            <View style={styles.welcomeIcon}>
              <Text style={styles.welcomeEmoji}>🏊‍♂️🚴‍♂️🏃‍♂️</Text>
            </View>
            <Text style={styles.stepTitle}>Welcome to Iron3</Text>
            <Text style={styles.stepDesc}>
              The gamified triathlon experience. Track your swim, bike, and run
              activities, earn points, climb the ranks, and compete with athletes
              worldwide.
            </Text>
            <View style={styles.featureList}>
              {[
                "Earn XP across three disciplines",
                "Climb from Iron to Legendary rank",
                "Compete on global leaderboards",
                "Track personal bests & progress",
              ].map((feat, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Experience Level</Text>
            <Text style={styles.stepDesc}>
              This helps us personalize your training insights
            </Text>
            <View style={styles.optionList}>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <TouchableOpacity
                  key={lvl.key}
                  activeOpacity={0.7}
                  onPress={() => setExperience(lvl.key)}
                >
                  <GlassCard
                    style={[
                      styles.optionCard,
                      experience === lvl.key && styles.optionCardActive,
                    ]}
                  >
                    <Ionicons
                      name={lvl.icon}
                      size={24}
                      color={
                        experience === lvl.key
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />
                    <View style={styles.optionText}>
                      <Text
                        style={[
                          styles.optionLabel,
                          experience === lvl.key && {
                            color: colors.primaryLight,
                          },
                        ]}
                      >
                        {lvl.label}
                      </Text>
                      <Text style={styles.optionDesc}>{lvl.desc}</Text>
                    </View>
                    {experience === lvl.key && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={colors.primary}
                      />
                    )}
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Disciplines</Text>
            <Text style={styles.stepDesc}>
              Select which disciplines you train. You can change this later.
            </Text>
            <View style={styles.disciplineGrid}>
              {DISCIPLINES.map((d) => {
                const isSelected = selectedDisciplines.includes(d.key);
                const dColor = disciplineColors[d.key].main;
                return (
                  <TouchableOpacity
                    key={d.key}
                    activeOpacity={0.7}
                    onPress={() => toggleDiscipline(d.key)}
                  >
                    <GlassCard
                      style={[
                        styles.disciplineCard,
                        isSelected && {
                          borderColor: dColor + "40",
                          backgroundColor: dColor + "10",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.disciplineIcon,
                          { backgroundColor: dColor + "20" },
                        ]}
                      >
                        <Ionicons
                          name={d.icon}
                          size={32}
                          color={isSelected ? dColor : colors.textMuted}
                        />
                      </View>
                      <Text
                        style={[
                          styles.disciplineLabel,
                          isSelected && { color: dColor },
                        ]}
                      >
                        {d.label}
                      </Text>
                      {isSelected && (
                        <View
                          style={[
                            styles.checkCircle,
                            { backgroundColor: dColor },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color="#fff"
                          />
                        </View>
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Weekly Goal</Text>
            <Text style={styles.stepDesc}>
              How many training sessions per week?
            </Text>
            <View style={styles.goalGrid}>
              {WEEKLY_GOALS.map((g) => (
                <TouchableOpacity
                  key={g}
                  activeOpacity={0.7}
                  onPress={() => setWeeklyGoal(g)}
                  style={[
                    styles.goalCard,
                    weeklyGoal === g && styles.goalCardActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.goalNumber,
                      weeklyGoal === g && styles.goalNumberActive,
                    ]}
                  >
                    {g}
                  </Text>
                  <Text style={styles.goalLabel}>
                    {g === 2
                      ? "Easy"
                      : g <= 4
                      ? "Moderate"
                      : g <= 5
                      ? "Active"
                      : "Intense"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.goalInfo}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.textMuted}
              />
              <Text style={styles.goalInfoText}>
                You can always adjust your goals later in settings
              </Text>
            </View>
          </View>
        )}

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
            style={[
              styles.nextButton,
              !canProgress() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            activeOpacity={0.7}
            disabled={!canProgress()}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? "Get Started" : "Continue"}
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
    gap: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  stepContent: {
    flex: 1,
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
  disciplineGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    justifyContent: "center",
  },
  disciplineCard: {
    width: (width - 80) / 3,
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
    position: "relative",
  },
  disciplineIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  disciplineLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  checkCircle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
  },
  goalCard: {
    width: (width - 72) / 3,
    alignItems: "center",
    paddingVertical: 20,
    gap: 6,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  goalCardActive: {
    borderColor: colors.primary + "40",
    backgroundColor: colors.primary + "10",
  },
  goalNumber: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  goalNumberActive: {
    color: colors.primaryLight,
  },
  goalLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  goalInfoText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
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
