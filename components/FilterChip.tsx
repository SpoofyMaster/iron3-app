import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, fontSize, fontWeight, borderRadius } from "@/theme";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor?: string;
}

export function FilterChip({
  label,
  isActive,
  onPress,
  activeColor = colors.primary,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isActive && {
          backgroundColor: activeColor + "18",
          borderColor: activeColor,
          shadowColor: activeColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 3,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          isActive && { color: activeColor, fontWeight: fontWeight.bold },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.surfaceGlassBorder,
    backgroundColor: colors.surfaceGlass,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
