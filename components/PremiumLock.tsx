import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

interface PremiumLockProps {
  children: React.ReactNode;
  isLocked: boolean;
  message?: string;
}

export function PremiumLock({
  children,
  isLocked,
  message = "Unlock with Premium",
}: PremiumLockProps) {
  const router = useRouter();

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.blurredContent}>{children}</View>
      <View style={styles.overlay}>
        <View style={styles.lockCard}>
          <View style={styles.lockIconWrapper}>
            <Ionicons name="lock-closed" size={28} color="#FFD700" />
          </View>
          <Text style={styles.lockTitle}>{message}</Text>
          <Text style={styles.lockDesc}>
            Upgrade to Iron3 Premium for full access
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            activeOpacity={0.7}
            onPress={() => router.push("/paywall")}
          >
            <Ionicons name="diamond" size={16} color="#000" />
            <Text style={styles.upgradeText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: borderRadius.lg,
  },
  blurredContent: {
    opacity: 0.15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 15, 0.6)",
    borderRadius: borderRadius.lg,
  },
  lockCard: {
    alignItems: "center",
    gap: 10,
    padding: 24,
  },
  lockIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  lockTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  lockDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFD700",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    marginTop: 4,
  },
  upgradeText: {
    color: "#000",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
