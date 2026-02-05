import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * A wrapper component that checks for an authentication token in localStorage.
 * If the token exists, it renders the child components (the protected page).
 * If not, it redirects the user to the /signin page, saving the intended destination.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to. This allows us to redirect them back after they sign in.
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
