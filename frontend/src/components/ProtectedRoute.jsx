import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/profile" />;
  }

  return children;
}
