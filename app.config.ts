import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Iron3",
  slug: "iron3",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "iron3",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.png",
    backgroundColor: "#0A0A0F",
    resizeMode: "contain",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.iron3.app",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#0A0A0F",
    },
    package: "com.iron3.app",
  },
  web: {
    bundler: "metro",
    output: "static",
  },
  plugins: ["expo-router", "expo-font"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
});
