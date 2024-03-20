import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import countries from "../assets/countries.json";
import cities from "../assets/cities.json";
import documents from "../assets/documents.json";
import { delay } from "@/lib/utils";
import React from "react";
import { ResetButton } from "./reset-button";
import { InputField } from "./input-field";
import { Combobox } from "./combobox";

export function NewMember() {
  const { t } = useTranslation();
  const [countrySearch, setCountrySearch] = React.useState("");
  const [citySearch, setCitySearch] = React.useState("");

  const formSchema = z.object({
    name: z.string().min(1, { message: t("validation.required") }),
    surname: z.string().min(1, { message: t("validation.required") }),
    birthDate: z.string().min(1, { message: t("validation.required") }),
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
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await delay(1500);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <UserPlus className="mr-1" />
          {t("newMember.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("newMember.title")}</DialogTitle>
        </DialogHeader>
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

            <InputField
              form={form}
              label={t("newMember.dateFieldLabel")}
              name="birthDate"
              type="date"
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

            <FormField
              control={form.control}
              name="docType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documents.map((doc) => {
                        const value = isItaly ? doc.it : doc.en;
                        return <SelectItem value={value}>{value}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
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
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
