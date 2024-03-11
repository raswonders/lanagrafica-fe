import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-provider";
import React from "react";

type Nodes = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Nodes) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
