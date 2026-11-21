import { Navigate } from "react-router-dom";
import { useAuth } from "../userContext/userDataContext";
import Login from "../pages/login";
export default function PageLoginRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Login />;
  }
  return user.isAdmin ? (
    <Navigate to="/dashBoard" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}
