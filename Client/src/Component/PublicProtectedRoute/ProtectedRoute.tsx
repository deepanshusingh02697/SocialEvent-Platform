import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ClipLoader } from "react-spinners";

interface Props {
  children: React.ReactNode;
  allowedRole?: string;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { authUserData, loading } = useAuth();

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
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
