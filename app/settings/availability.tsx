import React from "react";
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
import { Discipline } from "@/types";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DISCIPLINE_CONFIG: { key: Discipline; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { key: "swim", label: "Swimming", icon: "water", color: colors.swim },
  { key: "bike", label: "Cycling", icon: "bicycle", color: colors.bike },
  { key: "run", label: "Running", icon: "walk", color: colors.run },
];

export default function AvailabilityScreen() {
  const router = useRouter();
  const availability = useAppStore((s) => s.availability);
  const toggleAvailabilityDay = useAppStore((s) => s.toggleAvailabilityDay);
  const preferredLongRideDay = availability.preferredLongRideDay;
  const setPreferredLongRideDay = useAppStore((s) => s.setPreferredLongRideDay);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Training Availability</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Select which days you're available to train for each discipline. 
          This helps us build your personalized training plan.
        </Text>

        {DISCIPLINE_CONFIG.map((disc) => {
          const selectedDays = availability[disc.key];
          return (
            <View key={disc.key} style={styles.disciplineSection}>
              <View style={styles.disciplineHeader}>
                <View style={[styles.disciplineIcon, { backgroundColor: disc.color + "15", borderColor: disc.color + "30" }]}>
                  <Ionicons name={disc.icon} size={18} color={disc.color} />
                </View>
                <Text style={styles.disciplineName}>{disc.label}</Text>
                <Text style={styles.dayCount}>{selectedDays.length} days</Text>
              </View>

              <Text style={styles.sectionLabel}>Available {disc.label.toLowerCase()} days</Text>

              <View style={styles.daysRow}>
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayBtn,
                        isSelected && {
                          backgroundColor: disc.color + "15",
                          borderColor: disc.color,
                        },
                      ]}
                      onPress={() => toggleAvailabilityDay(disc.key, day)}
                      activeOpacity={0.7}
                    >
                      {isSelected && (
                        <Ionicons name={disc.icon} size={12} color={disc.color} />
                      )}
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && { color: disc.color, fontWeight: fontWeight.bold },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {disc.key === "bike" && (
                <View style={styles.longRideSection}>
                  <Text style={styles.longRideLabel}>Preferred long ride day</Text>
                  <View style={styles.daysRow}>
                    {DAYS.map((day) => {
                      const isSelected = preferredLongRideDay === day;
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayBtnSmall,
                            isSelected && {
                              backgroundColor: colors.bike + "20",
                              borderColor: colors.bike,
                            },
                          ]}
                          onPress={() => setPreferredLongRideDay(isSelected ? null : day)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.dayTextSmall,
                              isSelected && { color: colors.bike, fontWeight: fontWeight.bold },
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
    gap: 24,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  disciplineSection: {
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceGlassBorder,
  },
  disciplineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  disciplineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  disciplineName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    flex: 1,
  },
  dayCount: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  },
  daysRow: {
    flexDirection: "row",
    gap: 6,
  },
  dayBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  dayText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.medium,
  },
  dayBtnSmall: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  dayTextSmall: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: fontWeight.medium,
  },
  longRideSection: {
    gap: 8,
    marginTop: 4,
  },
  longRideLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    fontStyle: "italic",
  },
});
