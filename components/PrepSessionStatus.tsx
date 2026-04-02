import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PrepRowUiStatus } from "@/lib/prepSessionUi";
import { colors } from "@/theme";

interface PrepSessionStatusProps {
  status: PrepRowUiStatus;
  compact?: boolean;
}

export function PrepSessionStatus({ status, compact }: PrepSessionStatusProps) {
  const size = compact ? 20 : 24;
  const iconSize = compact ? 12 : 14;
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // Rest day — no circle
  if (status === "rest") {
    return null;
  }

  // Verified (exact or partial match) — green check circle (same as old ✅)
  if (status === "verified" || status === "partial") {
    return (
      <View style={[styles.checkCircle, circleStyle]}>
        <Ionicons name="checkmark" size={iconSize} color={colors.success} />
      </View>
    );
  }

  // Mismatch — orange circle with sync icon
  if (status === "mismatch") {
    return (
      <View style={[styles.mismatchCircle, circleStyle]}>
        <Ionicons name="sync" size={iconSize} color="#F59E0B" />
      </View>
    );
  }

  // Empty / not done — hollow gray circle (same as old empty circle)
  return <View style={[styles.emptyCircle, circleStyle]} />;
}

const styles = StyleSheet.create({
  checkCircle: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  mismatchCircle: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
  },
});
