import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "./ui/form";
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
} from "@/lib/utils";
import countries from "../assets/countries.json";
import cities from "../assets/cities.json";
import documents from "../assets/documents.json";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Ban, PlayCircle, RefreshCcw } from "lucide-react";

export function MemberDetails({ row }) {
  const { t, i18n } = useTranslation();
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [day, setDay] = useState(parseDay(row.birthDate));
  const [month, setMonth] = useState(parseMonth(row.birthDate));
  const [year, setYear] = useState(parseYear(row.birthDate));

  const isSuspended = Boolean(row.suspendedTill);

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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const newMember = serializeForInsert(values);
    // await insertMember(newMember);
    // resetForm();
    console.log("Updated", values);
  }

  const country = form.watch("country");
  const isItaly = country === "Italy";

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
        <TabsContent value="personal">
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col"
              >
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
              </form>
            </Form>
          </div>
        </TabsContent>
        <TabsContent value="membership">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="text-neutral-12 font-semibold">
                  {t("memberDetails.registered")}
                </div>
                <div>{getCustomDate(row.registrationDate)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-neutral-12 font-semibold">
                  {t("memberDetails.expires")}
                </div>
                <div>{getCustomDate(row.expirationDate)}</div>
              </div>
              <div className="flex">
                <Button
                  disabled={
                    form.formState.isSubmitting ||
                    !hasExpired(new Date(row.expirationDate))
                  }
                  type="button"
                  variant="active"
                  className="sm:self-end"
                >
                  <RefreshCcw className={`w-5 mr-3`} />
                  {t("memberDetails.renew")}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="text-neutral-12 font-semibold">
                  {t("memberDetails.suspended")}
                </div>
                <div>
                  {isSuspended
                    ? getCustomDate(row.suspendedTill)
                    : t("memberDetails.notSuspended")}
                </div>
              </div>
              <div className="flex">
                {isSuspended ? (
                  <Button
                    disabled={form.formState.isSubmitting}
                    type="button"
                    variant="active"
                    className="sm:self-end"
                  >
                    <PlayCircle className={"w-5 mr-3"} />
                    {t("memberDetails.resume")}
                  </Button>
                ) : (
                  <Button
                    disabled={form.formState.isSubmitting || isSuspended}
                    type="button"
                    variant="suspended"
                    className="sm:self-end"
                  >
                    <Ban className={"w-5 mr-3"} />
                    {t("memberDetails.suspend")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="note">No note.</TabsContent>
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="sm:self-end"
        >
          {t("newMember.submit")}
        </Button>
      </Tabs>
    </div>
  );
}
