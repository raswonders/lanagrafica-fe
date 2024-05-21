import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";
import { DataTable } from "../members-table";
import { Separator } from "@/components/ui/separator";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function Members() {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <PageLayout>
      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-6">
          <CardTitle>{t("members.title")}</CardTitle>
          <div className="w-[350px] relative">
            <Input
              id="searchInput"
              placeholder={t("members.searchPlaceholder")}
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  setDebouncedSearch((e.target as HTMLInputElement).value);
              }}
              className="pl-10"
            />
            <label
              htmlFor="searchInput"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className="w-5 text-accent-11" />
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <Separator />
          <DataTable search={debouncedSearch} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
