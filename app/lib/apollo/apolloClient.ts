'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const australiaPostClient = new ApolloClient({
  link: new HttpLink({ uri: '/api/verify' }),
  cache: new InMemoryCache(),
});

export default australiaPostClient;