import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Home() {
  return (
    <section className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Home</CardTitle>
          <CardDescription>Home</CardDescription>
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
