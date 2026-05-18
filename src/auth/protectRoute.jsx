import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthSystem";

export default function ProtectedRoute({
  children
}) {

  const {
    user,
    loading
  } = useAuth();

  /* WAIT FOR AUTH */
  if (loading) {

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          fontWeight: "bold"
        }}
      >
        Loading...
      </div>
    );
  }

  /* NOT LOGGED IN */
  if (!user) {

    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  /* ALLOWED */
  return children;
}