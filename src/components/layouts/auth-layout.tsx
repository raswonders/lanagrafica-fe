import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth-provider";
import { useEffect } from "react";

type Node = {
  children: React.ReactElement;
};

export function AuthLayout({ children }: Node) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return children;
}
