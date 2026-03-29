import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";

const { width: W, height: H } = Dimensions.get("window");
const LOGO_SIZE = W * 0.55;

export default function SplashAnimationScreen() {
  const router = useRouter();

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.82)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.6)).current;
  const outerGlowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: fade+scale in → glow pulse → hold → fade out → navigate
    Animated.sequence([
      // 1. Logo appears with scale
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.85,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // 2. Outer glow blooms
      Animated.parallel([
        Animated.timing(outerGlowOpacity, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1.15,
          duration: 600,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
      ]),
      // 3. Breathe pulse
      Animated.parallel([
        Animated.timing(glowScale, {
          toValue: 0.95,
          duration: 700,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(outerGlowOpacity, {
          toValue: 0.25,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      // 4. Hold
      Animated.delay(400),
      // 5. Fade out everything
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(outerGlowOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Navigate to welcome/auth
      router.replace("/auth/welcome" as never);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Outer ambient glow */}
      <Animated.View
        style={[
          styles.outerGlow,
          {
            opacity: outerGlowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />
      {/* Inner core glow */}
      <Animated.View
        style={[
          styles.innerGlow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Image
          source={require("@/assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
    alignItems: "center",
    justifyContent: "center",
  },
  outerGlow: {
    position: "absolute",
    width: LOGO_SIZE * 2.2,
    height: LOGO_SIZE * 2.2,
    borderRadius: LOGO_SIZE * 1.1,
    backgroundColor: "transparent",
    shadowColor: "#FF4500",
    shadowOpacity: 1,
    shadowRadius: 120,
    shadowOffset: { width: 0, height: 0 },
    // Fallback glow for shadow-less contexts:
    // We layer a soft radial using a semi-transparent background
    backgroundColor: "rgba(255, 69, 0, 0.04)",
  },
  innerGlow: {
    position: "absolute",
    width: LOGO_SIZE * 1.3,
    height: LOGO_SIZE * 1.3,
    borderRadius: LOGO_SIZE * 0.65,
    backgroundColor: "rgba(255, 120, 30, 0.18)",
    shadowColor: "#FF6B35",
    shadowOpacity: 1,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 0 },
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
