import { Button } from "./button";
import { UseFormReturn } from "react-hook-form";
import { MemberExt } from "@/types/types";

const focusDelay = 50;

type SuspendPopoverItemProps = {
  form: UseFormReturn<MemberExt>;
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
        form.setValue("suspended_till", period, {
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
