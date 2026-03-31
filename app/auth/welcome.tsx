import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
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

const SLIDES = [
  {
    image: require("@/assets/hero-swim.png"),
    label: "SWIM",
  },
  {
    image: require("@/assets/hero-bike.png"),
    label: "BIKE",
  },
  {
    image: require("@/assets/hero-run.png"),
    label: "RUN",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);

  // Fade values for cross-dissolve between slides
  const currentFade = useRef(new Animated.Value(1)).current;
  const nextFade    = useRef(new Animated.Value(0)).current;

  // Entrance animation
  const contentY    = useRef(new Animated.Value(30)).current;
  const contentOp   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => {});
  }, []);

  // Entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Background cross-dissolve cycle
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (slideIdx + 1) % SLIDES.length;
      setNextIdx(next);
      nextFade.setValue(0);

      Animated.sequence([
        Animated.timing(nextFade, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start(() => {
        currentFade.setValue(1);
        nextFade.setValue(0);
        setSlideIdx(next);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [slideIdx]);

  const handleApple = async () => {
    setLoadingApple(true);
    const result = await signInWithApple();
    setLoadingApple(false);
    if (result.success && result.user) {
      setAuth(true, result.user.id);
      await useAppStore.getState().hydrateUserData(result.user.id);
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
      await useAppStore.getState().hydrateUserData(result.user.id);
    } else if (result.error && result.error !== "cancelled") {
      Alert.alert("Google Sign In", result.error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Hero photo background — current slide ── */}
      <Animated.Image
        source={SLIDES[slideIdx].image}
        style={[styles.heroBg, { opacity: currentFade }]}
        resizeMode="cover"
      />
      {/* ── Hero photo background — next slide (fading in) ── */}
      <Animated.Image
        source={SLIDES[nextIdx].image}
        style={[styles.heroBg, { opacity: nextFade }]}
        resizeMode="cover"
      />

      {/* ── Dark gradient — heavy at bottom for text, subtle at top ── */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.15)",
          "rgba(0,0,0,0.05)",
          "rgba(0,0,0,0.35)",
          "rgba(10,10,15,0.88)",
          "rgba(10,10,15,0.98)",
        ]}
        locations={[0, 0.2, 0.45, 0.7, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ── Slide indicator dots ── */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === slideIdx && styles.dotActive]} />
        ))}
      </View>

      {/* ── Bottom content ── */}
      <Animated.View
        style={[
          styles.content,
          { opacity: contentOp, transform: [{ translateY: contentY }] },
        ]}
      >
        {/* Brand row */}
        <View style={styles.brand}>
          <Image
            source={require("@/assets/logo-transparent.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>IRON3</Text>
        </View>

        {/* Headline — bold italic condensed like screenshot */}
        <Text style={styles.headline}>{"TRAIN LIKE\nA CHAMPION"}</Text>

        {/* Subtext */}
        <Text style={styles.sub}>
          {"Track swim, bike & run. Earn your rank.\nCompete with the best."}
        </Text>

        {/* ── Auth buttons ── */}
        <View style={styles.authButtons}>
          {/* Apple */}
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
                  <Ionicons name="logo-apple" size={21} color="#fff" />
                  <Text style={styles.btnText}>Continue with Apple</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Google */}
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
                {/* Google "G" icon as text since Ionicons doesn't have official G */}
                <Text style={styles.gIcon}>G</Text>
                <Text style={styles.btnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Email */}
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
          {"By continuing you agree to our "}
          <Text style={styles.legalLink}>Terms of Service</Text>
          {" and "}
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
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: H,
  },
  dots: {
    position: "absolute",
    top: 56,
    alignSelf: "center",
    flexDirection: "row",
    gap: 7,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 22,
    borderRadius: 3,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 44,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  brandLogo: {
    width: 30,
    height: 30,
  },
  brandName: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 4,
  },
  // Bold italic heavy condensed — matching screenshot style
  headline: {
    fontSize: 52,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#FFFFFF",
    lineHeight: 54,
    letterSpacing: -1,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  sub: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 21,
    marginBottom: 30,
  },
  authButtons: {
    gap: 12,
    marginBottom: 18,
  },
  // Apple — pure black
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#000000",
    borderRadius: 14,
    height: 58,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  // Google — dark glass
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  gIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
  },
  // Email — plain text link, same level as screenshot
  emailBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  emailBtnText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontWeight: "500",
  },
  legal: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    lineHeight: 17,
  },
  legalLink: {
    color: "rgba(255,255,255,0.45)",
    textDecorationLine: "underline",
  },
});
