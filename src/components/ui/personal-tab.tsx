import countries from "@/assets/countries.json";
import cities from "@/assets/cities.json";
import documents from "@/assets/documents.json";
import { useTranslation } from "react-i18next";
import { Combobox } from "./combobox";
import { DateField } from "./date-field";
import { InputField } from "./input-field";
import { SelectField } from "./select-field";
import { useState } from "react";
import { MemberExt } from "@/types/types";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "@radix-ui/react-tabs";

type PersonalTabProps = {
  form: UseFormReturn;
  row: MemberExt;
  day: string;
  month: string;
  year: string;
  setDay: React.Dispatch<React.SetStateAction<string>>;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  setYear: React.Dispatch<React.SetStateAction<string>>;
};

export function PersonalTab({
  form,
  row,
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
}: PersonalTabProps) {
  const { t, i18n } = useTranslation();
  const country = form.watch("country");
  const isItaly = country === "Italy";
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  return (
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
          name="birth_date"
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
          name="birth_place"
          label={t("newMember.cityFieldLabel")}
          data={[i18n.language === "it" ? "__Altro__" : "__Other__", ...cities]}
          search={citySearch}
          setSearch={setCitySearch}
          value={
            isItaly
              ? cities.includes(row.birth_place || "")
                ? row.birth_place || ""
                : ""
              : country || ""
          }
          disabled={!isItaly}
        />
        <SelectField
          form={form}
          name="doc_type"
          label={t("newMember.docTypeFieldLabel")}
          data={documents.map((entry) =>
            i18n.language === "it" ? entry.it : entry.en,
          )}
        />
        <InputField
          form={form}
          label={t("newMember.docIdFieldLabel")}
          name="doc_id"
        />
        <InputField
          form={form}
          label={t("newMember.emailFieldLabel")}
          name="email"
        />
      </div>
    </TabsContent>
  );
}
