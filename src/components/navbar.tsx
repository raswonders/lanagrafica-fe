import { useAuth } from "@/hooks/useAuth";
import { AccountDetails } from "./account-details";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRoundPlus, UserRoundSearch } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-20 fixed border-neutral-6 flex w-full justify-between p-3 items-center">
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
                    className={cn(
                      "rounded-lg py-7 sm:py-0",
                      isActive && "text-accent-foreground bg-accent",
                    )}
                  >
                    <UserRoundSearch className="h-8 w-8 sm:mr-1 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline">
                      {t("navbar.members")}
                    </span>
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/new-member"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={cn(
                      "rounded-lg py-7 sm:py-0",
                      isActive && "text-accent-foreground bg-accent",
                    )}
                  >
                    <UserRoundPlus className="h-8 w-8 sm:mr-1 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline">
                      {t("navbar.addMember")}
                    </span>
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
