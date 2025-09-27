"use client";

import { gql, useQuery } from "@apollo/client";
import { australiaPostClient } from "@/app/lib/apollo/apolloClient";

const VERIFY_POSTCODE = gql`
  query SearchPostcode($q: String!, $state: String) {
    searchPostcode(q: $q, state: $state) {
      id
      location
      postcode
      state
      latitude
      longitude
    }
  }
`;

