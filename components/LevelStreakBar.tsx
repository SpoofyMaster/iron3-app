import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";
import { getTriRank } from "@/lib/ranks";

export function LevelStreakBar() {
  const router = useRouter();
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const currentStreak = useAppStore((s) => s.currentStreak);

  const triRank = useMemo(
    () => getTriRank(swimPoints, bikePoints, runPoints),
    [swimPoints, bikePoints, runPoints]
  );

  const levelInfo = useMemo(() => {
    const totalXp = triRank.overallPoints;
    const level = Math.floor(totalXp / 500) + 1;
    const levelXp = totalXp % 500;
    return { level, progress: levelXp / 500, xp: levelXp };
  }, [triRank.overallPoints]);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{levelInfo.level}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.glowCyan, colors.glowPurple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                { width: `${Math.max(levelInfo.progress * 100, 3)}%` },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakCount}>{currentStreak}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push("/settings/devices")}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: {
    color: colors.glowCyan,
    fontSize: 12,
    fontWeight: fontWeight.extrabold,
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakCount: {
    color: colors.text,
    fontSize: 13,
    fontWeight: fontWeight.bold,
  },
  settingsBtn: {
    padding: 4,
  },
});
