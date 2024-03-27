import { PageLayout } from "../layouts/page-layout";
import { useTranslation } from "react-i18next";

export function Members() {
  const { t } = useTranslation();

  return <PageLayout title={t("members.title")}></PageLayout>;
}
