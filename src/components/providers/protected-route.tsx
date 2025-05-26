import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  publicOnly?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  publicOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  const isAdmin =
    user?.email === "admin@example.com" ||
    user?.["https://your-namespace/roles"]?.includes("admin");

  if (isLoading) {
    return null;
  }

  if (publicOnly && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!publicOnly) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (adminOnly && !isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
