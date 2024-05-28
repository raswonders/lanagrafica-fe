import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { Globe, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../providers/theme-provider";

export function AccountDetails() {
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.resolvedLanguage);
  const { theme, setTheme } = useTheme();

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">#{user?.username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        sideOffset={0}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="w-6 h-6 lg:w-4 lg:h-4 mr-2" />
            <span>{t("account.language")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={lang}
                onValueChange={handleLangChange}
              >
                <DropdownMenuRadioItem value="en">
                  <span>{t("account.lang.en")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="it">
                  <span>{t("account.lang.it")}</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() =>
            theme === "dark" ? setTheme("light") : setTheme("dark")
          }
        >
          <Moon className="absolute w-6 h-6 lg:w-4 lg:h-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Sun className="w-6 h-6 lg:w-4 lg:h-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <span>{t("account.theme")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="w-6 h-6 lg:w-4 lg:h-4 mr-2" />
          <span>{t("account.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
