import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";
import { DataTable } from "../members-table";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { SearchBar } from "../searchbar";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function Members() {
  const { t } = useTranslation();
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);

  return (
    <PageLayout>
      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-6">
          <Button variant="outline">
            <Plus className="w-4 sm:mr-2" />
            <span className="hidden sm:inline-block">
              {t("members.addMember")}
            </span>
          </Button>
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
