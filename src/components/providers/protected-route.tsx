import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

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
  const { session } = useAuth();
  const location = useLocation();
  const isAdmin = session?.user?.email === "admin@example.com";

  if (publicOnly && session) {
    return <Navigate to="/" replace />;
  }

  if (!publicOnly) {
    if (!session) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (adminOnly && !isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
