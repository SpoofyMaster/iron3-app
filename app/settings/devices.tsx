import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard, SectionHeader } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { connectAppleHealth, syncHealthWorkouts, getLastSyncTime } from "@/lib/healthSync";

const DEVICE_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string; gradient: string[] }
> = {
  apple_health: { icon: "heart", color: "#FF2D55", gradient: ["#FF2D55", "#FF6B8A"] },
  garmin: { icon: "watch", color: "#007DC3", gradient: ["#007DC3", "#00A5E0"] },
  strava: { icon: "bicycle", color: "#FC4C02", gradient: ["#FC4C02", "#FF7F50"] },
};

export default function ConnectedDevicesScreen() {
  const router = useRouter();
  const currentUserId = useAppStore((s) => s.currentUserId);
  const connectedDevices = useAppStore((s) => s.connectedDevices);
  const toggleDeviceConnection = useAppStore((s) => s.toggleDeviceConnection);

  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{
    synced: number;
    skipped: number;
  } | null>(null);

  const handleConnectAppleHealth = useCallback(async () => {
    if (Platform.OS !== "ios") {
      Alert.alert("Not Available", "Apple Health is only available on iOS devices.");
      return;
    }
    setConnecting("dev-001");
    try {
      const result = await connectAppleHealth();
      if (result.success) {
        toggleDeviceConnection("dev-001");
        Alert.alert("✅ Connected", "Apple Health connected successfully! Syncing your workouts...");
        // Auto-sync after connecting
        handleSyncAppleHealth();
      } else {
        Alert.alert("Connection Failed", result.error ?? "Could not connect to Apple Health.");
      }
    } catch (e) {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setConnecting(null);
    }
  }, []);

  const handleSyncAppleHealth = useCallback(async () => {
    if (!currentUserId) {
      Alert.alert("Not Logged In", "Please log in to sync workouts.");
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncHealthWorkouts(currentUserId, 30);
      setSyncResult({ synced: result.synced, skipped: result.skipped });

      if (result.synced > 0) {
        const totalPoints = result.newActivities.reduce((sum, a) => sum + a.points, 0);
        Alert.alert(
          "🎉 Sync Complete",
          `Imported ${result.synced} new workout${result.synced > 1 ? "s" : ""}!\n+${totalPoints} rank points earned.`
        );
        // Refresh all persisted user data
        await useAppStore.getState().hydrateUserData(currentUserId);
      } else if (result.skipped > 0) {
        Alert.alert("Up to Date", "All workouts already synced. Nothing new to import.");
      } else {
        Alert.alert(
          "No Workouts Found",
          "No swim, bike, or run workouts found in the last 30 days. Go train! 💪"
        );
      }

      const lastSyncTime = await getLastSyncTime(currentUserId);
      setLastSync(lastSyncTime);
    } catch (e) {
      console.error("Sync error:", e);
      Alert.alert("Sync Failed", "Could not sync workouts. Please try again.");
    } finally {
      setSyncing(false);
    }
  }, [currentUserId]);

  const handleConnectGarmin = () => {
    Alert.alert(
      "Garmin Connect",
      "Garmin integration requires OAuth setup. This will be available in a future update.\n\nIn the meantime, if your Garmin syncs to Apple Health, connect Apple Health to get your data.",
      [
        { text: "OK" },
        {
          text: "Open Garmin Connect",
          onPress: () => Linking.openURL("https://connect.garmin.com"),
        },
      ]
    );
  };

  const handleConnectStrava = () => {
    Alert.alert(
      "Strava",
      "Strava integration is coming soon.\n\nIf Strava syncs to Apple Health, connect Apple Health to import your workouts.",
      [{ text: "OK" }]
    );
  };

  const handleDevicePress = (device: (typeof connectedDevices)[0]) => {
    if (device.type === "apple_health") {
      if (device.isConnected) {
        // Already connected — offer sync or disconnect
        Alert.alert("Apple Health", "What would you like to do?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sync Now",
            onPress: handleSyncAppleHealth,
          },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => toggleDeviceConnection(device.id),
          },
        ]);
      } else {
        handleConnectAppleHealth();
      }
    } else if (device.type === "garmin") {
      handleConnectGarmin();
    } else if (device.type === "strava") {
      handleConnectStrava();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Connected Devices</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Connect your fitness devices to automatically import workouts and earn rank points.
        </Text>

        <SectionHeader title="Available Integrations" />

        {connectedDevices.map((device) => {
          const config = DEVICE_CONFIG[device.type];
          const isConnecting = connecting === device.id;

          return (
            <TouchableOpacity
              key={device.id}
              activeOpacity={0.7}
              onPress={() => handleDevicePress(device)}
            >
              <GlassCard
                style={[
                  styles.deviceCard,
                  device.isConnected && { borderColor: config.color + "40", borderWidth: 1 },
                ]}
              >
                <View style={styles.deviceRow}>
                  <View style={[styles.deviceIcon, { backgroundColor: config.color + "20" }]}>
                    <Ionicons name={config.icon} size={24} color={config.color} />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    {device.isConnected ? (
                      <Text style={[styles.deviceStatus, { color: colors.success }]}>
                        ● Connected
                      </Text>
                    ) : (
                      <Text style={styles.deviceStatus}>Tap to connect</Text>
                    )}
                    {device.isConnected && device.lastSync && (
                      <Text style={styles.lastSyncText}>
                        Last sync: {new Date(device.lastSync).toLocaleString()}
                      </Text>
                    )}
                  </View>
                  {isConnecting ? (
                    <ActivityIndicator size="small" color={config.color} />
                  ) : device.isConnected ? (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  ) : (
                    <Ionicons name="add-circle-outline" size={24} color={colors.textMuted} />
                  )}
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Sync button if Apple Health is connected */}
        {connectedDevices.find((d) => d.type === "apple_health" && d.isConnected) && (
          <>
            <SectionHeader title="Manual Sync" />
            <TouchableOpacity
              style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
              onPress={handleSyncAppleHealth}
              disabled={syncing}
              activeOpacity={0.8}
            >
              {syncing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="sync" size={20} color="#fff" />
              )}
              <Text style={styles.syncButtonText}>
                {syncing ? "Syncing..." : "Sync Workouts Now"}
              </Text>
            </TouchableOpacity>

            {syncResult && (
              <GlassCard style={styles.resultCard}>
                <Text style={styles.resultTitle}>Last Sync Result</Text>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>New workouts imported:</Text>
                  <Text style={[styles.resultValue, { color: colors.success }]}>
                    {syncResult.synced}
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Already synced:</Text>
                  <Text style={styles.resultValue}>{syncResult.skipped}</Text>
                </View>
              </GlassCard>
            )}
          </>
        )}

        {/* Info card */}
        <SectionHeader title="How It Works" />
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>
              Complete a workout with your watch (swim, bike, or run)
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>
              Your watch syncs the data to Apple Health or Garmin Connect
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>
              Iron3 imports the workout and calculates your rank points
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoNumber}>4</Text>
            <Text style={styles.infoText}>
              Your rank updates and you climb the leaderboard! 🏆
            </Text>
          </View>
        </GlassCard>

        {/* Garmin tip */}
        <GlassCard style={styles.tipCard} variant="highlighted">
          <Ionicons name="bulb-outline" size={20} color={colors.run} />
          <Text style={styles.tipText}>
            <Text style={{ fontWeight: fontWeight.bold }}>Garmin users: </Text>
            Enable "Write to Apple Health" in Garmin Connect app settings (Settings → Health → Apple Health) to sync your workouts through Apple Health.
          </Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: 12, paddingBottom: 40 },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: 4,
  },
  deviceCard: { gap: 0 },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceInfo: { flex: 1, gap: 2 },
  deviceName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  deviceStatus: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  lastSyncText: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
  },
  syncButtonDisabled: { opacity: 0.6 },
  syncButtonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  resultCard: { gap: 8 },
  resultTitle: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  resultValue: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  infoCard: { gap: 0, padding: 0, overflow: "hidden" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoNumber: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    width: 24,
    textAlign: "center",
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginHorizontal: 16,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
});
