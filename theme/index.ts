export const colors = {
  background: "#080810",
  surface: "#0E0E1A",
  surfaceLight: "#161625",
  surfaceGlass: "rgba(255, 255, 255, 0.06)",
  surfaceGlassLight: "rgba(255, 255, 255, 0.09)",
  surfaceGlassBorder: "rgba(255, 255, 255, 0.1)",

  text: "#FFFFFF",
  textSecondary: "#A0A0B8",
  textMuted: "#606078",

  primary: "#8B5CF6",
  primaryLight: "#A78BFA",
  primaryDark: "#7C3AED",

  gradientStart: "#1a0533",
  gradientMid: "#0d1b3e",
  gradientEnd: "#071428",

  glowPurple: "#8B5CF6",
  glowCyan: "#06B6D4",
  glowBlue: "#3B82F6",

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
    Iron: "#9CA3AF",
    Bronze: "#D97706",
    Silver: "#94A3B8",
    Gold: "#F59E0B",
    Platinum: "#818CF8",
    Diamond: "#22D3EE",
    Elite: "#A78BFA",
    Legendary: "#F43F5E",
  },

  rankGlow: {
    Iron: "rgba(156, 163, 175, 0.4)",
    Bronze: "rgba(217, 119, 6, 0.4)",
    Silver: "rgba(148, 163, 184, 0.4)",
    Gold: "rgba(245, 158, 11, 0.5)",
    Platinum: "rgba(129, 140, 248, 0.5)",
    Diamond: "rgba(34, 211, 238, 0.5)",
    Elite: "rgba(167, 139, 250, 0.5)",
    Legendary: "rgba(244, 63, 94, 0.6)",
  },

  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",

  tabBar: "#06060C",
  tabBarBorder: "rgba(139, 92, 246, 0.15)",
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
