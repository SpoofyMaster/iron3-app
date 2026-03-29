import React, { useState } from "react";
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
import { GlassCard, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

interface OptionGroup {
  title: string;
  key: string;
  options: { value: string; label: string; subtitle?: string }[];
}

const OPTION_GROUPS: OptionGroup[] = [
  {
    title: "Distance",
    key: "distance",
    options: [
      { value: "km", label: "Kilometers", subtitle: "km" },
      { value: "mi", label: "Miles", subtitle: "mi" },
    ],
  },
  {
    title: "Pace",
    key: "pace",
    options: [
      { value: "min_km", label: "Minutes per km", subtitle: "min/km" },
      { value: "min_mi", label: "Minutes per mile", subtitle: "min/mi" },
    ],
  },
  {
    title: "Pool Length",
    key: "pool",
    options: [
      { value: "25m", label: "25 meters" },
      { value: "50m", label: "50 meters" },
      { value: "25yd", label: "25 yards" },
    ],
  },
  {
    title: "Week Starts On",
    key: "week_start",
    options: [
      { value: "monday", label: "Monday" },
      { value: "sunday", label: "Sunday" },
    ],
  },
  {
    title: "Temperature",
    key: "temp",
    options: [
      { value: "celsius", label: "Celsius", subtitle: "°C" },
      { value: "fahrenheit", label: "Fahrenheit", subtitle: "°F" },
    ],
  },
];

export default function UnitsScreen() {
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, string>>({
    distance: "km",
    pace: "min_km",
    pool: "25m",
    week_start: "monday",
    temp: "celsius",
  });

  const handleSelect = (groupKey: string, value: string) => {
    setSelections((prev) => ({ ...prev, [groupKey]: value }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Units & Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {OPTION_GROUPS.map((group) => (
          <View key={group.key}>
            <SectionHeader title={group.title} />
            <GlassCard style={styles.card}>
              {group.options.map((option, idx) => {
                const selected = selections[group.key] === option.value;
                return (
                  <View key={option.value}>
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => handleSelect(group.key, option.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionInfo}>
                        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                          {option.label}
                        </Text>
                        {option.subtitle && (
                          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        )}
                      </View>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                    {idx < group.options.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
            </GlassCard>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: 12, paddingBottom: 40 },
  card: { padding: 0, overflow: "hidden" },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 16,
  },
  optionInfo: { flex: 1, gap: 2 },
  optionLabel: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.regular },
  optionLabelSelected: { color: colors.primary, fontWeight: fontWeight.semibold },
  optionSubtitle: { color: colors.textMuted, fontSize: fontSize.xs },
  divider: { height: 1, backgroundColor: colors.surfaceGlassBorder, marginHorizontal: 16 },
});
