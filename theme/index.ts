// Iron3 Theme — Matches the landing page (iron3-landing/index.html)
// Primary accent: #FF4500 (orange-red)
// Swim: #00B4D8 | Bike: #80ED99 | Run: #FFB347

export const colors = {
  background: "#0A0A0F",
  surface: "#0E0E1A",
  surfaceLight: "#161620",
  surfaceGlass: "rgba(255, 255, 255, 0.04)",
  surfaceGlassLight: "rgba(255, 255, 255, 0.06)",
  surfaceGlassBorder: "rgba(255, 255, 255, 0.08)",

  text: "#F5F5F7",
  textSecondary: "rgba(255, 255, 255, 0.55)",
  textMuted: "rgba(255, 255, 255, 0.3)",

  // Primary accent — orange-red from landing page
  primary: "#FF4500",
  primaryLight: "#FF6B35",
  primaryDark: "#CC3700",

  // Gradient orbs (from landing page)
  gradientStart: "#FF4500",
  gradientMid: "#00B4D8",
  gradientEnd: "#FFB347",

  glowOrange: "#FF4500",
  glowCyan: "#00B4D8",
  glowGreen: "#80ED99",
  // Aliases for backward compatibility
  glowPurple: "#FF4500",
  glowBlue: "#00B4D8",

  // Disciplines — exact landing page colors
  swim: "#00B4D8",
  swimLight: "#22D3EE",
  swimDark: "#0891B2",
  swimGradient: ["#00B4D8", "#0891B2"] as const,

  bike: "#80ED99",
  bikeLight: "#A7F3D0",
  bikeDark: "#34D399",
  bikeGradient: ["#80ED99", "#34D399"] as const,

  run: "#FFB347",
  runLight: "#FCD34D",
  runDark: "#F59E0B",
  runGradient: ["#FFB347", "#F59E0B"] as const,

  brick: "#FF6B35",
  brickLight: "#FF8C5A",
  brickDark: "#FF4500",

  strength: "#80ED99",
  strengthLight: "#A7F3D0",
  strengthDark: "#34D399",

  // Rank colors — from landing page
  rank: {
    Iron: "#8B8B8B",
    Bronze: "#CD7F32",
    Silver: "#C0C0C0",
    Gold: "#FFD700",
    Platinum: "#E5E4E2",
    Diamond: "#00B4D8",
    Elite: "#80ED99",
    Legendary: "#FF4500",
  },

  rankGlow: {
    Iron: "rgba(139, 139, 139, 0.3)",
    Bronze: "rgba(205, 127, 50, 0.4)",
    Silver: "rgba(192, 192, 192, 0.3)",
    Gold: "rgba(255, 215, 0, 0.4)",
    Platinum: "rgba(229, 228, 226, 0.3)",
    Diamond: "rgba(0, 180, 216, 0.5)",
    Elite: "rgba(128, 237, 153, 0.4)",
    Legendary: "rgba(255, 69, 0, 0.6)",
  },

  error: "#EF4444",
  success: "#80ED99",
  warning: "#FFB347",

  tabBar: "#06060C",
  tabBarBorder: "rgba(255, 69, 0, 0.15)",
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
