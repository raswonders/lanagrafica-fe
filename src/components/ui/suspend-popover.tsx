import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import { Member } from "@/types/types";
import { getDateMonthsLater, getDateWeekLater } from "@/lib/utils";
import { SuspendPopoverItem } from "./suspend-popover-item";

type SuspendPopoverProps = {
  form: UseFormReturn<Member>;
  isSuspended: boolean;
};

export function SuspendPopover({ form, isSuspended }: SuspendPopoverProps) {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={form.formState.isSubmitting || isSuspended}
          type="button"
          variant="suspended"
          className="self-start"
        >
          <Ban className={"w-5 mr-3"} />
          {t("memberDetails.suspend")}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="space-y-2">
          <li>
            <SuspendPopoverItem
              form={form}
              title={t("durations.week", { count: 1 })}
              period={getDateWeekLater()}
            />
          </li>
          <li>
            <SuspendPopoverItem
              form={form}
              title={t("durations.month", { count: 1 })}
              period={getDateMonthsLater(1)}
            />
          </li>
          <li>
            <SuspendPopoverItem
              form={form}
              title={t("durations.month", { count: 3 })}
              period={getDateMonthsLater(3)}
            />
          </li>
          <li>
            <SuspendPopoverItem
              form={form}
              title={t("durations.month", { count: 6 })}
              period={getDateMonthsLater(6)}
            />
          </li>
          <li>
            <SuspendPopoverItem
              form={form}
              title={t("durations.year", { count: 1 })}
              period={getDateMonthsLater(12)}
            />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
