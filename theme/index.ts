// Iron3 Theme — Ironman Atmosphere
// Inspired by: ironman.com + iron3-landing/index.html
// Key: dark charcoal base, orange-red fire accent, cyan swim, green bike, amber run

export const colors = {
  background: "#0A0A0F",
  surface: "#0F0F14",
  surfaceLight: "#18181F",
  surfaceGlass: "rgba(255, 255, 255, 0.04)",
  surfaceGlassLight: "rgba(255, 255, 255, 0.07)",
  surfaceGlassBorder: "rgba(255, 255, 255, 0.08)",

  text: "#F5F5F7",
  textSecondary: "rgba(255, 255, 255, 0.55)",
  textMuted: "rgba(255, 255, 255, 0.3)",

  // Primary: Ironman fire orange-red
  primary: "#FF4500",
  primaryLight: "#FF6B35",
  primaryDark: "#CC3700",

  // Accent for gradient hero text (green → gold like landing page RANK)
  accent: "#80ED99",
  accentGold: "#FFD700",

  // Gradient backgrounds
  gradientStart: "#0A0A0F",
  gradientMid: "#1A0A05",
  gradientEnd: "#0A0A0F",

  // Glow effects
  glowOrange: "rgba(255, 69, 0, 0.5)",
  glowCyan: "rgba(0, 180, 216, 0.5)",
  glowGreen: "rgba(128, 237, 153, 0.4)",
  glowGold: "rgba(255, 215, 0, 0.4)",

  // Backward compat aliases
  glowPurple: "rgba(255, 69, 0, 0.5)",
  glowBlue: "rgba(0, 180, 216, 0.5)",

  // Disciplines — matching landing page exactly
  swim: "#00B4D8",
  swimLight: "#38C7E8",
  swimDark: "#0091B0",
  swimGradient: ["#00B4D8", "#0091B0"] as const,

  bike: "#80ED99",
  bikeLight: "#A7F3C0",
  bikeDark: "#4DD87A",
  bikeGradient: ["#80ED99", "#4DD87A"] as const,

  run: "#FFB347",
  runLight: "#FFCC80",
  runDark: "#FF8C00",
  runGradient: ["#FFB347", "#FF8C00"] as const,

  brick: "#FF6B35",
  brickLight: "#FF8C5A",
  brickDark: "#FF4500",

  strength: "#80ED99",
  strengthLight: "#A7F3C0",
  strengthDark: "#4DD87A",

  // Rank tiers — Ironman prestige palette
  rank: {
    Iron: "#4B5563",
    Bronze: "#CD7F32",
    Silver: "#C0C0C0",
    Gold: "#FFD700",
    Platinum: "#E5E4E2",
    Diamond: "#00B4D8",
  },

  rankGlow: {
    Iron: "rgba(75, 85, 99, 0.35)",
    Bronze: "rgba(205, 127, 50, 0.35)",
    Silver: "rgba(192, 192, 192, 0.25)",
    Gold: "rgba(255, 215, 0, 0.45)",
    Platinum: "rgba(229, 228, 226, 0.3)",
    Diamond: "rgba(0, 180, 216, 0.5)",
  },

  error: "#EF4444",
  success: "#80ED99",
  warning: "#FFB347",

  tabBar: "#080810",
  tabBarBorder: "rgba(255, 69, 0, 0.2)",
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
