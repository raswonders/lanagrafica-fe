import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { RenewMutation } from "./members-table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RenewConfirmProps = {
  children: ReactNode;
  isOpenForbidden: boolean;
  id: number;
  expirationDate: string;
  name: string;
  renewMutation: RenewMutation;
};

export function RenewConfirm({
  children,
  isOpenForbidden,
  id,
  expirationDate,
  name,
  renewMutation,
}: RenewConfirmProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isOpenForbidden) return;
        setOpen(nextOpen);
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t("membersTable.renewMember")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("renewConfirm.title")}
            <span className="text-accent-11">{` ${name}`}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`${name} `}
            {t("renewConfirm.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("renewConfirm.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              console.log("name", name);
              renewMutation.mutate({
                id: id,
                expirationDate: expirationDate,
                name: name,
              });
            }}
          >
            {t("renewConfirm.renew")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
