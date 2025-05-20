import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

type Node = {
  children: React.ReactElement;
};

export function AuthLayout({ children }: Node) {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && window.location.pathname !== "/login") {
      navigate("/login");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (session && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [session, navigate]);

  return children;
}
