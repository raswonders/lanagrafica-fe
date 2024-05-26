import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputField } from "./input-field";
import { DateField } from "./date-field";
import { Combobox } from "./combobox";
import { SelectField } from "./select-field";
import { Button } from "./ui/button";
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
  isWithinRange,
  getCustomDate,
  hasExpired,
  getDateWeekLater,
  getDateMonthsLater,
  fromCamelToSnakeCase,
} from "@/lib/utils";
import countries from "../assets/countries.json";
import cities from "../assets/cities.json";
import documents from "../assets/documents.json";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Ban, RefreshCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SerializedMember } from "./pages/new-member";
import { Member, UpdateMutation } from "./members-table";
import { Input } from "./ui/input";
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

export function MemberDetails({
  row,
  updateMutation,
  children,
  isMobile,
  variant = "personal",
}: {
  row: Member;
  updateMutation: UpdateMutation;
  children: React.ReactNode;
  isMobile: boolean;
  variant?: "personal" | "membership" | "note";
}) {
  const { t, i18n } = useTranslation();
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [day, setDay] = useState(parseDay(row.birthDate));
  const [month, setMonth] = useState(parseMonth(row.birthDate));
  const [year, setYear] = useState(parseYear(row.birthDate));
  const focusDelay = 50;

  const formSchema = z.object({
    name: z.string().min(1, { message: t("validation.required") }),
    surname: z.string().min(1, { message: t("validation.required") }),
    birthDate: z
      .string()
      .min(1, { message: t("validation.required") })
      .refine(isValidISODate, { message: t("validation.wrongDate") })
      .refine(isWithinRange, { message: t("validation.notInRange") })
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

  const form = useForm<z.infer<typeof formSchema>>({
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
  interface ExtendedRow extends z.infer<typeof formSchema> {
    [key: string]: unknown;
    isActive: boolean;
  }

  function serializeForUpdate(
    row: z.infer<typeof formSchema>,
  ): Partial<SerializedMember> {
    const extended: ExtendedRow = {
      ...row,
      isActive: isActive,
    };

    Object.keys(extended).forEach((key: string) => {
      extended[key] = extended[key] || null;
    });

    return fromCamelToSnakeCase(extended);
  }

  async function onSubmit(member: z.infer<typeof formSchema>) {
    const serializedMember = serializeForUpdate(member);
    console.log("member", member);
    console.log("serialized", serializedMember);
    await updateMutation.mutate({
      id: row.id,
      details: serializedMember,
      name: row.name,
    });
    setOpen(false);
  }

  const country = form.watch("country");
  const isItaly = country === "Italy";
  const isSuspended: boolean = Boolean(form.watch("suspendedTill"));
  const isExpired: boolean = hasExpired(new Date(form.watch("expirationDate")));
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
                  <div className="space-y-8 flex flex-col">
                    <InputField
                      form={form}
                      label={t("newMember.nameFieldLabel")}
                      name="name"
                    />
                    <InputField
                      form={form}
                      label={t("newMember.surnameFieldLabel")}
                      name="surname"
                    />
                    <DateField
                      form={form}
                      label={t("newMember.dateFieldLabel")}
                      name="birthDate"
                      day={day}
                      month={month}
                      year={year}
                      setDay={setDay}
                      setMonth={setMonth}
                      setYear={setYear}
                    />
                    <Combobox
                      form={form}
                      name="country"
                      label={t("newMember.countryFieldLabel")}
                      data={[
                        i18n.language === "it" ? "__Altro__" : "__Other__",
                        ...countries.map((entry) => entry.en),
                      ]}
                      search={countrySearch}
                      setSearch={setCountrySearch}
                    />
                    <Combobox
                      form={form}
                      name="birthPlace"
                      label={t("newMember.cityFieldLabel")}
                      data={[
                        i18n.language === "it" ? "__Altro__" : "__Other__",
                        ...cities,
                      ]}
                      search={citySearch}
                      setSearch={setCitySearch}
                      value={
                        isItaly
                          ? cities.includes(row.birthPlace)
                            ? row.birthPlace
                            : ""
                          : country
                      }
                      disabled={!isItaly}
                    />
                    <SelectField
                      form={form}
                      name="docType"
                      label={t("newMember.docTypeFieldLabel")}
                      data={documents.map((entry) =>
                        i18n.language === "it" ? entry.it : entry.en,
                      )}
                    />
                    <InputField
                      form={form}
                      label={t("newMember.docIdFieldLabel")}
                      name="docId"
                    />
                    <InputField
                      form={form}
                      label={t("newMember.emailFieldLabel")}
                      name="email"
                    />
                  </div>
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
