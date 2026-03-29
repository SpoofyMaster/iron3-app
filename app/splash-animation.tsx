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

const { width: W } = Dimensions.get("window");
const LOGO_SIZE = W * 0.45;

export default function SplashAnimationScreen() {
  const router = useRouter();

  const opacity      = useRef(new Animated.Value(0)).current;
  const scale        = useRef(new Animated.Value(0.7)).current;
  const glowOpacity  = useRef(new Animated.Value(0)).current;
  const glowScale    = useRef(new Animated.Value(0.5)).current;
  const exitOpacity  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Very fast appearance — logo bursts in (like Kotcha bird flash)
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.08,
          tension: 180,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1.2,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // 2. Settle back to normal scale
      Animated.spring(scale, {
        toValue: 1,
        tension: 120,
        friction: 10,
        useNativeDriver: true,
      }),
      // 3. Brief hold — let the glow breathe
      Animated.delay(350),
      // 4. Quick fade out everything
      Animated.parallel([
        Animated.timing(exitOpacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      router.replace("/auth/welcome" as never);
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: exitOpacity }]}>
      {/* Outer ambient glow ring */}
      <Animated.View
        style={[
          styles.outerGlow,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      {/* Inner hot glow */}
      <Animated.View
        style={[
          styles.innerGlow,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      {/* Logo */}
      <Animated.Image
        source={require("@/assets/icon.png")}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
        resizeMode="contain"
      />
    </Animated.View>
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
    width: LOGO_SIZE * 2.4,
    height: LOGO_SIZE * 2.4,
    borderRadius: LOGO_SIZE * 1.2,
    backgroundColor: "rgba(255, 80, 10, 0.07)",
    shadowColor: "#FF4500",
    shadowOpacity: 1,
    shadowRadius: 100,
    shadowOffset: { width: 0, height: 0 },
  },
  innerGlow: {
    position: "absolute",
    width: LOGO_SIZE * 1.4,
    height: LOGO_SIZE * 1.4,
    borderRadius: LOGO_SIZE * 0.7,
    backgroundColor: "rgba(255, 110, 30, 0.22)",
    shadowColor: "#FF6B35",
    shadowOpacity: 1,
    shadowRadius: 55,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
