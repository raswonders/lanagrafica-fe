import { Outlet } from "react-router-dom";
import { AuthLayout } from "./auth-layout";
import { Navbar } from "../navbar";
import { AuthProvider } from "../auth-provider";

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
