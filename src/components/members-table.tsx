import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMemo, useState } from "react";
import { supabase } from "@/components/supabase";
import { useTranslation } from "react-i18next";
import {
  extendWithStatus,
  fromSnakeToCamelCase,
  getCustomDate,
  hasExpired,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type Member = {
  name: string;
  surname: string;
  province: string;
  birthDate: string;
  birthPlace: string;
  email: string;
  docType: string;
  docId: string;
  country: string;
  suspendedTill: string;
  expirationDate: string;
  cardNumber: string;
  isActive: boolean;
  isDeleted: boolean;
  status: string;
};

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "./ui/checkbox";
import { EyeOff, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

const columnHelper = createColumnHelper<Member>();

export function DataTable() {
  const { t } = useTranslation();

  const columns = useMemo(
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
      columnHelper.accessor("status", {
        meta: t("membersTable.status"),
        cell: (info) => {
          const name = info.getValue();
          let variantName;

          if (name === "expired") {
            variantName = "inactive";
          } else {
            variantName = name;
          }

          return (
            <Badge
              variant={
                (variantName as "active") ||
                "inactive" ||
                "suspended" ||
                "deleted"
              }
            >
              {t("membersTable." + name)}
            </Badge>
          );
        },
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
      columnHelper.accessor("cardNumber", {
        meta: t("membersTable.cardNumber"),
        cell: (info) => {
          const result = info.getValue();
          return result ? result : "-";
        },
        header: () => <span>{t("membersTable.cardNumber")}</span>,
      }),
    ],
    [t],
  );

  const [columnVisibility, setColumnVisibility] = useState({
    fullName: true,
    birthDate: true,
    status: true,
    email: true,
    suspendedTill: false,
    expirationDate: false,
    cardNumber: false,
    isActive: false,
    isDeleted: false,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ["members"],
    queryFn: async (): Promise<Member[]> => {
      const { data } = await supabase.from("member").select();
      const dataNormalized = data
        ? (fromSnakeToCamelCase(data) as Member[])
        : [];

      return extendWithStatus(dataNormalized);
    },
  });

  const tableData = isPending ? Array(20).fill({}) : data || [];

  const tableColumns = isPending
    ? columns.map((row) => ({
        ...row,
        cell: () => <Skeleton className="w-[150px] h-[24px] rounded-full" />,
      }))
    : columns;

  const table = useReactTable({
    state: {
      columnVisibility,
      columnFilters,
    },
    columns: tableColumns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  function handleFilterBadgeRemoval(index: number) {
    setColumnFilters((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFilterBadgeAddition(filter: string) {
    let filterId: string;
    let filterValue: string | boolean;

    if (filter === "active") {
      filterId = "isActive";
      filterValue = true;
    }
    if (filter === "inactive") {
      filterId = "isActive";
      filterValue = false;
    }
    if (filter === "deleted") {
      filterId = "isDeleted";
      filterValue = true;
    }

    if (filter === "expired") {
      filterId = "expirationDate";
      filterValue = filter;
    }

    if (filter === "suspended") {
      filterId = "suspendedTill";
      filterValue = filter;
    }

    setColumnFilters((prev) => {
      if (
        prev.find((item) => item.id === filterId && item.value === filterValue)
      ) {
        return prev;
      }

      return [
        ...prev.filter((f) => f.id !== filterId),
        {
          id: filterId,
          value: filterValue,
        },
      ];
    });
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-wrap items-baseline">
          <div className="mr-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="my-6">
                  <Filter className="w-4 mr-2" />
                  {t("membersTable.addFilter")}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <ul className="space-y-2">
                  <li>
                    <Button
                      size="sm"
                      variant="active"
                      onClick={() => handleFilterBadgeAddition("active")}
                    >
                      {t("membersTable.active")}
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="inactive"
                      onClick={() => handleFilterBadgeAddition("inactive")}
                    >
                      {t("membersTable.inactive")}
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="inactive"
                      onClick={() => handleFilterBadgeAddition("expired")}
                    >
                      {t("membersTable.expired")}
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="suspended"
                      onClick={() => handleFilterBadgeAddition("suspended")}
                    >
                      {t("membersTable.suspended")}
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="deleted"
                      onClick={() => handleFilterBadgeAddition("deleted")}
                    >
                      {t("membersTable.deleted")}
                    </Button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {columnFilters.map((filter, index) => {
              let filterName = "";
              let filterVariant = "";

              if (filter.id === "isActive" && filter.value === true) {
                filterName = "active";
                filterVariant = "active";
              }

              if (filter.id === "isActive" && filter.value === false) {
                filterName = "inactive";
                filterVariant = "inactive";
              }

              if (filter.id === "expirationDate") {
                filterName = "expired";
                filterVariant = "inactive";
              }

              if (filter.id === "suspendedTill") {
                filterName = "suspended";
                filterVariant = "suspended";
              }

              if (filter.id === "isDeleted") {
                filterName = "deleted";
                filterVariant = "deleted";
              }

              return (
                <Button
                  variant={
                    filterVariant as
                      | "active"
                      | "inactive"
                      | "suspended"
                      | "deleted"
                  }
                  size="xs"
                  key={filterName}
                  onClick={() => handleFilterBadgeRemoval(index)}
                >
                  {t("membersTable." + filterName)}
                </Button>
              );
            })}
            {columnFilters.length !== 0 && (
              <Button
                variant="secondary"
                size="xs"
                onClick={() => setColumnFilters([])}
              >
                {t("membersTable.clearAll")}
              </Button>
            )}
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="my-6">
              <EyeOff className="w-4 mr-2" />
              {t("membersTable.hideFields")}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {table.getAllColumns().map((col, index, self) => {
              if (col.id === "isActive" || col.id === "isDeleted") return null;

              return (
                <div
                  key={col.id}
                  className={`flex ${index === self.length - 1 ? "" : "mb-4"}`}
                >
                  <Checkbox
                    id={col.id}
                    checked={
                      columnVisibility[col.id as keyof typeof columnVisibility]
                    }
                    onCheckedChange={(checked) => {
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [col.id]: checked,
                      }));
                    }}
                    className="mr-4"
                  />
                  <Label htmlFor={col.id} className="font-normal">
                    {(col.columnDef.meta as string) || col.id}
                  </Label>
                </div>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        {error ? (
          <div className="flex items-center justify-center">
            <div>
              {t("errors.membersDidNotLoad")}: {error.name}: {error.message}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
