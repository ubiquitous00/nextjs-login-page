'use server';

import { registerNewUser } from "@/app/lib/repositories/elasticsearch/elasticsearch";
import { redirect } from "next/navigation";


export async function register(
  prevState: { success: boolean; message?: string; error?: string } | undefined,
  formData: FormData,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    console.log("Registering user...", formData);
    const username = formData.get("username") as string;
    const password = formData.get("newPassword") as string;

    const response = await registerNewUser({ username: username, plainTextPassword: password });

    if (response) {
      console.log("Registration successful");
      return { success: true, message: "Registration successful. Redirecting" };
    } else {
      console.log("Registration failed: User may already exist");
      return { success: false, error: 'User already exists, please use a different username.' };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: `Unexpected error occurred during registration. ${error}` };
  }
}