import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRole?: string;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { authUserData, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authUserData) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && authUserData.role !== allowedRole) {
    return (
      <Navigate to={authUserData.role === "ADMIN" ? "/admin" : "/"} replace />
    );
  }

  return <>{children}</>;
}
