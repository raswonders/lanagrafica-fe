import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import countries from "@/assets/countries.json";
import cities from "@/assets/cities.json";
import documents from "@/assets/documents.json";
import {
  genCardNumber,
  getExpirationDate,
  getRegistrationDate,
  isAdult,
  isValidISODate,
} from "@/lib/utils";
import { useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Combobox } from "@/components/ui/combobox";
import { SelectField } from "@/components/ui/select-field";
import { DateField } from "@/components/ui/date-field";
import { Plus } from "lucide-react";
import { InsertMutation } from "@/hooks/use-table-mutations";
import { MemberInsert } from "@/types/types";

export function AddMember({
  insertMutation,
}: {
  insertMutation: InsertMutation;
}) {
  const { t, i18n } = useTranslation();
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, { message: t("validation.required") }),
    surname: z.string().min(1, { message: t("validation.required") }),
    birth_date: z
      .string()
      .min(1, { message: t("validation.required") })
      .refine(isValidISODate, { message: t("validation.wrongDate") })
      .refine(isAdult, { message: t("validation.notAdult") }),
    birth_place: z.string().min(1, { message: t("validation.required") }),
    country: z.string().min(1, { message: t("validation.required") }),
    doc_type: z.string().min(1, { message: t("validation.required") }),
    doc_id: z.string().min(1, { message: t("validation.required") }),
    email: z.string(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      birth_date: "",
      birth_place: "",
      country: "Italy",
      doc_type: "",
      doc_id: "",
      email: "",
    },
  });

  const country = form.watch("country");
  const isItaly = country === "Italy";

  function toInsert(data: FormData): MemberInsert {
    const updateFields = {
      ...data,
      registration_date: getRegistrationDate(),
      expiration_date: getExpirationDate(),
      card_number: genCardNumber(),
      is_active: true,
      is_deleted: false,
    };

    return updateFields;
  }

  async function onSubmit(data: FormData) {
    const memberSerialized = toInsert(data);
    await insertMutation.mutate({
      details: memberSerialized,
      name: memberSerialized.name || "",
    });
    resetForm();
    setOpen(false);
  }

  function resetForm() {
    setDay("");
    setMonth("");
    setYear("");
    setCountrySearch("");
    setCitySearch("");
    form.reset();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 sm:mr-2" />
          <span className="hidden sm:inline-block">
            {t("members.addMember")}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-full">
        <SheetHeader>
          <div className="flex gap-2">
            <SheetTitle>{t("members.addMember")}</SheetTitle>
          </div>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col"
          >
            <InputField
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              label={t("newMember.nameFieldLabel")}
              name="name"
            />
            <InputField
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              label={t("newMember.surnameFieldLabel")}
              name="surname"
            />
            <DateField
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              label={t("newMember.dateFieldLabel")}
              name="birth_date"
              day={day}
              month={month}
              year={year}
              setDay={setDay}
              setMonth={setMonth}
              setYear={setYear}
            />
            <Combobox
              // @ts-expect-error - due to FormData cannot be exported
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
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              name="birth_place"
              label={t("newMember.cityFieldLabel")}
              data={[
                i18n.language === "it" ? "__Altro__" : "__Other__",
                ...cities,
              ]}
              search={citySearch}
              setSearch={setCitySearch}
              value={isItaly ? "" : country || ""}
              disabled={!isItaly}
            />
            <SelectField
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              name="doc_type"
              label={t("newMember.docTypeFieldLabel")}
              data={documents.map((entry) =>
                i18n.language === "it" ? entry.it : entry.en,
              )}
            />
            <InputField
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              label={t("newMember.docIdFieldLabel")}
              name="doc_id"
            />
            <InputField
              // @ts-expect-error - due to FormData cannot be exported
              form={form}
              label={t("newMember.emailFieldLabel")}
              name="email"
            />
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full mt-8"
            >
              {t("newMember.submit")}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
