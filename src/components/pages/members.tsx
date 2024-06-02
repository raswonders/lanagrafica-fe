import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "../layouts/page-layout";
import { MembersTable } from "../ui/members-table";

export function Members() {
  return (
    <PageLayout>
      <Card>
        <CardContent>
          <MembersTable />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
