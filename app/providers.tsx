"use client";

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const australiaPostClient = new ApolloClient({
  link: new HttpLink({ uri: '/api/verify' }),
  cache: new InMemoryCache(),
});

export function AusPostClientProviders({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={australiaPostClient}>{children}</ApolloProvider>;
}

export function GlobalLayoutProviders({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}