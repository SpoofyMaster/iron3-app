import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { PrepRowUiStatus } from "@/lib/prepSessionUi";
import { colors, fontSize, fontWeight } from "@/theme";

interface PrepSessionStatusProps {
  status: PrepRowUiStatus;
  compact?: boolean;
}

export function PrepSessionStatus({ status, compact }: PrepSessionStatusProps) {
  const emojiSize = compact ? 16 : 18;

  if (status === "rest") {
    return (
      <View style={styles.row}>
        <Text style={[styles.emoji, { fontSize: emojiSize }]}>⏭️</Text>
        {!compact && <Text style={styles.hint}>Skip</Text>}
      </View>
    );
  }
  if (status === "verified") {
    return <Text style={[styles.emoji, { fontSize: emojiSize }]}>✅</Text>;
  }
  if (status === "partial") {
    return <Text style={[styles.emoji, { fontSize: emojiSize }]}>✅</Text>;
  }
  if (status === "mismatch") {
    return <Text style={[styles.emoji, { fontSize: emojiSize }]}>🔄</Text>;
  }
  return <Text style={[styles.empty, { fontSize: emojiSize }]}>⬜</Text>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  emoji: { fontSize: 18 },
  empty: {
    fontSize: 18,
    color: colors.textMuted,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});
