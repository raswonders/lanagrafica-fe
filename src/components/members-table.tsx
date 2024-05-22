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
import { supabase } from "@/components/supabase";
import { useTranslation } from "react-i18next";
import {
  extendDate,
  extendWithStatus,
  fromSnakeToCamelCase,
  genCardNumber,
  getCustomDate,
  hasExpired,
} from "@/lib/utils";
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
import { Checkbox } from "./ui/checkbox";
import {
  EyeOff,
  Filter,
  MessageSquareText,
  RefreshCcw,
  SquarePen,
} from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { RenewConfirm } from "./renew-confirm";
import { toast } from "sonner";
import { MemberDetails } from "./member-details";
import { StatusBadge } from "./status-badge";
import { SerializedMember } from "./pages/new-member";

const columnHelper = createColumnHelper<Member>();
const membersPerPage = 20;

export type RenewMutation = {
  mutate: (args: { id: number; expirationDate: string; name: string }) => void;
};

export type UpdateMutation = {
  mutate: (args: {
    id: number;
    details: Partial<SerializedMember>;
    name: string;
  }) => void;
};

interface Row {
  original: Member;
}

async function renewMemberCard(
  id: number,
  expirationDate: string,
): Promise<Member | null> {
  const cardNumber = genCardNumber();
  const nextExpiration = extendDate(new Date(expirationDate));

  const { data, error } = await supabase
    .from("member")
    .update({
      card_number: String(cardNumber),
      expiration_date: nextExpiration,
      is_active: true,
    })
    .eq("id", id);

  if (error) throw error;

  return data;
}

async function updateMember(
  id: number,
  details: Partial<SerializedMember>,
): Promise<Member | null> {
  const { data, error } = await supabase
    .from("member")
    .update(details)
    .eq("id", id);

  if (error) throw error;

  return data;
}

export function DataTable({ search }: { search: string | null }) {
  const { t } = useTranslation();
  const [isRenewing, setIsRenewing] = useState<Record<string, undefined>>({});
  const queryClient = useQueryClient();

  const renewMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      expirationDate: string;
      name: string;
    }) => renewMemberCard(variables.id, variables.expirationDate),
    onMutate: (variables) => {
      setIsRenewing((prev) => ({
        ...prev,
        [variables.id]: true,
      }));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("membersTable.renewSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("membersTable.renewError"), error);
      toast.error(
        t("membersTable.renewError", {
          name: variables.name,
        }),
      );
    },
    onSettled: (_, __, variables) => {
      setIsRenewing((prev) => ({
        ...prev,
        [variables.id]: false,
      }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      details: Partial<SerializedMember>;
      name: string;
    }) => updateMember(variables.id, variables.details),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("membersTable.updateSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("membersTable.updateError"), error);
      toast.error(
        t("membersTable.updateError", {
          name: variables.name,
        }),
      );
    },
  });

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
            isRenewing[row.original.id] ||
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
    [t, isRenewing, renewMutation, updateMutation],
  );

  const [columnVisibility, setColumnVisibility] = useState({
    fullName: true,
    birthDate: true,
    status: true,
    email: false,
    suspendedTill: false,
    expirationDate: true,
    cardNumber: true,
    isActive: false,
    isDeleted: false,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { isPending, error, data, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["members"],
      queryFn: queryMembers,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        return lastPageParam < lastPage.maxPageParam ? lastPageParam + 1 : null;
      },
      initialPageParam: 0,
    });

  useEffect(() => {
    if (search !== null) refetch();
  }, [refetch, search]);

  const members = useMemo(() => {
    return data?.pages.reduce<Member[]>((acc, page) => {
      return [...acc, ...page.members];
    }, []);
  }, [data]);

  type QueryMembersResult = {
    members: Member[];
    maxPageParam: number;
  };

  async function queryMembers({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<QueryMembersResult> {
    const pageStart = pageParam * membersPerPage;
    const pageEnd = pageStart + membersPerPage - 1;

    let data, count, error;
    if (search) {
      const searchWords = search.trim().split(/\s+/).filter(Boolean);
      const searchParam = searchWords.join(" & ");
      ({ data, count, error } = await supabase
        .from("member")
        .select("*", { count: "exact" })
        .order("id", { ascending: true })
        .textSearch("name_surname", searchParam)
        .range(pageStart, pageEnd));
    } else {
      ({ data, count, error } = await supabase
        .from("member")
        .select("*", { count: "exact" })
        .order("id", { ascending: true })
        .range(pageStart, pageEnd));
    }

    if (error) throw error;

    const total = count || 0;
    const dataNormalized = data ? (fromSnakeToCamelCase(data) as Member[]) : [];

    return {
      members: extendWithStatus(dataNormalized),
      maxPageParam: Math.floor(total / membersPerPage),
    };
  }

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
    <>
      <div className="flex justify-between">
        <div className="flex flex-wrap items-baseline">
          <div className="mr-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="my-6">
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
    </>
  );
}
