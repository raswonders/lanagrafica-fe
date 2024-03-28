import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("home.title")}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </PageLayout>
  );
}
