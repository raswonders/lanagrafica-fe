import { useAuth } from "@/hooks/useAuth";
import { AccountDetails } from "./account-details";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRoundPlus, UserRoundSearch } from "lucide-react";
import { Logo } from "./logo";

export function Navbar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="fixed border-neutral-6 flex w-full justify-between p-3">
      {user ? (
        <NavLink to={"/"}>
          <Logo />
        </NavLink>
      ) : (
        <Logo />
      )}

      <nav>
        {user && (
          <ul className="flex gap-3">
            <li>
              <NavLink to={"/members"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={
                      isActive ? "text-accent-foreground bg-accent" : ""
                    }
                  >
                    <UserRoundSearch className="mr-1 h-5" />
                    {t("navbar.members")}
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/new-member"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={
                      isActive ? "text-accent-foreground bg-accent" : ""
                    }
                  >
                    <UserRoundPlus className="mr-1 h-5" />
                    {t("navbar.addMember")}
                  </Button>
                )}
              </NavLink>
            </li>
          </ul>
        )}
      </nav>

      {user ? <AccountDetails /> : <ModeToggle />}
    </div>
  );
}
