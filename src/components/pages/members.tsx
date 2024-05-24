import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { DataTable } from "../members-table";

export function Members() {
  return (
    <PageLayout>
      <Card>
        <CardContent>
          <DataTable />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
