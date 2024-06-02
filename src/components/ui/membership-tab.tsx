import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Member } from "@/types";
import { getCustomDate, getDateMonthsLater, getDateWeekLater } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { Ban, RefreshCcw } from "lucide-react";
import { Textarea } from "./textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type MembershipTabProps = {
  form: UseFormReturn<Member>;
  row: Member;
  isExpired: boolean;
  isSuspended: boolean;
};

export function MembershipTab({
  form,
  row,
  isExpired,
  isSuspended,
}: MembershipTabProps) {
  const { t } = useTranslation();
  const isRenewAllowed = !isSuspended && isExpired;
  const focusDelay = 50;

  return (
    <div className="flex flex-col space-y-8">
      <FormField
        name="registrationDate"
        render={() => (
          <FormItem>
            <FormLabel>{t("memberDetails.registered")}</FormLabel>
            <FormControl>
              <Input
                disabled={true}
                value={getCustomDate(row.registrationDate)}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expirationDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {isExpired
                ? t("memberDetails.expired")
                : t("memberDetails.expires")}
            </FormLabel>
            <FormControl>
              <Input
                disabled={true}
                placeholder={t("memberDetails.notSuspended")}
                {...field}
                value={getCustomDate(form.watch("expirationDate"))}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex">
        <Button
          disabled={form.formState.isSubmitting || !isRenewAllowed}
          type="button"
          variant="active"
          className="self-start"
          onClick={() =>
            form.setValue("expirationDate", getDateMonthsLater(12), {
              shouldDirty: true,
            })
          }
        >
          <RefreshCcw className={`w-5 mr-3`} />
          {t("memberDetails.renew")}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="suspendedTill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("memberDetails.suspended")}</FormLabel>
              <FormControl>
                <Input
                  disabled={true}
                  placeholder={t("memberDetails.notSuspended")}
                  {...field}
                  value={
                    isSuspended
                      ? getCustomDate(form.watch("suspendedTill"))
                      : ""
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-6">
          <FormField
            control={form.control}
            name="measure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("memberDetails.suspensionLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={!isSuspended}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSuspended ? (
            <Button
              disabled={form.formState.isSubmitting}
              type="button"
              variant="suspended"
              className="self-start"
              onClick={() => {
                form.setValue("suspendedTill", "", {
                  shouldDirty: true,
                });
                form.setValue("measure", "", {
                  shouldDirty: true,
                });
              }}
            >
              <Ban className={"w-5 mr-3"} />
              {t("memberDetails.resume")}
            </Button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
