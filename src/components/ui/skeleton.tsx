import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-2 dark:bg-neutral-7",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
