'use client';

import { signIn, signOut } from "next-auth/react";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const callbackUrl = formData.get("redirectTo")?.toString() || '/home';
    const result = await signIn("credentials", {redirect: false, ...Object.fromEntries(formData)});

    if (result?.status !== 200) {
      return 'Authentication failed. Please try again.';
    }
    
    window.location.href = callbackUrl;
    return;
  } catch (error) {
    console.error("Authentication error:", error);
    return 'Authentication failed. Please try again.';
  }
}

export async function logout() {
  await signOut({ redirect: true, callbackUrl: '/login' });
}