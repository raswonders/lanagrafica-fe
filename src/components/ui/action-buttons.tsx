import { MessageSquareText, RefreshCcw, SquarePen } from "lucide-react";
import { Button } from "./button";
import { MemberDetails } from "./member-details";
import { RenewConfirm } from "./renew-confirm";
import { useMembersMutations } from "@/hooks/use-table-mutations";
import { Member } from "@/types";

type ActionButtonsProps = {
  row: Member;
};

export function ActionButtons({ row }: ActionButtonsProps) {
  const isRenewForbidden =
    row.status === "active" ||
    row.status === "suspended" ||
    row.status === "deleted";
  const hasNote = Boolean(row.note);

  const { renewMutation, updateMutation } = useMembersMutations();

  return (
    <div className="flex">
      <MemberDetails row={row} updateMutation={updateMutation}>
        <Button size="icon" variant="ghost">
          <SquarePen className="w-5" />
        </Button>
      </MemberDetails>

      <RenewConfirm
        isOpenForbidden={isRenewForbidden}
        id={row.id}
        name={`${row.name} ${row.surname}`}
        expirationDate={row.expirationDate}
        renewMutation={renewMutation}
      >
        <Button size="icon" variant="ghost" disabled={isRenewForbidden}>
          <RefreshCcw className={`w-5`} />
        </Button>
      </RenewConfirm>

      <MemberDetails row={row} updateMutation={updateMutation} variant="note">
        <Button size="icon" variant="ghost" disabled={!hasNote}>
          <MessageSquareText className="w-5" />
        </Button>
      </MemberDetails>
    </div>
  );
}
