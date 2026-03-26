import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polyline, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { colors, fontSize, fontWeight } from "@/theme";

interface MiniChartProps {
  data: number[];
  labels?: string[];
  color: string;
  height?: number;
  title?: string;
}

export function MiniChart({
  data,
  labels,
  color,
  height = 120,
  title,
}: MiniChartProps) {
  if (data.length < 2) return null;

  const padding = 8;
  const chartWidth = 300;
  const chartHeight = height - 24;
  const maxVal = Math.max(...data) * 1.1;
  const minVal = 0;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
      const y =
        chartHeight - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.chartContainer, { height }]}>
        <Svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      {labels && (
        <View style={styles.labels}>
          {labels.map((l, i) => (
            <Text key={i} style={styles.label}>
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: 8,
  },
  chartContainer: {
    width: "100%",
    overflow: "hidden",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
