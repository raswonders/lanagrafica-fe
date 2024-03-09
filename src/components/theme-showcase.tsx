import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "./mode-toggle";

export function ThemeShowcase() {
  return (
    <>
      <div className="p-4 fixed top-0 right-0">
        <ModeToggle />
      </div>
      <div className="flex flex-col items-start gap-24 p-4">
        <label>
          Muted backgrounds such as TabsList, Skeleton and Switch
          <ul>
            <li>--muted</li>
            <li>--muted-foreground</li>
          </ul>
          <Skeleton className="w-[400px] h-[20px]" />
        </label>
        <label>
          Background color for Card
          <ul>
            <li>--card</li>
            <li>--card-foreground</li>
          </ul>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </label>
        <label className="mb-8">
          Background color for popovers such as DropdownMenu, HoverCard, Popover
          <ul>
            <li>--popover</li>
            <li>--popover-foreground</li>
          </ul>
          <HoverCard open={true}>
            <HoverCardTrigger>Hover over me</HoverCardTrigger>
            <HoverCardContent>
              The React Framework – created and maintained by @vercel.
            </HoverCardContent>
          </HoverCard>
        </label>
        <label>
          Border color for inputs such as Input, Select, Textarea
          <ul>
            <li>--input</li>
          </ul>
          <Input />
        </label>
        <label>
          Primary colors for Button
          <ul>
            <li>--primary</li>
            <li>--primary-foreground</li>
          </ul>
          <Button>Primary</Button>
        </label>
        <label>
          Secondary colors for Button
          <ul>
            <li>--secondary</li>
            <li>--secondary-foreground</li>
          </ul>
          <Button variant="secondary">Secondary</Button>
        </label>
        <label>
          Used for destructive actions such as Button variant="destructive"
          <ul>
            <li>--destructive</li>
            <li>--destructive-foreground</li>
          </ul>
          <Button variant="destructive">Destrutive</Button>
        </label>
        <label>
          Used for accents such as hover effects on DropdownMenuItem,
          SelectItem...etc
          <ul>
            <li>--accent</li>
            <li>--accent-foreground</li>
          </ul>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label>
          Used for focus ring
          <ul>
            <li>--ring</li>
          </ul>
          <Input />
        </label>
      </div>
    </>
  );
}
