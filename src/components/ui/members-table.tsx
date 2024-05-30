import {
  ColumnFiltersState,
  VisibilityState,
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
import { Skeleton } from "./skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchBar } from "./searchbar";
import { Separator } from "@radix-ui/react-separator";
import { useMembersMutations } from "@/hooks/use-table-mutations";
import { AddMember } from "./add-member";
import { useWindowSize } from "@/hooks/use-window-size";
import { useMembersQuery } from "@/hooks/use-members-query";
import { FilterPopover } from "./filter-popover";
import { HideFieldsPopover } from "./hide-fields-popover";
import { useMembersColumns } from "@/hooks/use-members-columns";

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

const membersPerPage = 20;

export function MembersTable() {
  const { t } = useTranslation();
  const { insertMutation } = useMembersMutations();
  const isMobile = useWindowSize();
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    isMobile
      ? {
          birthDate: false,
          email: false,
          suspendedTill: false,
          expirationDate: false,
          cardNumber: false,
          isActive: false,
          isDeleted: false,
        }
      : {
          email: false,
          suspendedTill: false,
          expirationDate: false,
          isActive: false,
          isDeleted: false,
        },
  );

  // Query data
  const { isPending, error, data, fetchNextPage, hasNextPage, refetch } =
    useMembersQuery(debouncedSearch, membersPerPage);

  useEffect(() => {
    if (debouncedSearch !== null) refetch();
  }, [refetch, debouncedSearch]);

  // Build table
  const columns = useMembersColumns();
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
            <FilterPopover
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          </div>
        </div>
        <HideFieldsPopover
          table={table}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
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
