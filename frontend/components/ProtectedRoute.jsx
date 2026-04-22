import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * - If no token → redirect to /login (with ?redirect= so user lands back after login)
 * - If allowedRoles provided → check user.type matches, else redirect to their dashboard
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // No token → send to login
  if (!token || !userRaw) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    // Corrupted storage → clear and redirect
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.type)) {
    // Redirect to their correct dashboard instead of a blank page
    if (user.type === "lecturer" || user.type === "admin") {
      return <Navigate to="/lecturer/lec_active-rooms" replace />;
    }
    return <Navigate to="/StudentDashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
