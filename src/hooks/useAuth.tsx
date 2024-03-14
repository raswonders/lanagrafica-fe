import { AuthContext } from "@/components/auth-provider";
import { useContext } from "react";

export function useAuth() {
  return useContext(AuthContext);
}
