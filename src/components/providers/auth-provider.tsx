import { supabase } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { ReactNode, createContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
});

interface Node {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Node) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (username: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) throw error;
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
