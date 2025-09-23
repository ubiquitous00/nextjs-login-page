import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from 'zod';

export const authOptions = {
  providers: [CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace this with your own logic to validate credentials
        if (
          credentials?.username === "admin" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)