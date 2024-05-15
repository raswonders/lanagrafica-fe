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

export function MemberDetails({
  row,
  updateMutation,
}: {
  row: Member;
  updateMutation: UpdateMutation;
}) {
  const { t, i18n } = useTranslation();
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [day, setDay] = useState(parseDay(row.birthDate));
  const [month, setMonth] = useState(parseMonth(row.birthDate));
  const [year, setYear] = useState(parseYear(row.birthDate));
  const [suspendedTill, setSuspendedTill] = useState(row.suspendedTill);
  const [expirationDate, setExpirationDate] = useState(row.expirationDate);
  const isSuspended = Boolean(suspendedTill);

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
    email: z.string().nullish(),
    measure: z
      .string()
      .nullish()
      .refine((measure) => measure || !isSuspended, {
        message: t("validation.required"),
      }),
    note: z.string().nullish(),
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
      email: row.email,
      measure: row.measure,
      note: row.note,
    },
  });
  interface ExtendedRow extends z.infer<typeof formSchema> {
    [key: string]: unknown;
    expirationDate: string;
    suspendedTill: string;
    isActive: boolean;
  }

  function serializeForUpdate(
    row: z.infer<typeof formSchema>,
  ): Partial<SerializedMember> {
    const extended: ExtendedRow = {
      ...row,
      expirationDate,
      suspendedTill,
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
  }

  const country = form.watch("country");
  const isItaly = country === "Italy";
  const isExpired = hasExpired(new Date(expirationDate));
  const isRenewForbidden =
    row.status === "active" ||
    row.status === "suspended" ||
    row.status === "deleted";
  const isActive = !isSuspended && !isExpired;

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="personal" className="w-[400px] space-y-6">
        <TabsList>
          <TabsTrigger value="personal">
            {t("memberDetails.personalTab")}
          </TabsTrigger>
          <TabsTrigger value="membership">
            {t("memberDetails.membershipTab")}
          </TabsTrigger>
          <TabsTrigger value="note">{t("memberDetails.noteTab")}</TabsTrigger>
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
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="text-neutral-12 font-semibold">
                      {t("memberDetails.registered")}
                    </div>
                    <div>{getCustomDate(row.registrationDate)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className={`text-neutral-12 font-semibold`}>
                      {isExpired
                        ? t("memberDetails.expired")
                        : t("memberDetails.expires")}
                    </div>
                    <div>{getCustomDate(expirationDate)}</div>
                  </div>
                  <div className="flex">
                    <Button
                      disabled={form.formState.isSubmitting || isRenewForbidden}
                      type="button"
                      variant="active"
                      className="self-start"
                      onClick={() => setExpirationDate(getDateMonthsLater(12))}
                    >
                      <RefreshCcw className={`w-5 mr-3`} />
                      {t("memberDetails.renew")}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className={`text-neutral-12 font-semibold`}>
                      {t("memberDetails.suspended")}
                    </div>
                    <div>
                      {isSuspended
                        ? getCustomDate(suspendedTill)
                        : t("memberDetails.notSuspended")}
                    </div>
                  </div>
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
                            <Textarea className="resize-none" {...field} />
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
                          setSuspendedTill("");
                          form.setValue("measure", "");
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
                                  setSuspendedTill(getDateWeekLater());
                                }}
                              >
                                week
                              </Button>
                            </li>
                            <li>
                              <Button
                                size="sm"
                                variant="suspended"
                                onClick={() => {
                                  setSuspendedTill(getDateMonthsLater(1));
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
                                  setSuspendedTill(getDateMonthsLater(3));
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
                                  setSuspendedTill(getDateMonthsLater(6));
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
                                  setSuspendedTill(getDateMonthsLater(12));
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
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              type="submit"
              className="w-full mt-8"
            >
              {t("memberDetails.save")}
            </Button>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
