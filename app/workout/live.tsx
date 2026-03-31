import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { getTriRank, getRankForPoints, getNextRankTier, formatPoints } from "@/lib/ranks";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatPacePerKm(seconds: number, distanceKm: number): string {
  if (distanceKm <= 0) return "--:--";
  const paceSeconds = seconds / distanceKm;
  const m = Math.floor(paceSeconds / 60);
  const s = Math.floor(paceSeconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function LiveWorkoutScreen() {
  const router = useRouter();
  const liveWorkout = useAppStore((s) => s.liveWorkout);
  const startLiveWorkout = useAppStore((s) => s.startLiveWorkout);
  const pauseLiveWorkout = useAppStore((s) => s.pauseLiveWorkout);
  const resumeLiveWorkout = useAppStore((s) => s.resumeLiveWorkout);
  const stopLiveWorkout = useAppStore((s) => s.stopLiveWorkout);
  const updateLiveWorkout = useAppStore((s) => s.updateLiveWorkout);
  const addSplit = useAppStore((s) => s.addSplit);
  const logWorkout = useAppStore((s) => s.logWorkout);

  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);

  const triRank = useMemo(
    () => getTriRank(swimPoints, bikePoints, runPoints),
    [swimPoints, bikePoints, runPoints]
  );

  const rankInfo = useMemo(
    () => getRankForPoints(triRank.overallPoints),
    [triRank.overallPoints]
  );

  const nextRankTier = useMemo(() => getNextRankTier(triRank.tier), [triRank.tier]);

  const [elapsed, setElapsed] = useState(0);
  const [simulatedDistance, setSimulatedDistance] = useState(0);
  const [currentCoord, setCurrentCoord] = useState({ lat: 52.3676, lng: 4.9041 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const xpEarned = useMemo(() => Math.floor(elapsed / 60) * 3 + Math.floor(simulatedDistance * 8), [elapsed, simulatedDistance]);
  const xpNeeded = rankInfo.pointsToNext ?? 0;

  useEffect(() => {
    if (!liveWorkout.isActive) {
      startLiveWorkout("run");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveWorkout.isActive]);

  useEffect(() => {
    if (liveWorkout.isActive && !liveWorkout.isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          const dist = next * 0.0025;
          setSimulatedDistance(dist);
          const newLat = 52.3676 + Math.sin(next * 0.01) * 0.002;
          const newLng = 4.9041 + next * 0.00003;
          setCurrentCoord({ lat: newLat, lng: newLng });
          updateLiveWorkout(next, dist, {
            latitude: newLat,
            longitude: newLng,
            timestamp: Date.now(),
          });
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [liveWorkout.isActive, liveWorkout.isPaused]);

  const handlePauseResume = useCallback(() => {
    if (liveWorkout.isPaused) {
      resumeLiveWorkout();
    } else {
      pauseLiveWorkout();
    }
  }, [liveWorkout.isPaused]);

  const handleStop = useCallback(async () => {
    stopLiveWorkout();
    await logWorkout({
      discipline: liveWorkout.discipline,
      workoutType: "easy",
      duration: elapsed,
      distance: parseFloat(simulatedDistance.toFixed(2)),
      effort: 6,
      indoorOutdoor: "outdoor",
      notes: "GPS tracked workout",
      date: new Date().toISOString(),
    });
    router.back();
  }, [elapsed, simulatedDistance, liveWorkout.discipline, logWorkout, router, stopLiveWorkout]);

  const splits = liveWorkout.splits.length > 0
    ? liveWorkout.splits.slice(-3)
    : [285, 292, 298];

  const maxSplit = Math.max(...splits, 1);

  return (
    <View style={styles.container}>
      {/* GPS Map Placeholder */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={["#0a1628", "#0d2137", "#0a1628"]}
          style={styles.mapGradient}
        >
          <View style={styles.mapGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 14}%` }]} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 11}%` }]} />
            ))}
          </View>

          {/* Simulated route path */}
          <View style={styles.routePath}>
            <View style={[styles.routeDot, { left: "20%", top: "60%" }]} />
            <View style={[styles.routeLine, { left: "22%", top: "55%", width: 40, transform: [{ rotate: "-30deg" }] }]} />
            <View style={[styles.routeDot, { left: "35%", top: "40%" }]} />
            <View style={[styles.routeLine, { left: "37%", top: "38%", width: 50, transform: [{ rotate: "10deg" }] }]} />
            <View style={[styles.routeDot, { left: "52%", top: "42%" }]} />
            <View style={[styles.routeLine, { left: "54%", top: "45%", width: 35, transform: [{ rotate: "45deg" }] }]} />
            <View style={[styles.routeDotCurrent, { left: "65%", top: "55%" }]} />
          </View>

          <View style={styles.coordOverlay}>
            <Text style={styles.coordText}>
              {currentCoord.lat.toFixed(4)}°N, {currentCoord.lng.toFixed(4)}°E
            </Text>
          </View>

          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpSection}>
        <View style={styles.xpRow}>
          <View style={styles.xpBadge}>
            <Text style={[styles.xpBadgeText, { color: triRank.tierColor }]}>{triRank.tier}</Text>
          </View>
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBarTrack}>
              <LinearGradient
                colors={[colors.glowCyan, colors.glowPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.xpBarFill, { width: `${Math.min(rankInfo.progress * 100, 100)}%` }]}
              />
            </View>
          </View>
          <Text style={styles.xpNextRank}>{nextRankTier ?? "MAX"}</Text>
        </View>
        <View style={styles.xpNumbers}>
          <Text style={styles.xpEarned}>XP EARNED: {xpEarned.toLocaleString()}</Text>
          <Text style={styles.xpNeeded}>XP NEEDED: {xpNeeded.toLocaleString()}</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={styles.statValueMono}>{formatTime(elapsed)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DISTANCE</Text>
          <Text style={styles.statValueBold}>{simulatedDistance.toFixed(2)} km</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PACE / KM</Text>
          <Text style={styles.statValueLarge}>{formatPacePerKm(elapsed, simulatedDistance)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SPLITS</Text>
          <View style={styles.splitsContainer}>
            {splits.map((s, i) => (
              <View key={i} style={styles.splitRow}>
                <View
                  style={[
                    styles.splitBar,
                    {
                      width: `${(s / maxSplit) * 100}%`,
                      backgroundColor: i === splits.length - 1 ? colors.glowCyan : colors.glowCyan + "60",
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.controls}>
        {liveWorkout.isPaused && (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStop} activeOpacity={0.8}>
            <Ionicons name="stop" size={28} color="#EF4444" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handlePauseResume} activeOpacity={0.8} style={styles.pauseWrapper}>
          <LinearGradient
            colors={liveWorkout.isPaused ? [colors.glowCyan, colors.glowBlue] : [colors.glowCyan, colors.glowBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pauseBtn}
          >
            <Ionicons
              name={liveWorkout.isPaused ? "play" : "pause"}
              size={36}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>
        {liveWorkout.isPaused && (
          <TouchableOpacity
            style={styles.splitBtn}
            onPress={() => addSplit(elapsed)}
            activeOpacity={0.8}
          >
            <Ionicons name="flag" size={24} color={colors.glowCyan} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    height: SCREEN_HEIGHT * 0.35,
    overflow: "hidden",
  },
  mapGradient: {
    flex: 1,
    position: "relative",
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(6, 182, 212, 0.06)",
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(6, 182, 212, 0.06)",
  },
  routePath: {
    ...StyleSheet.absoluteFillObject,
  },
  routeDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.glowCyan + "80",
  },
  routeDotCurrent: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.glowCyan,
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  routeLine: {
    position: "absolute",
    height: 2,
    backgroundColor: colors.glowCyan + "60",
    borderRadius: 1,
  },
  coordOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  coordText: {
    color: colors.glowCyan,
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  xpSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    gap: 6,
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  xpBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  xpBarContainer: {
    flex: 1,
  },
  xpBarTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  xpNextRank: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  xpNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xpEarned: {
    color: colors.glowCyan,
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  xpNeeded: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: 10,
    flex: 1,
  },
  statBox: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - 10) / 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 16,
    gap: 8,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  statValueMono: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeight.bold,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 2,
  },
  statValueBold: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeight.extrabold,
  },
  statValueLarge: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  splitsContainer: {
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  splitRow: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 4,
    overflow: "hidden",
  },
  splitBar: {
    height: "100%",
    borderRadius: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 12,
    gap: 24,
  },
  pauseWrapper: {
    borderRadius: 40,
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  pauseBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stopBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 2,
    borderColor: "rgba(239, 68, 68, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  splitBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(6, 182, 212, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(6, 182, 212, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
});
