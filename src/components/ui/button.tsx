import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-8 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-neutral-9",
  {
    variants: {
      variant: {
        default:
          "bg-accent-9 text-neutral-1 dark:text-neutral-12 hover:bg-accent-10",
        destructive:
          "bg-danger-9 text-neutral-1 dark:text-neutral-12 hover:bg-danger-10",
        outline:
          "border border-accent-7 text-accent-11 hover:border-accent-8 hover:bg-accent-3 dark:hover:bg-accent-2",
        secondary: "bg-accent-3 text-accent-11 hover:bg-accent-4",
        ghost:
          "text-accent-11 hover:bg-accent-3 dark:hover:bg-accent-2 hover:text-accent-foreground",
        link: "text-accent-11 underline-offset-2 hover:underline",
        select:
          "bg-accent-1 placeholder:text-neutral-11 border placeholder:text-neutral-11 font-normal",
        active: "bg-success-3 text-success-11 hover:bg-success-4",
        activeOutline:
          "border border-success-7 text-success-11 hover:border-success-8 hover:bg-success-3 dark:hover:bg-success-2",
        inactive: "bg-warning-4 text-warning-11 hover:bg-warning-5",
        inactiveOutline:
          "border border-warning-7 text-warning-11 hover:border-warning-8 hover:bg-warning-3 dark:hover:bg-warning-2",
        suspended: "bg-danger-3 text-danger-11 hover:bg-danger-4",
        suspendedOutline:
          "border border-danger-7 text-danger-11 hover:border-danger-8 hover:bg-danger-3 dark:hover:bg-danger-2",
        deleted: "bg-neutral-6 text-neutral-11 hover:bg-neutral-7",
        deletedOutline:
          "border border-neutral-7 text-neutral-11 hover:border-neutral-8 hover:bg-neutral-3 dark:hover:bg-neutral-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-4",
        xs: "h-6 rounded-md px-4 py-1 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 disabled:bg-transparent disabled:opacity-25",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
