import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

/**
 * PublicRoute: if user is authenticated, redirect them to their dashboard.
 * Otherwise render children (public pages like login/register)
 */
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return children;
  const rawRole = user.user?.role || user.role || "user";
  const role = rawRole === "employee" ? "user" : rawRole;
  switch (role) {
    case "chef":
      return <Navigate to="/chef" replace />;
    case "accountant":
      return <Navigate to="/admin" replace />;
    case "cafeteria":
      return <Navigate to="/cafeteria" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    case "user":
    default:
      return <Navigate to="/user" replace />;
  }
};

export default PublicRoute;
