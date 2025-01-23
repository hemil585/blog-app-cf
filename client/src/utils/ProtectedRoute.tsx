import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
};
