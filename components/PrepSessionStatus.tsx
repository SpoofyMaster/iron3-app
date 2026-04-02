import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { PrepRowUiStatus } from "@/lib/prepSessionUi";
import { colors, fontSize, fontWeight } from "@/theme";

interface PrepSessionStatusProps {
  status: PrepRowUiStatus;
  compact?: boolean;
}

export function PrepSessionStatus({ status, compact }: PrepSessionStatusProps) {
  if (status === "rest") {
    return (
      <View style={styles.row}>
        <Text style={styles.emoji}>⏭️</Text>
        {!compact && <Text style={styles.hint}>Skip</Text>}
      </View>
    );
  }
  if (status === "verified") {
    return <Text style={styles.emoji}>✅</Text>;
  }
  if (status === "partial") {
    return <Text style={styles.emoji}>✅</Text>;
  }
  if (status === "mismatch") {
    return <Text style={styles.emoji}>🔄</Text>;
  }
  return <Text style={styles.empty}>⬜</Text>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  emoji: { fontSize: compact ? 16 : 18 },
  empty: {
    fontSize: compact ? 16 : 18,
    color: colors.textMuted,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});
