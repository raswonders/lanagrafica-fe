import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";
import { DataTable } from "../members-table";
import { Separator } from "@/components/ui/separator";

export function Members() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("members.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator />
          <DataTable />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
