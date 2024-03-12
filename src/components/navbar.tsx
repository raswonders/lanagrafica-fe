import { AccountDetails } from "./account-details";
import { useAuth } from "./auth-provider";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";

export function Navbar() {
  const { user } = useAuth();

  return (
    <div className="fixed border-neutral-6 flex w-full justify-between p-3">
      <ModeToggle />

      <nav>
        {user && (
          <ul className="flex gap-3">
            <li>
              <NavLink to={"/home"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={isActive ? "text-neutral-12 bg-accent-a3" : ""}
                  >
                    Home
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/members"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={isActive ? "text-neutral-12 bg-accent-a3" : ""}
                  >
                    Members
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/cards"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={isActive ? "text-neutral-12 bg-accent-a3" : ""}
                  >
                    Cards
                  </Button>
                )}
              </NavLink>
            </li>
          </ul>
        )}
      </nav>

      {user && <AccountDetails />}
    </div>
  );
}
