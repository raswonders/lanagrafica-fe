import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  createDateString,
  parseDay,
  parseMonth,
  parseYear,
  isAdult,
  isValidISODate,
  getCustomDate,
  hasExpired,
  getDateWeekLater,
  getDateMonthsLater,
  fromCamelToSnakeCase,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Ban, RefreshCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Textarea } from "./textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge } from "./status-badge";
import { useWindowSize } from "@/hooks/use-window-size";
import { UpdateMutation } from "@/hooks/use-table-mutations";
import { Member, MemberDTO } from "@/types";
import { PersonalTab } from "./personal-tab";

export function MemberDetails({
  row,
  updateMutation,
  children,
  variant = "personal",
}: {
  row: Member;
  updateMutation: UpdateMutation;
  children: React.ReactNode;
  variant?: "personal" | "membership" | "note";
}) {
  const { t } = useTranslation();
  const [day, setDay] = useState(parseDay(row.birthDate));
  const [month, setMonth] = useState(parseMonth(row.birthDate));
  const [year, setYear] = useState(parseYear(row.birthDate));
  const focusDelay = 50;
  const isMobile = useWindowSize();

  const formSchema = z.object({
    name: z.string().min(1, { message: t("validation.required") }),
    surname: z.string().min(1, { message: t("validation.required") }),
    birthDate: z
      .string()
      .min(1, { message: t("validation.required") })
      .refine(isValidISODate, { message: t("validation.wrongDate") })
      .refine(isAdult, { message: t("validation.notAdult") }),
    birthPlace: z.string().min(1, { message: t("validation.required") }),
    country: z.string().min(1, { message: t("validation.required") }),
    docType: z.string().min(1, { message: t("validation.required") }),
    docId: z.string().min(1, { message: t("validation.required") }),
    email: z.string(),
    measure: z.string().refine((measure) => measure || !isSuspended, {
      message: t("validation.required"),
    }),
    note: z.string(),
    suspendedTill: z.string(),
    expirationDate: z.string(),
  });

  const form = useForm<Member>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: row.name,
      surname: row.surname,
      birthDate: createDateString(day, month, year),
      birthPlace: row.birthPlace,
      country: row.country,
      docType: row.docType,
      docId: row.docId,
      email: row.email || "",
      measure: row.measure || "",
      note: row.note || "",
      suspendedTill: row.suspendedTill || "",
      expirationDate: row.expirationDate || "",
    },
  });

  const { isDirty } = form.formState;

  function serializeForUpdate<T extends Member>(row: T): MemberDTO {
    const updatedRow: Record<string, unknown> = { isActive: isActive };

    for (let key in row) {
      updatedRow[key] = row[key] || null;
    }

    return fromCamelToSnakeCase(updatedRow as Member);
  }

  async function onSubmit(member: Member) {
    const serializedMember = serializeForUpdate(member);
    await updateMutation.mutate({
      id: row.id,
      details: serializedMember,
      name: row.name,
    });
    setOpen(false);
  }

  const isSuspended: boolean = Boolean(form.watch("suspendedTill"));
  const isExpired = hasExpired(new Date(form.watch("expirationDate")));
  const isRenewAllowed = !isSuspended && isExpired;
  const isActive = !isSuspended && !isExpired;
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {isMobile ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>{children}</SheetTrigger>
            </TooltipTrigger>
            <TooltipContent className={variant === "note" ? "max-w-96" : ""}>
              {variant === "personal" && t("membersTable.editMember")}
              {variant === "note" && row.note}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <SheetContent className="overflow-y-scroll w-full">
        <SheetHeader>
          <SheetTitle>
            <div className="flex gap-2">
              {`${row.name} ${row.surname}`}
              <StatusBadge status={row.status} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex justify-center">
          <Tabs defaultValue={variant} className="w-full space-y-6">
            <TabsList>
              <TabsTrigger value="personal">
                {t("memberDetails.personalTab")}
              </TabsTrigger>
              <TabsTrigger value="membership">
                {t("memberDetails.membershipTab")}
              </TabsTrigger>
              <TabsTrigger value="note">
                {t("memberDetails.noteTab")}
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="personal">
                  <PersonalTab
                    form={form}
                    day={day}
                    month={month}
                    year={year}
                    setDay={setDay}
                    setMonth={setMonth}
                    setYear={setYear}
                    row={row}
                  />
                </TabsContent>
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
                              value={getCustomDate(
                                form.watch("expirationDate"),
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex">
                      <Button
                        disabled={
                          form.formState.isSubmitting || !isRenewAllowed
                        }
                        type="button"
                        variant="active"
                        className="self-start"
                        onClick={() =>
                          form.setValue(
                            "expirationDate",
                            getDateMonthsLater(12),
                            {
                              shouldDirty: true,
                            },
                          )
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
                            <FormLabel>
                              {t("memberDetails.suspended")}
                            </FormLabel>
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
                              <FormLabel>
                                {t("memberDetails.suspensionLabel")}
                              </FormLabel>
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
                                disabled={
                                  form.formState.isSubmitting || isSuspended
                                }
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
                                      form.setValue(
                                        "suspendedTill",
                                        getDateWeekLater(),
                                        {
                                          shouldDirty: true,
                                        },
                                      );
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
                                      form.setValue(
                                        "suspendedTill",
                                        getDateMonthsLater(1),
                                        {
                                          shouldDirty: true,
                                        },
                                      );
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
                                      form.setValue(
                                        "suspendedTill",
                                        getDateMonthsLater(3),
                                        {
                                          shouldDirty: true,
                                        },
                                      );
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
                                      form.setValue(
                                        "suspendedTill",
                                        getDateMonthsLater(6),
                                        {
                                          shouldDirty: true,
                                        },
                                      );
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
                                      form.setValue(
                                        "suspendedTill",
                                        getDateMonthsLater(12),
                                        {
                                          shouldDirty: true,
                                        },
                                      );
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
                </TabsContent>
                <TabsContent value="note">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("memberDetails.noteLabel")}</FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <Button
                  disabled={!isDirty || form.formState.isSubmitting}
                  type="submit"
                  className="w-full mt-8"
                >
                  {t("memberDetails.save")}
                </Button>
              </form>
            </Form>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
