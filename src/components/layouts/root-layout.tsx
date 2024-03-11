import { Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";

export function RootLayout() {
  return (
    <div>
      <header>
        <div className="absolute m-4">
          <ModeToggle />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
