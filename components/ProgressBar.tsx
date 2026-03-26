import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

interface ProgressBarProps {
  progress: number;
  color: string;
  gradientColors?: string[];
  height?: number;
  showPercentage?: boolean;
  label?: string;
  sublabel?: string;
}

export function ProgressBar({
  progress,
  color,
  gradientColors,
  height = 8,
  showPercentage = false,
  label,
  sublabel,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const useGradient = gradientColors && gradientColors.length >= 2;

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          <View style={styles.rightLabels}>
            {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
            {showPercentage && (
              <Text style={[styles.percentage, { color }]}>
                {Math.round(clampedProgress * 100)}%
              </Text>
            )}
          </View>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        {useGradient ? (
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gradientFill,
              {
                width: `${Math.max(clampedProgress * 100, 1)}%`,
                height,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.fill,
              {
                width: `${Math.max(clampedProgress * 100, 1)}%`,
                backgroundColor: color,
                height,
                shadowColor: color,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  rightLabels: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sublabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  percentage: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  track: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  fill: {
    borderRadius: borderRadius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientFill: {
    borderRadius: borderRadius.full,
  },
});
