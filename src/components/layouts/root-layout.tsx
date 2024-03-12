import { Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { AuthProvider } from "../auth-provider";
import { AuthLayout } from "./auth-layout";

export function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout>
        <>
          <header>
            <div className="absolute m-4">
              <ModeToggle />
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </>
      </AuthLayout>
    </AuthProvider>
  );
}
