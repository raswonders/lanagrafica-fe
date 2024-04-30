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
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function RenewConfirm({
  children,
  isOpenForbidden,
  id,
  expirationDate,
  name,
  renewMutation,
}) {
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
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
              renewMutation.mutate({
                id: id,
                expirationDate: expirationDate,
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
