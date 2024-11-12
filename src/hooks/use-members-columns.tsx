import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { getCustomDate, hasExpired } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Member } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface Row {
  original: Member;
}

const columnHelper = createColumnHelper<Member>();

export function useMembersColumns(isPending: boolean) {
  const { t } = useTranslation();

  const columnDefs = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.name} ${row.surname}`, {
        id: "fullName",
        meta: t("membersTable.name"),
        cell: (info) => info.getValue(),
        header: () => <span>{t("membersTable.name")}</span>,
      }),
      columnHelper.accessor("email", {
        meta: t("membersTable.email"),
        cell: (info) => info.getValue(),
        header: () => <span>{t("membersTable.email")}</span>,
      }),
      columnHelper.accessor("birthDate", {
        meta: t("membersTable.birthDate"),
        cell: (info) => getCustomDate(info.getValue()),
        header: () => <span>{t("membersTable.birthDate")}</span>,
      }),
      columnHelper.accessor("cardNumber", {
        meta: t("membersTable.cardNumber"),
        cell: (info) => {
          const result = info.getValue();
          return result ? result : "-";
        },
        header: () => <span>{t("membersTable.cardNumber")}</span>,
      }),
      columnHelper.accessor("expirationDate", {
        meta: t("membersTable.expirationDate"),
        cell: (info) => {
          const result = getCustomDate(info.getValue());
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
      columnHelper.accessor("suspendedTill", {
        meta: t("membersTable.suspendedTill"),
        cell: (info) => {
          const result = getCustomDate(info.getValue());
          return result ? result : "-";
        },
        header: () => <span>{t("membersTable.suspendedTill")}</span>,
        filterFn: (row, columnId) => {
          const cellValue = row.getValue(columnId);
          return cellValue ? !hasExpired(new Date(cellValue as string)) : false;
        },
      }),
      columnHelper.accessor("isActive", {
        meta: t("membersTable.isActive"),
        header: () => <span>{t("membersTable.isActive")}</span>,
        filterFn: "equals",
      }),
      columnHelper.accessor("isDeleted", {
        meta: t("membersTable.isDeleted"),
        header: () => <span>{t("membersTable.isDeleted")}</span>,
        filterFn: "equals",
      }),
      {
        meta: t("membersTable.actions"),
        id: "actions",
        header: () => <span className="ml-3">{t("membersTable.actions")}</span>,
        cell: ({ row }: { row: Row }) => {
          return <ActionButtons row={row.original} />;
        },
      },
    ],
    [t],
  );

  return isPending
    ? columnDefs.map((row) => ({
        ...row,
        cell: () => <Skeleton className="w-[150px] h-[24px] rounded-full" />,
      }))
    : columnDefs;
}
