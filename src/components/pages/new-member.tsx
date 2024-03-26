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
import { delay, isValidISODate } from "@/lib/utils";
import { useState } from "react";
import { ResetButton } from "../reset-button";
import { InputField } from "../input-field";
import { Combobox } from "../combobox";
import { SelectField } from "../select-field";
import { DateField } from "../date-field";

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
      .refine(isValidISODate, { message: t("validation.wrongDate") }),
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
      state: "Italia",
      docType: "",
      docId: "",
      email: "",
    },
  });

  const isItaly = form.watch("state") === "Italia";
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
    form.reset();
  }

  return (
    <section className="p-8 pt-24 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("newMember.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                data={countries.map((entry) => entry.name)}
                search={countrySearch}
                setSearch={setCountrySearch}
              />

              {isItaly && (
                <Combobox
                  form={form}
                  name="birthPlace"
                  label={t("newMember.cityFieldLabel")}
                  data={cities}
                  search={citySearch}
                  setSearch={setCitySearch}
                />
              )}

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

              <div className="flex justify-between">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {t("newMember.submit")}
                </Button>
                <ResetButton
                  disabled={form.formState.isSubmitting}
                  resetForm={resetForm}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
