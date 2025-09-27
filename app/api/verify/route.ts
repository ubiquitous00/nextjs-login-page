import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type Locality {
    id: ID!
    category: String
    location: String
    postcode: String
    state: String
    latitude: Float
    longitude: Float
  }

  type Query {
    searchPostcode(q: String!, state: String!): [Locality]
  }
`;

const resolvers = {
  Query: {
    searchPostcode: async (_: any, { q, state }: { q: string; state: string }) => {
      const url = new URL(
        "https://gavg8gilmf.execute-api.ap-southeast-2.amazonaws.com/staging/postcode/search.json"
      );
      url.searchParams.append("q", q);
      if (state) url.searchParams.append("state", state);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.AUS_POST_BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from AusPost API: ${response.status}`);
      }

      const data = await response.json();
      return data.localities.locality;
    },
  },
};

// ✅ Persist server instance across calls
let server: ApolloServer | null = null;
let handler: ReturnType<typeof startServerAndCreateNextHandler> | null = null;

function getApolloHandler() {
  if (!server) {
    server = new ApolloServer({ typeDefs, resolvers });
    handler = startServerAndCreateNextHandler(server);
  }
  return handler!;
}

export const GET = async (req: Request) => getApolloHandler()(req);
export const POST = async (req: Request) => getApolloHandler()(req);