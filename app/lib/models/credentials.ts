import { email, object, string } from "zod"
 
export const signInSchema = object({
  username: string()
    .min(1, "Username or Email is required"),
  password: string()
    .min(1, "Password is required")
    .min(12, "Password must be more than 12 characters")
    .max(64, "Password must be less than 64 characters"),
})

export const userSchema = object({
  username: string()
    .min(1, "Username is required"),
  encryptedPassword: string(),
});

export type User = typeof userSchema;