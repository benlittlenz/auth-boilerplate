import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { getAccessToken } from "./accessToken";
import { App } from "./App";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  request: (operation) => {
    const accessToken = getAccessToken()
    operation.setContext({
      headers: {
        authorization: accessToken ? `bearer ${accessToken}` : ""
      }
    })
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root"),
);
