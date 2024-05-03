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
};

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "./ui/checkbox";
import { EyeOff, Filter, RefreshCcw, SquarePen } from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { RenewConfirm } from "./renew-confirm";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MemberDetails } from "./member-details";
import { StatusBadge } from "./status-badge";

const columnHelper = createColumnHelper<Member>();
const membersPerPage = 20;

export type RenewMutation = {
  mutate: (args: { id: number; expirationDate: string; name: string }) => void;
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

async function suspendMember(
  id: number,
  suspendedTill: string,
  measure: string,
): Promise<Member | null> {
  const { data, error } = await supabase
    .from("member")
    .update({
      suspended_till: suspendedTill,
      is_active: false,
      measure,
    })
    .eq("id", id);

  if (error) throw error;

  return data;
}

async function resumeMember(
  id: number,
  expirationDate: string,
): Promise<Member | null> {
  const { data, error } = await supabase
    .from("member")
    .update({
      suspended_till: null,
      measure: null,
      is_active: !hasExpired(new Date(expirationDate)),
    })
    .eq("id", id);

  if (error) throw error;

  return data;
}

export function DataTable({ search }: { search: string | null }) {
  const { t } = useTranslation();
  const [isRenewing, setIsRenewing] = useState<Record<string, undefined>>({});
  const queryClient = useQueryClient();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const suspendMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      suspendedTill: string;
      measure: string;
      expirationDate: string;
      name: string;
    }) =>
      suspendMember(variables.id, variables.suspendedTill, variables.measure),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("membersTable.suspendSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("membersTable.suspendError"), error);
      toast.error(
        t("membersTable.renewError", {
          name: variables.name,
        }),
      );
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      expirationDate: string;
      name: string;
    }) => resumeMember(variables.id, variables.expirationDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("membersTable.resumeSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("membersTable.resumeError"), error);
      toast.error(
        t("membersTable.resumeError", {
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

          return (
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {isMobile ? (
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <SquarePen className="w-5" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              {`${row.original.name} ${row.original.surname}`}
                            </DrawerTitle>
                            <DrawerDescription>
                              <MemberDetails
                                row={row.original}
                                isRenewing={isRenewing}
                                renewMutation={renewMutation}
                                suspendMutation={suspendMutation}
                                resumeMutation={resumeMutation}
                              />
                            </DrawerDescription>
                          </DrawerHeader>
                        </DrawerContent>
                      </Drawer>
                    ) : (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <SquarePen className="w-5" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>
                              <div className="flex gap-2 my-4">
                                {`${row.original.name} ${row.original.surname}`}
                                <StatusBadge status={row.original.status} />
                              </div>
                            </SheetTitle>
                            <SheetDescription>
                              <MemberDetails
                                row={row.original}
                                isRenewing={isRenewing}
                                renewMutation={renewMutation}
                                suspendMutation={suspendMutation}
                                resumeMutation={resumeMutation}
                              />
                            </SheetDescription>
                          </SheetHeader>
                        </SheetContent>
                      </Sheet>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("membersTable.editMember")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <RenewConfirm
                      isOpenForbidden={isRenewForbidden}
                      id={row.original.id}
                      name={`${row.original.name} ${row.original.surname}`}
                      expirationDate={row.original.expirationDate}
                      renewMutation={renewMutation}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isRenewForbidden}
                      >
                        <RefreshCcw className={`w-5`} />
                      </Button>
                    </RenewConfirm>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("membersTable.renewMember")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      },
    ],
    [t, isRenewing, isMobile],
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
