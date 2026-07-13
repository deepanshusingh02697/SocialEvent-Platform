import { ApolloLink, Observable } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  credentials: "include"
});

const refreshAccessToken = async (): Promise<boolean> => {
  const response = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `mutation { refreshToken }` }),
  });

  const data = await response.json();
  if (data.errors) throw new Error("Refresh failed");
  return data.data.refreshToken as boolean;
};

let isRefreshing = false;

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }: any) => {
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
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch((err: any) => {
            isRefreshing = false;
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
