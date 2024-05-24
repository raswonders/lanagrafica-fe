import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { DataTable } from "../members-table";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { SearchBar } from "../searchbar";
import { AddMember } from "../add-member";

export function Members() {
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);

  return (
    <PageLayout>
      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-6">
          <AddMember />
          <SearchBar setDebouncedSearch={setDebouncedSearch} />
        </CardHeader>
        <CardContent>
          <Separator />
          <DataTable search={debouncedSearch} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
