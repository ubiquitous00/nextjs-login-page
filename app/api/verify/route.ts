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
    searchPostcode(postcode: String, suburb: String, state: String!): [Locality]
  }
`;

const resolvers = {
  Query: {
    searchPostcode: async (_: any, { postcode, suburb, state }: { postcode: string; suburb: string; state: string }) => {
      const url = new URL(
        `${process.env.AUS_POST_REST_ENDPOINT}`
      );
      if (postcode) {
        url.searchParams.append("q", postcode);
      } else if (suburb) {
        url.searchParams.append("q", suburb);
      }
      if (state) url.searchParams.append("state", state);
      console.log("Fetching from AusPost API:", url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.AUS_POST_BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from AusPost API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      console.log("Localities:", data.localities.locality);
      return data.localities.locality;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };