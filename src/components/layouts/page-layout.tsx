import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type PagePropsProps = {
  title: string;
  children?: ReactNode;
};

export function PageLayout({ title, children }: PagePropsProps) {
  return (
    <section className="sm:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}
