import { useAuth } from "@/hooks/use-auth";
import { AccountDetails } from "./account-details";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { session } = useAuth();
  const { t } = useTranslation();
  const isAdmin = session?.user?.email === "admin@example.com";

  return (
    <div className="min-h-20 absolute border-neutral-6 flex w-full justify-between p-3 items-center">
      {session ? (
        <NavLink to={"/"}>
          <Logo />
        </NavLink>
      ) : (
        <Logo />
      )}

      <nav>
        {session && (
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
            {isAdmin && (
              <li>
                <NavLink to={"/cards"} tabIndex={-1}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-lg",
                        isActive && "text-accent-foreground bg-accent",
                      )}
                    >
                      {t("navbar.cards")}
                    </Button>
                  )}
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </nav>

      {session ? <AccountDetails /> : <ModeToggle />}
    </div>
  );
}
