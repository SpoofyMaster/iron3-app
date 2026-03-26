import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PersonalBest } from "@/types";
import { colors, fontSize, fontWeight } from "@/theme";
import { formatDuration } from "@/lib/scoring";

interface PersonalBestRowProps {
  pb: PersonalBest;
  color: string;
}

export function PersonalBestRow({ pb, color }: PersonalBestRowProps) {
  const formattedValue =
    pb.unit === "sec" ? formatDuration(pb.value) : `${pb.value}`;

  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: color + "15" }]}>
        <Ionicons name="trophy" size={16} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{pb.category}</Text>
        <Text style={styles.date}>
          {new Date(pb.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text style={[styles.value, { color }]}>{formattedValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  category: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
