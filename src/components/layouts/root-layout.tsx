import { Outlet } from "react-router-dom";
import { AuthProvider } from "../auth-provider";
import { AuthLayout } from "./auth-layout";
import { Navbar } from "../navbar";

export function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout>
        <>
          <header>
            <Navbar />
          </header>
          <main>
            <Outlet />
          </main>
        </>
      </AuthLayout>
    </AuthProvider>
  );
}
