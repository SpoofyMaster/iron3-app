import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { calculateDecay, getDecayWarning } from "@/lib/xpDecay";
import { useAppStore } from "@/store/useAppStore";

export function XpDecayWarning() {
  const { swimPoints, bikePoints, runPoints, lastSwimDate, lastBikeDate, lastRunDate } = useAppStore();

  const today = new Date();
  const swimDecay = calculateDecay(swimPoints, lastSwimDate, today);
  const bikeDecay = calculateDecay(bikePoints, lastBikeDate, today);
  const runDecay  = calculateDecay(runPoints,  lastRunDate,  today);

  const warnings = [
    swimDecay.isDecaying ? getDecayWarning("swim", swimDecay) : null,
    bikeDecay.isDecaying ? getDecayWarning("bike", bikeDecay) : null,
    runDecay.isDecaying  ? getDecayWarning("run",  runDecay)  : null,
  ].filter(Boolean) as string[];

  if (warnings.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="warning" size={14} color={colors.warning ?? "#FF9500"} />
        <Text style={styles.title}>XP DECAY ACTIVE</Text>
      </View>
      {warnings.map((w, i) => (
        <Text key={i} style={styles.warning}>• {w}</Text>
      ))}
      <Text style={styles.hint}>Train now to stop the decay</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: "rgba(255,80,0,0.10)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,80,0,0.35)",
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: "#FF6030",
    letterSpacing: 1,
  },
  warning: {
    fontSize: fontSize.sm,
    color: "#FF8050",
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: "italic",
  },
});
