'use server';

import { registerNewUser } from "@/app/lib/repositories/elasticsearch/elasticsearch";


export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log("Registering user...", formData);
    const username = formData.get("username") as string;
    const password = formData.get("newPassword") as string;

    const response = await registerNewUser({ username: username, plainTextPassword: password });

    if (response) {
      console.log("Registration successful");
      return 
    } else {
      console.log("Registration failed: User may already exist");
      return 'User already exists, please use a different username.';
    }
  } catch (error) {
    console.error("Registration error:", error);
    return `Unexpected error occurred during registration. ${error}`;
  }
}