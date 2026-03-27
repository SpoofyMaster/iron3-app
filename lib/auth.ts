import { supabase } from "./supabase";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

// ============================================================
// AUTH SERVICE — Iron3
// ============================================================

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

/**
 * Sign up with email + password.
 * Optionally pass displayName to embed in user_metadata
 * (the DB trigger `handle_new_user` reads it from raw_user_meta_data).
 */
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

/**
 * Sign in with email + password.
 */
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

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Send a password-reset email.
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "iron3://auth/reset-password",
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Update the user's password (for use after clicking the reset link).
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user ?? undefined };
}

/**
 * Get the currently-authenticated user (or null).
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session (or null).
 */
export async function getSession(): Promise<Session | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Subscribe to auth-state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

// ============================================================
// OAuth stubs (Google / Apple) — structure only
// Native config (Info.plist, google-services.json) needed later.
// ============================================================

export async function signInWithGoogle(): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: "iron3://auth/callback" },
  });
  if (error) return { success: false, error: error.message };
  // In a real native app you'd open data.url in an in-app browser
  return { success: true };
}

export async function signInWithApple(): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: "iron3://auth/callback" },
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
