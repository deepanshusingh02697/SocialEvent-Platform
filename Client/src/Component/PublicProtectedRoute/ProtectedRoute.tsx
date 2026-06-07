import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER_QUERY } from "../graphql/Query";
import { Navigate } from "react-router-dom";
import type { GET_CURRENT_USER_Interface } from "../graphql/client";

interface Props {
  children: React.ReactNode;
}
export default function ProtectedRoute({ children }: Props) {
  const { data, loading } = useQuery<GET_CURRENT_USER_Interface>(
    GET_CURRENT_USER_QUERY,
  );
  console.log("data from backend is : ", data);
  if (loading) {
    return (
      <>
        <div style={{ display: "grid", placeItems: "center" }}>Lodaing...</div>
      </>
    );
  }
  if (!data) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
