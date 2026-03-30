import React from "react";
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { IronmanEvent, daysUntil, formatEventDate } from "@/lib/ironmanEvents";

interface Props {
  event: IronmanEvent | null;
  visible: boolean;
  onClose: () => void;
}

export function SelectRaceModal({ event, visible, onClose }: Props) {
  const router = useRouter();
  const { selectRaceEvent, selectedRaceEvent } = useAppStore();

  if (!event) return null;

  const days = daysUntil(event.date);
  const isAlreadySelected = selectedRaceEvent?.id === event.id;
  const hasExistingGoal = !!selectedRaceEvent && !isAlreadySelected;

  const handleSelect = (autoGeneratePlan: boolean) => {
    selectRaceEvent(event, autoGeneratePlan);
    onClose();
    if (autoGeneratePlan) {
      router.push("/prep-plan" as any);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Close */}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Race info */}
              <Text style={styles.flag}>{event.flag}</Text>
              <View style={styles.distBadge}>
                <Text style={styles.distText}>{event.distance === "Full" ? "FULL IRONMAN" : "IRONMAN 70.3"}</Text>
              </View>
              <Text style={styles.raceName}>{event.name}</Text>
              <Text style={styles.location}>
                <Ionicons name="location-outline" size={13} color={colors.textMuted} />{" "}
                {event.location}, {event.country}
              </Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                  <Text style={styles.metaText}>{formatEventDate(event.date)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.primary} />
                  <Text style={styles.metaText}>{days} days away</Text>
                </View>
              </View>

              {/* Warning if replacing existing goal */}
              {hasExistingGoal && (
                <View style={styles.warningBox}>
                  <Ionicons name="warning-outline" size={14} color="#FF9500" />
                  <Text style={styles.warningText}>
                    This will replace your current goal: {selectedRaceEvent!.name}
                  </Text>
                </View>
              )}

              {/* Divider */}
              <View style={styles.divider} />

              <Text style={styles.question}>
                Do you want an auto-generated IRONMAN PREP Plan?
              </Text>
              <Text style={styles.subtitle}>
                We'll build a personalized {days >= 7 ? `${Math.floor(days / 7)}-week` : ""} training plan from today to race day.
              </Text>

              {/* Buttons */}
              <TouchableOpacity style={styles.btnYes} onPress={() => handleSelect(true)}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.btnYesText}>Yes, build my PREP plan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnNo} onPress={() => handleSelect(false)}>
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.btnNoText}>No, I'll plan myself</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface ?? "#16161e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 16,
    borderTopWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  closeBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.lg,
    padding: 4,
  },
  flag: {
    fontSize: 44,
    textAlign: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  distBadge: {
    alignSelf: "center",
    backgroundColor: `${colors.primary}18`,
    borderRadius: borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    marginBottom: spacing.sm,
  },
  distText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  raceName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "rgba(255,149,0,0.10)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255,149,0,0.25)",
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: fontSize.xs,
    color: "#FF9500",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceGlassBorder,
    marginVertical: spacing.lg,
  },
  question: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  btnYes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    marginBottom: spacing.sm,
  },
  btnYesText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: "#fff",
  },
  btnNo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.surfaceGlassBorder,
  },
  btnNoText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
});
