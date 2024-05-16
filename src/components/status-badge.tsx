import { useTranslation } from "react-i18next";
import { Badge } from "./ui/badge";

type StatusVariant = "active" | "inactive" | "suspended" | "deleted";

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const allowedStatus = [
    "active",
    "inactive",
    "expired",
    "suspended",
    "deleted",
  ];
  let variantName: StatusVariant;

  if (!allowedStatus.includes(status)) {
    throw new Error(`Invalid status name used ${status}`);
  }

  variantName = status as StatusVariant;
  if (status === "expired") variantName = "inactive";

  return <Badge variant={variantName}>{t("membersTable." + status)}</Badge>;
}
