import { supabase } from "./supabase";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// ============================================================
// AUTH SERVICE — Iron3
// ============================================================

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName ?? email.split("@")[0] },
    },
  });
  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user ?? undefined };
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user ?? undefined };
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "iron3://auth/reset-password",
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user ?? undefined };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

// ============================================================
// Apple Sign In — native flow via expo-apple-authentication
// ============================================================

export async function signInWithApple(): Promise<AuthResult> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { success: false, error: "No identity token returned from Apple." };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user ?? undefined };
  } catch (e: any) {
    if (e?.code === "ERR_REQUEST_CANCELED") {
      return { success: false, error: "cancelled" };
    }
    return { success: false, error: e?.message ?? "Apple sign-in failed." };
  }
}

// ============================================================
// Google Sign In — OAuth via Supabase + expo-web-browser
// ============================================================

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const redirectUri = AuthSession.makeRedirectUri({ scheme: "iron3", path: "auth/callback" });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      return { success: false, error: error?.message ?? "Could not get Google auth URL." };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== "success") {
      return { success: false, error: "cancelled" };
    }

    // Extract tokens from the redirect URL hash/query
    const url = result.url;
    const params = new URLSearchParams(url.includes("#") ? url.split("#")[1] : url.split("?")[1]);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? "",
      });
      if (sessionError) return { success: false, error: sessionError.message };
      return { success: true, user: sessionData.user ?? undefined };
    }

    return { success: false, error: "Could not extract session from Google redirect." };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Google sign-in failed." };
  }
}
