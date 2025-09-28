import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 500;

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
    searchPostcode(postcode: String, suburb: String, state: String): [Locality]
  }
`;

const resolvers = {
  Query: {
    searchPostcode: async (_: any, { postcode, suburb, state }: { postcode: string; suburb: string; state: string }) => {
      try {
        console.log("Received query with:", { postcode, suburb, state });

        var postcodeData, suburbData;

        if (postcode) {
          const postcodeUrl = new URL(`${process.env.AUS_POST_REST_ENDPOINT}`);
          postcodeUrl.searchParams.append("q", postcode);
          if (state) postcodeUrl.searchParams.append("state", state);

          postcodeData = await fetchWithRetry(postcodeUrl.toString(), {
            Authorization: `Bearer ${process.env.AUS_POST_BEARER_TOKEN}`,
          });
        }

        if (suburb) {
          const suburbUrl = new URL(`${process.env.AUS_POST_REST_ENDPOINT}`);
          suburbUrl.searchParams.append("q", suburb);
          if (state) suburbUrl.searchParams.append("state", state);

          suburbData = await fetchWithRetry(suburbUrl.toString(), {
            Authorization: `Bearer ${process.env.AUS_POST_BEARER_TOKEN}`,
          });
        }

        const postcodeLocalities = normalizeLocality(postcodeData.localities?.locality);
        const suburbLocalities = normalizeLocality(suburbData.localities?.locality);
        const data = [...postcodeLocalities, ...suburbLocalities];
        console.log("Route successfully completed");
        return data;
      } catch (error) {
        console.log("Error in searchPostcode resolver:", error);
        throw new Error("Failed to fetch postcode data");
      }
    },
  },
};

function normalizeLocality(locality: any) {
  if (!locality) return [];
  return Array.isArray(locality) ? locality : [locality];
}

async function fetchWithRetry(url: string, headers: any) {
  let delay = INITIAL_DELAY_MS;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch from AusPost API: ${response.status}`);
      }

      const text = await response.text();
      if (text) {
        return JSON.parse(text);
      }

      // If body is empty, throw to retry
      throw new Error("Empty response body");
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      console.log(`Retry ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));

      delay *= 2;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };