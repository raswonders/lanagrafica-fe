import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
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

import { useEffect, useState } from "react";
import { supabase } from "@/components/supabase";

type Member = {
  name: string;
  province: string;
  birthDate: string;
  birthPlace: string;
  email: string;
  docType: string;
  docId: string;
  country: string;
};

const columnHelper = createColumnHelper<Member>();
export const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: () => <span>Email</span>,
  }),
];

export function DataTable() {
  const [data, setData] = useState<Member[]>([]);

  const table = useReactTable<Member>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    async function fetchMembers() {
      const { data } = await supabase
        .from("member")
        .select();

      if (data) setData(data);
    }

    fetchMembers();
  }, []);

  return (
    <div className="rounded-md border">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
