export const colors = {
  background: "#0A0A0F",
  surface: "#12121A",
  surfaceLight: "#1A1A25",
  surfaceGlass: "rgba(255, 255, 255, 0.05)",
  surfaceGlassLight: "rgba(255, 255, 255, 0.08)",
  surfaceGlassBorder: "rgba(255, 255, 255, 0.1)",

  text: "#FFFFFF",
  textSecondary: "#A0A0B0",
  textMuted: "#606070",

  primary: "#6366F1",
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",

  swim: "#06B6D4",
  swimLight: "#22D3EE",
  swimDark: "#0891B2",
  swimGradient: ["#06B6D4", "#0891B2"] as const,

  bike: "#F59E0B",
  bikeLight: "#FBBF24",
  bikeDark: "#D97706",
  bikeGradient: ["#F59E0B", "#D97706"] as const,

  run: "#10B981",
  runLight: "#34D399",
  runDark: "#059669",
  runGradient: ["#10B981", "#059669"] as const,

  brick: "#F97316",
  brickLight: "#FB923C",
  brickDark: "#EA580C",

  strength: "#A855F7",
  strengthLight: "#C084FC",
  strengthDark: "#9333EA",

  rank: {
    Iron: "#8B8B8B",
    Bronze: "#CD7F32",
    Silver: "#C0C0C0",
    Gold: "#FFD700",
    Platinum: "#B0C4DE",
    Diamond: "#B9F2FF",
    Elite: "#E5E4E2",
    Legendary: "#FF4500",
  },

  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",

  tabBar: "#0D0D14",
  tabBarBorder: "rgba(255, 255, 255, 0.06)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const disciplineColors = {
  swim: { main: colors.swim, light: colors.swimLight, dark: colors.swimDark },
  bike: { main: colors.bike, light: colors.bikeLight, dark: colors.bikeDark },
  run: { main: colors.run, light: colors.runLight, dark: colors.runDark },
} as const;

export const workoutDisciplineColors: Record<string, { main: string; light: string; dark: string }> = {
  swim: { main: colors.swim, light: colors.swimLight, dark: colors.swimDark },
  bike: { main: colors.bike, light: colors.bikeLight, dark: colors.bikeDark },
  run: { main: colors.run, light: colors.runLight, dark: colors.runDark },
  brick: { main: colors.brick, light: colors.brickLight, dark: colors.brickDark },
  strength: { main: colors.strength, light: colors.strengthLight, dark: colors.strengthDark },
} as const;

export const disciplineIcons = {
  swim: "water" as const,
  bike: "bicycle" as const,
  run: "walk" as const,
} as const;

export const disciplineLabels = {
  swim: "Swim",
  bike: "Bike",
  run: "Run",
} as const;
