import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("user");
  }

  const isAdmin = Boolean(user?.isAdmin ?? parsedUser?.isAdmin);

  if (!token || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
