import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  return <PageLayout title={t("home.title")}></PageLayout>;
}
