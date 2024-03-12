import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth-provider";
import { useEffect } from "react";

type Node = {
  children: React.ReactElement;
};

export function AuthLayout({ children }: Node) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return children;
}
