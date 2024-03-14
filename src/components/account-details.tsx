import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { t } from "i18next";

export function AccountDetails() {
  const { user, signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger tabIndex={-1}>
        <Button variant="ghost">#{user?.username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        sideOffset={0}
      >
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>{t("account.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
