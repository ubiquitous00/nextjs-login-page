import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY
const userIndex = process.env.USER_INDEX

export const authOptions = {
  providers: [CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${elasticsearchEndpoint}/${userIndex}/_doc/${credentials.username}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${elasticsearchApiKey}` },
        });

        const result = await response.json();

        if (result.found == true && bcrypt.compareSync(credentials.password, result._source?.encryptedPassword)) {
          return { name: credentials.username, id: credentials.username };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  session: {
    maxAge: 10 * 60,
  },
  jwt: {
    maxAge: 10 * 60,
  }
}

export const authConfig = NextAuth(authOptions)