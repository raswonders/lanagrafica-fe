import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Members() {
  return (
    <section className="p-8 pt-24">
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Members</CardDescription>
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
