'use client';

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log("Authenticating with formData:", Array.from(formData.entries()));
    await signIn("credentials", {...Object.fromEntries(formData)});
  } catch (error) {
    console.error("Authentication error:", error);
    return 'Authentication failed. Please try again.';
  }
}

export async function logout() {
  await signOut({ redirect: true, callbackUrl: '/' });
}