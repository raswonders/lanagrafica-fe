import { Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { AuthProvider } from "../auth-provider";

export function RootLayout() {
  return (
    <AuthProvider>
      <header>
        <div className="absolute m-4">
          <ModeToggle />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </AuthProvider>
  );
}
