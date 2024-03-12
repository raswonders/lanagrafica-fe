import { delay } from "@/lib/utils";
import { ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

interface Node {
  children: ReactNode;
}

interface Credentials {
  username: string;
  password: string;
}

export const AuthProvider = ({ children }: Node) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const signIn = async ({ username, password }: Credentials): Promise<void> => {
    await delay(1500); // TODO remove delay and naive login before production
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  const signOut = async () => {
    await delay(1500); // TODO remove this before production
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
