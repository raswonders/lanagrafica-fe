import { useLocalUser } from "@/hooks/use-loca-user";
import { delay } from "@/lib/utils";
import { User } from "@/types/types";
import { ReactNode, createContext } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const [user, setUser] = useLocalUser(null);

  const navigate = useNavigate();

  const signIn = async ({ username, password }: Credentials): Promise<void> => {
    await delay(1500); // TODO remove delay and naive login before production
    if (username === "user" && password === "user") {
      setUser({ username: "user", jwt: "user" });
      navigate("/");
    }
  };

  const signOut = async () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
