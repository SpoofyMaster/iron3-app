import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";

const DEVICE_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  apple_health: { icon: "heart", color: "#FF2D55" },
  garmin: { icon: "watch", color: "#007DC3" },
  strava: { icon: "bicycle", color: "#FC4C02" },
};

export default function ConnectedDevicesScreen() {
  const router = useRouter();
  const connectedDevices = useAppStore((s) => s.connectedDevices);
  const toggleDeviceConnection = useAppStore((s) => s.toggleDeviceConnection);

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
          Connect your fitness devices and apps to sync workout data automatically.
        </Text>

        {connectedDevices.map((device) => {
          const config = DEVICE_ICONS[device.type] ?? { icon: "bluetooth", color: colors.textMuted };
          const isStrava = device.type === "strava";

          return (
            <GlassCard key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceRow}>
                <View style={[styles.deviceIcon, { backgroundColor: config.color + "15", borderColor: config.color + "30" }]}>
                  <Ionicons name={config.icon} size={24} color={config.color} />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  {isStrava ? (
                    <Text style={styles.comingSoon}>Coming Soon</Text>
                  ) : device.isConnected ? (
                    <Text style={styles.connected}>Connected</Text>
                  ) : (
                    <Text style={styles.disconnected}>Not Connected</Text>
                  )}
                  {device.lastSync && device.isConnected && (
                    <Text style={styles.lastSync}>
                      Last sync: {new Date(device.lastSync).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  )}
                </View>
                {isStrava ? (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonBadgeText}>SOON</Text>
                  </View>
                ) : device.type === "apple_health" ? (
                  <Switch
                    value={device.isConnected}
                    onValueChange={() => toggleDeviceConnection(device.id)}
                    trackColor={{
                      false: colors.surfaceLight,
                      true: config.color + "60",
                    }}
                    thumbColor={device.isConnected ? config.color : colors.textMuted}
                  />
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.connectBtn,
                      device.isConnected
                        ? { backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }
                        : { backgroundColor: config.color + "15", borderColor: config.color + "30" },
                    ]}
                    onPress={() => toggleDeviceConnection(device.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.connectBtnText,
                        { color: device.isConnected ? "#EF4444" : config.color },
                      ]}
                    >
                      {device.isConnected ? "Disconnect" : "Connect"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          );
        })}

        <GlassCard style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Device integrations require the corresponding app to be installed on your device. 
            Health data sync happens automatically when connected.
          </Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
    gap: 12,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: 8,
  },
  deviceCard: {
    padding: 14,
  },
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
    borderWidth: 1,
  },
  deviceInfo: {
    flex: 1,
    gap: 2,
  },
  deviceName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  connected: {
    color: colors.success,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  disconnected: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  comingSoon: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontStyle: "italic",
  },
  lastSync: {
    color: colors.textMuted,
    fontSize: 10,
  },
  connectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  connectBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  comingSoonBadgeText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 8,
    padding: 14,
  },
  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
});
