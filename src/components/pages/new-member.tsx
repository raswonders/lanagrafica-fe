import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import countries from "../../assets/countries.json";
import cities from "../../assets/cities.json";
import documents from "../../assets/documents.json";
import { delay, isAdult, isValidISODate } from "@/lib/utils";
import { useState } from "react";
import { InputField } from "../input-field";
import { Combobox } from "../combobox";
import { SelectField } from "../select-field";
import { DateField } from "../date-field";
import { PageLayout } from "../layouts/page-layout";

export function NewMember() {
  const { t, i18n } = useTranslation();
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const formSchema = z.object({
    name: z.string().min(1, { message: t("validation.required") }),
    surname: z.string().min(1, { message: t("validation.required") }),
    birthDate: z
      .string()
      .min(1, { message: t("validation.required") })
      .refine(isValidISODate, { message: t("validation.wrongDate") })
      .refine(isAdult, { message: t("validation.notAdult") }),
    birthPlace: z.string().min(1, { message: t("validation.required") }),
    state: z.string().min(1, { message: t("validation.required") }),
    docType: z.string().min(1, { message: t("validation.required") }),
    docId: z.string().min(1, { message: t("validation.required") }),
    email: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      birthDate: "",
      birthPlace: "",
      state: "Italy",
      docType: "",
      docId: "",
      email: "",
    },
  });

  const country = form.watch("state");
  const isItaly = country === "Italy";
  const resetForm = () => {
    form.reset();
    setCountrySearch("");
    setCitySearch("");
    setDay("");
    setMonth("");
    setYear("");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await delay(1500);
    resetForm();
  }

  return (
    <PageLayout>
      <div className="flex justify-center">
        <Card className="w-full flex flex-col items-center sm:max-w-md">
          <CardHeader className="w-full max-w-md">
            <CardTitle>{t("newMember.title")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-md">
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
                  name="state"
                  label={t("newMember.countryFieldLabel")}
                  data={countries.map((entry) => entry.en)}
                  search={countrySearch}
                  setSearch={setCountrySearch}
                />
                <Combobox
                  form={form}
                  name="birthPlace"
                  label={t("newMember.cityFieldLabel")}
                  data={cities}
                  search={citySearch}
                  setSearch={setCitySearch}
                  value={isItaly ? "" : country}
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
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="sm:self-end"
                >
                  {t("newMember.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
