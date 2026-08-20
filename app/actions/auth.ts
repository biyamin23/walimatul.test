"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
  type AuthFormState,
} from "@/lib/validation/auth";
import { getSafeRedirectUrl, getDefaultRedirect } from "@/lib/auth/redirects";
import { getAuthenticatedUser } from "@/lib/auth/get-user";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER WITH EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export async function signUpWithEmail(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = registerSchema.safeParse(raw);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { fullName, email, password } = result.data;
  const supabase = await createClient();

  const nextParam = formData.get("next") as string | null;
  const safeNext = getSafeRedirectUrl(nextParam, "/dashboard");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "This email is already registered. Try signing in." };
    }
    return { error: "We couldn't create your account. Please try again." };
  }

  // If email confirmation is required, the user won't have a session yet.
  if (data.session === null) {
    return {
      success:
        "Check your email to confirm your WALIMATUL account, then sign in.",
    };
  }

  // Email confirmation disabled — session created immediately.
  redirect(safeNext);
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGN IN WITH EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export async function signInWithEmail(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const nextParam = formData.get("next") as string | null;

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { email, password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (
      error.message.toLowerCase().includes("invalid") ||
      error.message.toLowerCase().includes("credentials")
    ) {
      return { error: "Incorrect email or password." };
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Please confirm your email address before signing in. Check your inbox.",
      };
    }
    return { error: "We couldn't sign you in. Please try again." };
  }

  // Fetch profile to determine role-based redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .single();

  const role = profile?.role ?? "client";
  const safeNext = getSafeRedirectUrl(nextParam);
  const destination =
    safeNext !== "/dashboard" ? safeNext : getDefaultRedirect(role);

  redirect(destination);
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGN IN WITH GOOGLE
// ─────────────────────────────────────────────────────────────────────────────
export async function signInWithGoogle(next?: string): Promise<void> {
  const supabase = await createClient();

  const safeNext = getSafeRedirectUrl(next, "/dashboard");
  const callbackUrl = `${SITE_URL}/auth/callback?next=${encodeURIComponent(safeNext)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error || !data.url) {
    throw new Error("We couldn't start Google sign-in. Please try again.");
  }

  redirect(data.url);
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPasswordReset(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = { email: formData.get("email") as string };
  const result = forgotPasswordSchema.safeParse(raw);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { email } = result.data;
  const supabase = await createClient();

  // Always return the same privacy-safe response — never reveal account existence.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`,
  });

  return {
    success:
      "If an account exists for this email, password reset instructions have been sent.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
export async function resetPassword(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = resetPasswordSchema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      error:
        "We couldn't update your password. The link may have expired — request a new one.",
    };
  }

  return {
    success: "Your password has been updated. You can now sign in.",
    redirectTo: "/login",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export async function updateProfile(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
  };

  const result = profileUpdateSchema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const supabase = await createClient();

  // SECURITY: Only update permitted fields. Never touch 'role'.
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: result.data.fullName,
      phone: result.data.phone ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.userId);

  if (error) {
    return { error: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/dashboard/profile");
  return { success: "Profile updated successfully." };
}
