import { ApolloLink, Observable } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  // uri: "http://localhost:4003/graphql",
  uri: "https://socialevent-platform-snhu.onrender.com/graphql", 
  credentials: "include",
});

const refreshAccessToken = async (): Promise<boolean> => {
  const response = await fetch(
    "https://socialevent-platform-snhu.onrender.com/graphql",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: `mutation { refreshToken }` }),
    },
  );

  const data = await response.json();
  if (data.errors) throw new Error("Refresh failed");
  return data.data.refreshToken as boolean;
};

let isRefreshing = false;

const errorLink = onError(
  ({
    graphQLErrors,
    networkError,
    operation,
    forward,
    CombinedGraphQLErrors,
  }: any) => {
    console.log("ERROR LINK HIT");
    console.log("graphQLErrors:", graphQLErrors);
    console.log("networkError:", networkError);
    console.log("CombinedGraphQLErrors: ", CombinedGraphQLErrors);

    const isNetwork401 =
      networkError &&
      "statusCode" in networkError &&
      networkError.statusCode === 401;

    const isGraphQLAuthError = graphQLErrors?.some(
      (err: any) =>
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message === "Not authenticated — please log in first",
    );

    if ((isNetwork401 || isGraphQLAuthError) && !isRefreshing) {
      isRefreshing = true;

      return new Observable((observer) => {
        refreshAccessToken()
          .then(() => {
            isRefreshing = false;
            console.log("Token refreshed, retrying operation...");
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch((err: any) => {
            const error = err as Error;
            console.log("error in refresh apollo client is : ", error);
            isRefreshing = false;
            console.log("Refresh failed, redirecting...");
            window.location.href = "/register";
            observer.error(err);
          });
      });
    }
  },
);

export const client = new ApolloClient({
  //   link: httpLink,
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
