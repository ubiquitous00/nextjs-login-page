"use client";

import { ApolloProvider } from "@apollo/client/react";
import { australiaPostClient } from "@/app/lib/apollo/apolloClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={australiaPostClient}>{children}</ApolloProvider>;
}