import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { getCustomDate, hasExpired } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButtons } from "@/components/ui/action-buttons";
import { MemberExt } from "@/types/types";

const columnHelper = createColumnHelper<MemberExt>();

export function useMembersColumns() {
  const { t } = useTranslation();

  return useMemo(
    () => [
      columnHelper.accessor((row) => `${row.name} ${row.surname}`, {
        id: "fullName",
        meta: t("membersTable.name"),
        enableHiding: false,
        cell: (info) => info.getValue(),
        header: () => <span>{t("membersTable.name")}</span>,
      }),
      columnHelper.accessor("email", {
        meta: t("membersTable.email"),
        cell: (info) => info.getValue(),
        header: () => <span>{t("membersTable.email")}</span>,
      }),
      columnHelper.accessor("birth_date", {
        meta: t("membersTable.birthDate"),
        cell: (info) => getCustomDate(info.getValue()),
        header: () => <span>{t("membersTable.birthDate")}</span>,
      }),
      columnHelper.accessor("card_number", {
        meta: t("membersTable.cardNumber"),
        cell: (info) => {
          const result = info.getValue();
          return result ? result : "-";
        },
        header: () => <span>{t("membersTable.cardNumber")}</span>,
      }),
      columnHelper.accessor("expiration_date", {
        meta: t("membersTable.expirationDate"),
        cell: (info) => {
          const result = getCustomDate(info.getValue() || "");
          return result ? result : "-";
        },
        header: () => <span>{t("membersTable.expirationDate")}</span>,
        filterFn: (row, columnId) => {
          return hasExpired(new Date(row.getValue(columnId)));
        },
      }),
      columnHelper.accessor("status", {
        meta: t("membersTable.status"),
        cell: (info) => <StatusBadge status={info.getValue()} />,
        header: () => <span>{t("membersTable.status")}</span>,
        filterFn: "equals",
      }),
      columnHelper.accessor("suspended_till", {
        meta: t("membersTable.suspendedTill"),
        cell: (info) => {
          const result = getCustomDate(info.getValue() || "");
          return result ? result : "-";
        },
        header: () => <span>{t("membersTable.suspendedTill")}</span>,
        filterFn: (row, columnId) => {
          const cellValue = row.getValue(columnId);
          return cellValue ? !hasExpired(new Date(cellValue as string)) : false;
        },
      }),
      columnHelper.accessor("is_active", {
        meta: t("membersTable.isActive"),
        header: () => <span>{t("membersTable.isActive")}</span>,
        filterFn: "equals",
      }),
      columnHelper.accessor("is_deleted", {
        meta: t("membersTable.isDeleted"),
        header: () => <span>{t("membersTable.isDeleted")}</span>,
        filterFn: "equals",
      }),
      columnHelper.display({
        meta: t("membersTable.actions"),
        id: "actions",
        header: () => <span className="ml-3">{t("membersTable.actions")}</span>,
        cell: (info) => {
          return <ActionButtons row={info.row.original} />;
        },
      }),
    ],
    [t],
  );
}
