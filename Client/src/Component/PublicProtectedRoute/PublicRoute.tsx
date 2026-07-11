import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER_QUERY } from "../graphql/Query";
import { Navigate } from "react-router-dom";
import type { GET_CURRENT_USER_Interface } from "../graphql/client";
import { ClipLoader } from "react-spinners";

interface Props {
  children: React.ReactNode;
}
export default function PublicRoute({ children }: Props) {
  const { data, loading } = useQuery<GET_CURRENT_USER_Interface>(GET_CURRENT_USER_QUERY);

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }
  if (data) return <Navigate to="/" replace />;

  return <>{children}</>;
}
