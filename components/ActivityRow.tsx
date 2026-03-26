import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Activity } from "@/types";
import {
  colors,
  fontSize,
  fontWeight,
  disciplineColors,
  disciplineIcons,
  borderRadius,
} from "@/theme";
import { formatDistance, formatDuration, formatPace } from "@/lib/scoring";

interface ActivityRowProps {
  activity: Activity;
  showDiscipline?: boolean;
}

const ionIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: "water",
  bicycle: "bicycle",
  walk: "walk",
};

export function ActivityRow({ activity, showDiscipline = true }: ActivityRowProps) {
  const dColors = disciplineColors[activity.discipline];
  const iconName = ionIconMap[disciplineIcons[activity.discipline]];

  const dateStr = new Date(activity.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      {showDiscipline && (
        <View style={[styles.icon, { backgroundColor: dColors.main + "20" }]}>
          <Ionicons name={iconName} size={18} color={dColors.main} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {activity.title}
        </Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>
            {formatDistance(activity.discipline, activity.distance)}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.stat}>
            {formatDuration(activity.duration)}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.stat}>
            {formatPace(activity.discipline, activity.pace)}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.points, { color: dColors.main }]}>
          +{activity.pointsEarned}
        </Text>
        <Text style={styles.date}>{dateStr}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stat: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  separator: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  points: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
