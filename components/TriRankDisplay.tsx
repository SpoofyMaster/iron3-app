import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TriRank } from "@/types";
import { RankBadge } from "./RankBadge";
import { colors, fontSize, fontWeight } from "@/theme";
import { formatPoints } from "@/lib/ranks";

interface TriRankDisplayProps {
  triRank: TriRank;
}

export function TriRankDisplay({ triRank }: TriRankDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.glowRing}>
        <View style={[styles.outerRing, { borderColor: triRank.tierColor + "40" }]}>
          <View style={[styles.innerRing, { borderColor: triRank.tierColor + "80" }]}>
            <RankBadge
              tier={triRank.tier}
              tierColor={triRank.tierColor}
              size="xl"
            />
          </View>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>TRI-RANK</Text>
        <Text style={[styles.tier, { color: triRank.tierColor }]}>
          {triRank.tier}
        </Text>
        <Text style={styles.points}>
          {formatPoints(triRank.overallPoints)} pts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  glowRing: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    gap: 2,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 2,
  },
  tier: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  points: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
