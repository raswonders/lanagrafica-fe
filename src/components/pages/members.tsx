import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";

export function Members() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("members.title")}</CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
