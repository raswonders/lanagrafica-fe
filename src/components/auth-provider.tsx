import { delay } from "@/lib/utils";
import { ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: "",
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
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const signIn = async ({ username, password }: Credentials): Promise<void> => {
    await delay(1500); // TODO remove delay and naive login before production
    if (username === "user" && password === "user") {
      setUser(username);
      navigate("/");
    }
  };

  const signOut = async () => {
    await delay(1500); // TODO remove this before production
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
