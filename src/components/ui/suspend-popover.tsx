import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import { Member } from "@/types";
import { getDateMonthsLater, getDateWeekLater } from "@/lib/utils";

type SuspendPopoverProps = {
  form: UseFormReturn<Member>;
  isSuspended: boolean;
};

export function SuspendPopover({ form, isSuspended }: SuspendPopoverProps) {
  const { t } = useTranslation();
  const focusDelay = 50;

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
            <Button
              size="sm"
              variant="suspended"
              onClick={() => {
                form.setValue("suspendedTill", getDateWeekLater(), {
                  shouldDirty: true,
                });
                setTimeout(() => {
                  form.setFocus("measure");
                }, focusDelay);
              }}
            >
              {t("durations.week", { count: 1 })}
            </Button>
          </li>
          <li>
            <Button
              size="sm"
              variant="suspended"
              onClick={() => {
                form.setValue("suspendedTill", getDateMonthsLater(1), {
                  shouldDirty: true,
                });
                setTimeout(() => {
                  form.setFocus("measure");
                }, focusDelay);
              }}
            >
              {t("durations.month", { count: 1 })}
            </Button>
          </li>
          <li>
            <Button
              size="sm"
              variant="suspended"
              onClick={() => {
                form.setValue("suspendedTill", getDateMonthsLater(3), {
                  shouldDirty: true,
                });
                setTimeout(() => {
                  form.setFocus("measure");
                }, focusDelay);
              }}
            >
              {t("durations.month", { count: 3 })}
            </Button>
          </li>
          <li>
            <Button
              size="sm"
              variant="suspended"
              onClick={() => {
                form.setValue("suspendedTill", getDateMonthsLater(6), {
                  shouldDirty: true,
                });
                setTimeout(() => {
                  form.setFocus("measure");
                }, focusDelay);
              }}
            >
              {t("durations.month", { count: 6 })}
            </Button>
          </li>
          <li>
            <Button
              size="sm"
              variant="suspended"
              onClick={() => {
                form.setValue("suspendedTill", getDateMonthsLater(12), {
                  shouldDirty: true,
                });
                setTimeout(() => {
                  form.setFocus("measure");
                }, focusDelay);
              }}
            >
              {t("durations.year", { count: 1 })}
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
