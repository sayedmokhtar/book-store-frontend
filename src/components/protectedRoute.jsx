import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../userContext/userDataContext";
export default function ProtectedRoute() {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) {
    return <p>Checking authentication...</p>;
  }
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
}
