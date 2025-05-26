import { useAuth0, User } from "@auth0/auth0-react";
import { ReactNode, createContext, useContext } from "react";

interface Auth0Session {
  user: User;
}

export interface AuthContextType {
  user: User | null;
  session: Auth0Session | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Node {
  children: ReactNode;
}

export function AuthProvider({ children }: Node) {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  const signIn = async () => {
    try {
      console.log("Attempting login with Auth0...");
      await loginWithRedirect({
        appState: { returnTo: window.location.origin },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signOut = async () => {
    try {
      await logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    user: user || null,
    session: isAuthenticated && user ? { user } : null,
    signIn,
    signOut,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
