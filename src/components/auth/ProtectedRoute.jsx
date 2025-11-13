import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

/**
 * Props:
 * - allowedRoles: array of roles allowed to access
 * - adminAccess: if true, admin role can access any route
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  adminAccess = false,
}) => {
  const { user } = useContext(AuthContext);
  // not authenticated -> go to login
  if (!user) return <Navigate to="/login" replace />;
  const rawRole = user.user?.role || user.role || "user";
  const role = rawRole === "employee" ? "user" : rawRole;
  // admin can access all pages
  if (role === "admin") return children;
  if (allowedRoles.includes(role)) return children;
  // authenticated but not authorized -> redirect to their dashboard
  switch (role) {
    case "chef":
      return <Navigate to="/chef" replace />;
    case "accountant":
      return <Navigate to="/accountant" replace />;
    case "cafeteria":
      return <Navigate to="/cafeteria" replace />;
    case "user":
    default:
      return <Navigate to="/user" replace />;
  }
};

export default ProtectedRoute;
