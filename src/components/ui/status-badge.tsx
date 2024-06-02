import { useTranslation } from "react-i18next";
import { Badge } from "./badge";

type StatusVariant = "active" | "inactive" | "suspended" | "deleted" | "all";

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const allowedStatus = [
    "active",
    "inactive",
    "expired",
    "suspended",
    "deleted",
    "all",
  ];
  let variantName: StatusVariant;

  if (!allowedStatus.includes(status)) {
    throw new Error(`Invalid status name used ${status}`);
  }

  variantName = status as StatusVariant;
  if (status === "expired") variantName = "inactive";

  return <Badge variant={variantName}>{t("membersTable." + status)}</Badge>;
}
