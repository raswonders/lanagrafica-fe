import { useAuth } from "@/hooks/useAuth";
import { AccountDetails } from "./account-details";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="fixed border-neutral-6 flex w-full justify-between p-3">
      <ModeToggle />

      <nav>
        {user && (
          <ul className="flex gap-3">
            <li>
              <NavLink to={"/"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={
                      isActive ? "text-accent-foreground bg-accent" : ""
                    }
                  >
                    {t("navbar.home")}
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/members"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={
                      isActive ? "text-accent-foreground bg-accent" : ""
                    }
                  >
                    {t("navbar.members")}
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/cards"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={
                      isActive ? "text-accent-foreground bg-accent" : ""
                    }
                  >
                    {t("navbar.cards")}
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
