import {
  ColumnDef,
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

type Member = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

const dummyData: Member[] = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", active: true },
  { id: "2", name: "Jane Doe", email: "jane.doe@example.com", active: false },
  { id: "3", name: "Bob Smith", email: "bob.smith@example.com", active: true },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    active: false,
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    active: true,
  },
  {
    id: "6",
    name: "Megan Davis",
    email: "megan.davis@example.com",
    active: false,
  },
  {
    id: "7",
    name: "Tom Thompson",
    email: "tom.thompson@example.com",
    active: true,
  },
  {
    id: "8",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    active: false,
  },
  {
    id: "9",
    name: "Michael Robinson",
    email: "michael.robinson@example.com",
    active: true,
  },
  {
    id: "10",
    name: "Grace Cox",
    email: "grace.cox@example.com",
    active: false,
  },
];
const data = dummyData;

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "active",
    header: "Active",
  },
];

export function DataTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
