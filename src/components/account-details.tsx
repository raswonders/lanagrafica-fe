import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "./auth-provider";

export function AccountDetails() {
  const { user, signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger tabIndex={-1}>
        <Button variant="ghost">#{user}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
