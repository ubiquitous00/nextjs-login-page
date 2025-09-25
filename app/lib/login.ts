'use client';

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const callbackUrl = formData.get("redirectTo")?.toString() || '/home';
    await signIn("credentials", {redirect: true, callbackUrl: callbackUrl, ...Object.fromEntries(formData)});
  } catch (error) {
    console.error("Authentication error:", error);
    return 'Authentication failed. Please try again.';
  }
}

export async function logout() {
  await signOut({ redirect: true, callbackUrl: '/' });
}