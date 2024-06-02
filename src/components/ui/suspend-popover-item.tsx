import { Button } from "./button";
import { UseFormReturn } from "react-hook-form";
import { Member } from "@/types";

const focusDelay = 50;

type SuspendPopoverItemProps = {
  form: UseFormReturn<Member>;
  title: string;
  period: string;
};

export function SuspendPopoverItem({
  form,
  title,
  period,
}: SuspendPopoverItemProps) {
  return (
    <Button
      size="sm"
      variant="suspended"
      onClick={() => {
        form.setValue("suspendedTill", period, {
          shouldDirty: true,
        });
        setTimeout(() => {
          form.setFocus("measure");
        }, focusDelay);
      }}
    >
      {title}
    </Button>
  );
}
