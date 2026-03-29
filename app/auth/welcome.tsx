import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "@/theme";
import { signInWithApple, signInWithGoogle } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";

const { width: W, height: H } = Dimensions.get("window");

// Triathlon hero images — cycling through swim/bike/run vibes
// Using a placeholder color gradient as background since we don't have
// a real photo asset; the structure supports swapping in a real photo.
const HERO_SLIDES = [
  { label: "SWIM", color: "#0A1628" },
  { label: "BIKE", color: "#0F0A08" },
  { label: "RUN",  color: "#0A0A0F" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const bgOpacity = useRef(new Animated.Value(1)).current;

  // Check Apple availability
  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => {});
  }, []);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Background slide cycle
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(bgOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleApple = async () => {
    setLoadingApple(true);
    const result = await signInWithApple();
    setLoadingApple(false);
    if (result.success && result.user) {
      setAuth(true, result.user.id);
      await useAppStore.getState().fetchProfile(result.user.id);
    } else if (result.error && result.error !== "cancelled") {
      Alert.alert("Apple Sign In", result.error);
    }
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    const result = await signInWithGoogle();
    setLoadingGoogle(false);
    if (result.success && result.user) {
      setAuth(true, result.user.id);
      await useAppStore.getState().fetchProfile(result.user.id);
    } else if (result.error && result.error !== "cancelled") {
      Alert.alert("Google Sign In", result.error);
    }
  };

  const slide = HERO_SLIDES[slideIdx];

  return (
    <View style={styles.container}>
      {/* ── Hero Background ── */}
      <Animated.View style={[styles.heroBg, { opacity: bgOpacity }]}>
        <LinearGradient
          colors={[slide.color, "#1A0A05", "#0A0A0F"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        {/* Athlete silhouette overlay — subtle texture */}
        <View style={styles.heroAthleteOverlay} />
      </Animated.View>

      {/* ── Dark gradient bottom overlay (for text legibility) ── */}
      <LinearGradient
        colors={["transparent", "rgba(10,10,15,0.6)", "rgba(10,10,15,0.97)"]}
        locations={[0.25, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ── Discipline indicator dots ── */}
      <View style={styles.dots}>
        {HERO_SLIDES.map((s, i) => (
          <View
            key={i}
            style={[styles.dot, i === slideIdx && styles.dotActive]}
          />
        ))}
      </View>

      {/* ── Bottom content ── */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideUp }] },
        ]}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <Image
            source={require("@/assets/icon.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>IRON3</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>TRAIN LIKE{"\n"}A CHAMPION</Text>
        <Text style={styles.sub}>
          Track swim, bike & run. Earn your rank.{"\n"}Compete with the best.
        </Text>

        {/* ── Auth buttons ── */}
        <View style={styles.authButtons}>
          {/* Apple Sign In */}
          {appleAvailable && (
            <TouchableOpacity
              style={styles.appleBtn}
              onPress={handleApple}
              activeOpacity={0.85}
              disabled={loadingApple || loadingGoogle}
            >
              {loadingApple ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color="#fff" />
                  <Text style={styles.appleBtnText}>Continue with Apple</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Google Sign In */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogle}
            activeOpacity={0.85}
            disabled={loadingApple || loadingGoogle}
          >
            {loadingGoogle ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="logo-google" size={18} color="#fff" />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Email fallback */}
          <TouchableOpacity
            style={styles.emailBtn}
            onPress={() => router.push("/auth/login" as never)}
            activeOpacity={0.7}
          >
            <Text style={styles.emailBtnText}>Sign in with email</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <Text style={styles.legal}>
          By continuing you agree to our{" "}
          <Text style={styles.legalLink}>Terms of Service</Text>
          {" "}and{" "}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
  },
  heroAthleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // Decorative triathlon grid lines — gives a sporty data-viz feel
    height: H * 0.65,
    opacity: 0.04,
    backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    borderBottomColor: "#FF6B35",
  },
  dots: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 18,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 48,
    gap: 0,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  brandLogo: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontSize: 13,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    letterSpacing: 4,
  },
  headline: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  sub: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 20,
    marginBottom: 32,
  },
  authButtons: {
    gap: 12,
    marginBottom: 20,
  },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#000000",
    borderRadius: 14,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  appleBtnText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.2,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  googleBtnText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.2,
  },
  emailBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  emailBtnText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  legal: {
    fontSize: 11,
    color: "rgba(255,255,255,0.28)",
    textAlign: "center",
    lineHeight: 17,
  },
  legalLink: {
    color: "rgba(255,255,255,0.45)",
    textDecorationLine: "underline",
  },
});
