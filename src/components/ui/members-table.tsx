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
import loadingAnimation from "@/assets/loading.json";
import Lottie from "lottie-react";

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
          birth_date: false,
          email: false,
          suspended_till: false,
          expiration_date: false,
          card_number: false,
          is_active: false,
          is_deleted: false,
        }
      : {
          email: false,
          suspended_till: false,
          expiration_date: false,
          is_active: false,
          is_deleted: false,
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
  const rows = useMemo(() => {
    return (
      data?.pages.reduce((acc, page) => {
        return [...acc, ...page];
      }, []) ?? []
    );
  }, [data]);
  const table = useReactTable({
    state: {
      columnVisibility,
      columnFilters,
    },
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    const rowsCount = table.getRowModel().rows?.length;
    if (hasNextPage && rowsCount < membersPerPage) fetchNextPage();
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
        {/* TODO make error more nice */}
        {error ? (
          <div className="flex items-center justify-center">
            <div>
              {t("errors.membersDidNotLoad")}: {error.name}: {error.message}
            </div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={rows ? rows.length : 0}
            next={() => fetchNextPage()}
            hasMore={hasNextPage}
            loader={
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                autoplay={true}
                className="h-8 my-2"
              />
            }
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
                      data-row="true"
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
                    <TableCell colSpan={columns.length} className="text-center">
                      {isPending ? (
                        <Lottie
                          animationData={loadingAnimation}
                          loop={true}
                          autoplay={true}
                          className="h-8"
                        />
                      ) : (
                        t("membersTable.noResults")
                      )}
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
