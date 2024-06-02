import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Member } from "@/types";
import { getCustomDate, getDateMonthsLater } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { Ban, RefreshCcw } from "lucide-react";
import { Textarea } from "./textarea";
import { TabsContent } from "@radix-ui/react-tabs";
import { SuspendPopover } from "./suspend-popover";

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

  return (
    <TabsContent value="membership">
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
              <SuspendPopover form={form} isSuspended={isSuspended} />
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
