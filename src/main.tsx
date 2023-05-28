import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ChakraProvider } from "@chakra-ui/react";

import { createStandaloneToast } from "@chakra-ui/react";

const { ToastContainer, toast } = createStandaloneToast();

const httpLink = new HttpLink({ uri: "http://localhost:3000/graphql" });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      if (Array.isArray(err.message)) {
        err.message.forEach((msg: any) =>
          toast({
            status: "error",
            description: msg,
            isClosable: true,
            duration: null,
            position: "top-right",
          })
        );
      } else {
        toast({
          status: "error",
          description: err.message,
          isClosable: true,
          duration: null,
          position: "top-right",
        });
      }
    });
  }

  if (networkError)
    toast({
      status: "error",
      title: networkError.message,
      description: networkError.stack,
      isClosable: true,
      duration: null,
      position: "top-right",
    });
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({ addTypename: false }),
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChakraProvider>
        <App />
        <ToastContainer />
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode>
);
