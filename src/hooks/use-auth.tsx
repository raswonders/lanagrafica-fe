import { AuthContext } from "@/components/providers/auth-provider";
import { useContext } from "react";

export function useAuth() {
  return useContext(AuthContext);
}
