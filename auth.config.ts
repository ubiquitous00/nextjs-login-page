import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY

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

        const response = await fetch(`${elasticsearchEndpoint}/users/_search`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${elasticsearchApiKey}` },
          body: JSON.stringify({
            query: { match: { username: credentials.username } },
          })
        });

        const result = await response.json();

        const user = result.hits.hits[0]?._source;


        if (user && bcrypt.compareSync(credentials.password, user.encryptedPassword)) {
          return user
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
}

export const authConfig = NextAuth(authOptions)