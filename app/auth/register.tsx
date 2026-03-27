import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard } from "@/components";
import { colors, spacing, fontSize } from "@/theme";
import { signUp } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";

export default function RegisterScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);

    if (!result.success) {
      Alert.alert("Sign up failed", result.error ?? "Unknown error");
      return;
    }

    if (result.user) {
      setAuth(true, result.user.id);
    } else {
      Alert.alert(
        "Check your email",
        "We sent a confirmation link. Please verify your email to continue."
      );
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={["#0a0a1a", "#1a0a2e", "#0d1b3e"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>⚡ Iron3</Text>
            <Text style={styles.subtitle}>Join the Ranks</Text>
          </View>

          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your athlete name"
                placeholderTextColor="rgba(255,255,255,0.3)"
                autoCapitalize="words"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Min 6 characters"
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </GlassCard>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.switchText}>
              Already have an account?{" "}
              <Text style={styles.switchLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 40,
  },
  header: { alignItems: "center", marginBottom: 32 },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginTop: 4,
    fontWeight: "600",
    letterSpacing: 1,
  },
  card: { paddingHorizontal: 20, paddingVertical: 28 },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fontSize.md,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  switchText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 24,
    fontSize: fontSize.sm,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});
