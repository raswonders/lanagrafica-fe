import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Cards() {
  return (
    <section className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
          <CardDescription>Cards</CardDescription>
        </CardHeader>
        <CardContent>
          <p>content</p>
        </CardContent>
        <CardFooter>
          <p>footer</p>
        </CardFooter>
      </Card>
    </section>
  );
}
