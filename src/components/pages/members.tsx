import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";
import { DataTable } from "../members-table";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { SearchBar } from "../searchbar";

export function Members() {
  const { t } = useTranslation();
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);

  return (
    <PageLayout>
      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-6">
          <CardTitle>{t("members.title")}</CardTitle>
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
