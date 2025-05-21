import { Outlet } from "react-router-dom";
import { Navbar } from "../ui/navbar";
import { AuthProvider } from "../providers/auth-provider";

export function RootLayout() {
  return (
    <AuthProvider>
      <>
        <header>
          <Navbar />
        </header>
        <main>
          <Outlet />
        </main>
      </>
    </AuthProvider>
  );
}
