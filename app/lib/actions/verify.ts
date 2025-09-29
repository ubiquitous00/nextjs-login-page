'use server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth.config"
import { registerVerificationAttempt } from "@/app/lib/repositories/elasticsearch/elasticsearch";

export async function logVerificationAttempt(
  inputData: { postcode: string, suburb: string, state: string },
  isVerified: boolean,
  errorMessage: string | null
) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name

  if (!username) {
    return false;
  }
  const timestamp = new Date();

  return registerVerificationAttempt(
    username,
    inputData,
    timestamp,
    isVerified,
    errorMessage
  )

}