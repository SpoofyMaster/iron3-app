import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { formatDuration, formatDistance, formatPace } from "@/lib/scoring";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CardTheme {
  name: string;
  gradient: readonly [string, string, string];
  accentColor: string;
}

const CARD_THEMES: CardTheme[] = [
  { name: "Midnight", gradient: ["#0f0c29", "#302b63", "#24243e"] as const, accentColor: colors.glowCyan },
  { name: "Sunset", gradient: ["#7b2ff7", "#c240e0", "#f97316"] as const, accentColor: "#F97316" },
  { name: "Ocean", gradient: ["#0a1628", "#06B6D4", "#0891B2"] as const, accentColor: "#22D3EE" },
  { name: "Forest", gradient: ["#0a1f0a", "#10B981", "#059669"] as const, accentColor: "#34D399" },
  { name: "Fire", gradient: ["#1a0000", "#EF4444", "#F97316"] as const, accentColor: "#EF4444" },
];

export default function ShareScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activities = useAppStore((s) => s.activities);
  const user = useAppStore((s) => s.user);

  const [themeIdx, setThemeIdx] = useState(0);
  const theme = CARD_THEMES[themeIdx];

  const activity = useMemo(() => {
    if (id) return activities.find((a) => a.id === id);
    return activities[0];
  }, [activities, id]);

  const handleNextTheme = () => {
    setThemeIdx((prev) => (prev + 1) % CARD_THEMES.length);
  };

  const handleShare = async () => {
    // V1: placeholder - would use expo-sharing + ViewShot
    // For now, just navigate back
    router.back();
  };

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No activity to share</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Shareable Card */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={[...theme.gradient]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Background silhouette */}
          <View style={styles.silhouette}>
            <Ionicons
              name={activity.discipline === "swim" ? "water" : activity.discipline === "bike" ? "bicycle" : "walk"}
              size={200}
              color="rgba(255,255,255,0.04)"
            />
          </View>

          {/* Top: app branding */}
          <View style={styles.cardTop}>
            <Text style={styles.brandText}>IRON3</Text>
            <Text style={styles.dateText}>
              {new Date(activity.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* Middle: Big stats */}
          <View style={styles.cardStats}>
            <View style={styles.bigStat}>
              <Text style={styles.bigStatLabel}>TIME</Text>
              <Text style={[styles.bigStatValue, { color: theme.accentColor }]}>
                {formatDuration(activity.duration)}
              </Text>
            </View>
            <View style={styles.bigStat}>
              <Text style={styles.bigStatLabel}>DISTANCE</Text>
              <Text style={[styles.bigStatValue, { color: theme.accentColor }]}>
                {formatDistance(activity.discipline, activity.distance)}
              </Text>
            </View>
            <View style={styles.bigStat}>
              <Text style={styles.bigStatLabel}>PACE</Text>
              <Text style={[styles.bigStatValue, { color: theme.accentColor }]}>
                {formatPace(activity.discipline, activity.pace)}
              </Text>
            </View>
          </View>

          {/* Bottom: activity name and user */}
          <View style={styles.cardBottom}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.userName}>{user.displayName}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Theme name */}
      <Text style={styles.themeName}>{theme.name}</Text>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleNextTheme} style={styles.themeButton} activeOpacity={0.7}>
          <Ionicons name="arrow-forward" size={24} color={colors.text} />
          <Text style={styles.themeButtonText}>Next Theme</Text>
        </TouchableOpacity>
      </View>

      {/* Share button */}
      <TouchableOpacity onPress={handleShare} activeOpacity={0.8} style={styles.shareButtonWrapper}>
        <LinearGradient
          colors={["#F56040", "#C13584", "#833AB4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shareButton}
        >
          <Ionicons name="logo-instagram" size={22} color="#fff" />
          <Text style={styles.shareButtonText}>SHARE TO INSTAGRAM</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
  },
  closeBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  cardWrapper: {
    width: SCREEN_WIDTH - 48,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    padding: 28,
    aspectRatio: 0.65,
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  silhouette: {
    position: "absolute",
    right: -40,
    bottom: "20%",
    opacity: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 4,
  },
  dateText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  cardStats: {
    gap: 24,
    alignItems: "center",
  },
  bigStat: {
    alignItems: "center",
    gap: 4,
  },
  bigStatLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 3,
  },
  bigStatValue: {
    fontSize: 36,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  cardBottom: {
    alignItems: "center",
    gap: 4,
  },
  activityTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  userName: {
    color: "rgba(255,255,255,0.4)",
    fontSize: fontSize.sm,
  },
  themeName: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginTop: 16,
    letterSpacing: 1,
  },
  controls: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  themeButtonText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  shareButtonWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 44 : 24,
    left: 24,
    right: 24,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: "#C13584",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: borderRadius.lg,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 2,
  },
});
