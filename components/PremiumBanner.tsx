import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

export function PremiumBanner() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => router.push("/paywall")}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="diamond" size={24} color="#FFD700" />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title}>Unlock Full Iron3</Text>
          <Text style={styles.subtitle}>
            All discipline ranks, leaderboards & more
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 215, 0, 0.06)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.15)",
    padding: 14,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: "#FFD700",
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
});
