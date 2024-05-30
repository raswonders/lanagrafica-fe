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

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCustomDate, hasExpired } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type Member = {
  id: number;
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
  measure: string;
  registrationDate: string;
  note: string;
};

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "./checkbox";
import {
  EyeOff,
  Filter,
  MessageSquareText,
  RefreshCcw,
  SquarePen,
} from "lucide-react";
import { Skeleton } from "./skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { RenewConfirm } from "./renew-confirm";
import { MemberDetails } from "./member-details";
import { StatusBadge } from "./status-badge";
import { SearchBar } from "./searchbar";
import { Separator } from "@radix-ui/react-separator";
import { useMembersMutations } from "@/hooks/use-table-mutations";
import { AddMember } from "./add-member";
import { useWindowSize } from "@/hooks/use-window-size";
import { useMembersQuery } from "@/hooks/use-members-query";

const columnHelper = createColumnHelper<Member>();
const membersPerPage = 20;

interface Row {
  original: Member;
}

export function DataTable() {
  const { t } = useTranslation();
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);
  const { renewMutation, updateMutation, insertMutation } =
    useMembersMutations();
  const isMobile = useWindowSize();

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
          const isRenewForbidden =
            row.original.status === "active" ||
            row.original.status === "suspended" ||
            row.original.status === "deleted";
          const hasNote = Boolean(row.original.note);

          return (
            <div className="flex">
              <MemberDetails row={row.original} updateMutation={updateMutation}>
                <Button size="icon" variant="ghost">
                  <SquarePen className="w-5" />
                </Button>
              </MemberDetails>

              <RenewConfirm
                isOpenForbidden={isRenewForbidden}
                id={row.original.id}
                name={`${row.original.name} ${row.original.surname}`}
                expirationDate={row.original.expirationDate}
                renewMutation={renewMutation}
              >
                <Button size="icon" variant="ghost" disabled={isRenewForbidden}>
                  <RefreshCcw className={`w-5`} />
                </Button>
              </RenewConfirm>

              <MemberDetails
                row={row.original}
                updateMutation={updateMutation}
                variant="note"
              >
                <Button size="icon" variant="ghost" disabled={!hasNote}>
                  <MessageSquareText className="w-5" />
                </Button>
              </MemberDetails>
            </div>
          );
        },
      },
    ],
    [t, renewMutation, updateMutation],
  );

  const [columnVisibility, setColumnVisibility] = useState(
    isMobile
      ? {
          fullName: true,
          birthDate: false,
          status: true,
          email: false,
          suspendedTill: false,
          expirationDate: false,
          cardNumber: false,
          isActive: false,
          isDeleted: false,
          actions: true,
        }
      : {
          fullName: true,
          birthDate: true,
          status: true,
          email: false,
          suspendedTill: false,
          expirationDate: true,
          cardNumber: true,
          isActive: false,
          isDeleted: false,
          actions: true,
        },
  );

  // Query data
  const { isPending, error, data, fetchNextPage, hasNextPage, refetch } =
    useMembersQuery(debouncedSearch, membersPerPage);

  useEffect(() => {
    if (debouncedSearch !== null) refetch();
  }, [refetch, debouncedSearch]);

  // Build table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const members = useMemo(() => {
    return data?.pages.reduce<Member[]>((acc, page) => {
      return [...acc, ...page.members];
    }, []);
  }, [data]);
  const tableRows = isPending ? Array(membersPerPage).fill({}) : members || [];
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
    data: tableRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  function handleFilterBadgeAddition(filter: string) {
    setOpen(false);
    let filterId: string;
    let filterValue: string | boolean;

    if (filter === "all") {
      setColumnFilters([]);
      return;
    }

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
        {
          id: filterId,
          value: filterValue,
        },
      ];
    });
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-row items-end justify-between gap-6 mt-6">
        <AddMember insertMutation={insertMutation} />
        <SearchBar setDebouncedSearch={setDebouncedSearch} />
      </div>
      <Separator className="h-0.5 bg-neutral-6 my-6" />
      <div className="flex justify-between">
        <div className="flex flex-wrap items-baseline">
          <div className="mr-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mb-6">
                  <Filter className="w-4 mr-2" />
                  {t("membersTable.addFilter")}
                  {columnFilters.length ? (
                    columnFilters.map((filter) => {
                      let filterVariant = "";

                      if (filter.id === "isActive" && filter.value === true) {
                        filterVariant = "active";
                      }

                      if (filter.id === "isActive" && filter.value === false) {
                        filterVariant = "inactive";
                      }

                      if (filter.id === "expirationDate") {
                        filterVariant = "expired";
                      }

                      if (filter.id === "suspendedTill") {
                        filterVariant = "suspended";
                      }

                      if (filter.id === "isDeleted") {
                        filterVariant = "deleted";
                      }

                      return (
                        <div className="ml-2" key={filterVariant}>
                          <StatusBadge status={filterVariant} />
                        </div>
                      );
                    })
                  ) : (
                    <div className="ml-2" key="all">
                      <StatusBadge status="all" />
                    </div>
                  )}
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
                  <li>
                    <Button
                      size="sm"
                      variant="all"
                      onClick={() => handleFilterBadgeAddition("all")}
                    >
                      {t("membersTable.all")}
                    </Button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mb-6">
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
          <InfiniteScroll
            dataLength={tableRows ? tableRows.length : 0}
            next={() => fetchNextPage()}
            hasMore={hasNextPage}
            loader={<div className="h-24">Loading...</div>}
          >
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
                      {t("membersTable.noResults")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
