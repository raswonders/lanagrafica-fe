import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NewMember } from "../new-member";
import { Demo } from "../demo";

export function Members() {
  return (
    <section className="p-8 pt-24">
      <Card>
        <CardHeader></CardHeader>
        <CardContent className="flex justify-center">
          <NewMember />
        </CardContent>
      </Card>
    </section>
  );
}
