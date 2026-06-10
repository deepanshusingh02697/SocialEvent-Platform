import { useQuery } from "@apollo/client/react";
import type { GET_CURRENT_USER_Interface } from "../graphql/client";
import { GET_CURRENT_USER_QUERY } from "../graphql/Query";

export const useAuth = () => {
  const { data, loading } = useQuery<GET_CURRENT_USER_Interface>(
    GET_CURRENT_USER_QUERY,
  );
  const authUserData = data?.currentUser;
  return { authUserData, loading };
};
