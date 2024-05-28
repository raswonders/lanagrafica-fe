import { useAuth } from "@/hooks/useAuth";
import { AccountDetails } from "./account-details";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-20 absolute border-neutral-6 flex w-full justify-between p-3 items-center">
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
              <NavLink to={"/"} tabIndex={-1}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={cn(
                      "rounded-lg",
                      isActive && "text-accent-foreground bg-accent",
                    )}
                  >
                    {t("navbar.members")}
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
