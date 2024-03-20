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

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "./ui/button";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import countries from "../assets/countries.json";
import cities from "../assets/cities.json";
import documents from "../assets/documents.json";
import { cn, delay } from "@/lib/utils";
import React from "react";
import { ResetButton } from "./reset-button";
import { InputField } from "./input-field";

export function NewMember() {
  const { t } = useTranslation();
  const [countrySearch, setCountrySearch] = React.useState("");
  const [citySearch, setCitySearch] = React.useState("");
  const maxSuggested = 50;

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

  const matchingStartCountries = countries.filter((country) => {
    return country.name
      .toLowerCase()
      .split(" ")
      .some((word) => word.startsWith(countrySearch.toLowerCase()));
  });

  const matchingSubstringCountries = countries.filter((country) => {
    return country.name.toLowerCase().includes(countrySearch.toLowerCase());
  });

  const filteredCountries = [
    ...new Set([...matchingStartCountries, ...matchingSubstringCountries]),
  ].slice(0, maxSuggested);

  const matchingStartCities = cities.filter((city) => {
    return city
      .toLowerCase()
      .split(" ")
      .some((word) => word.startsWith(citySearch.toLowerCase()));
  });

  const matchingSubstringCities = cities.filter((city) => {
    return city.toLowerCase().includes(citySearch.toLowerCase());
  });

  const filteredCities = [
    ...new Set([...matchingStartCities, ...matchingSubstringCities]),
  ].slice(0, maxSuggested);

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

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Country of origin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? field.value : "Select country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          value={countrySearch}
                          onValueChange={setCountrySearch}
                          placeholder="Search country..."
                        />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {filteredCountries.map((country) => (
                              <CommandItem
                                value={country.name}
                                key={country.code}
                                onSelect={() => {
                                  form.setValue("state", country.name);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isItaly && (
              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Place of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? field.value : "Select city"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            value={citySearch}
                            onValueChange={setCitySearch}
                            placeholder="Search city..."
                          />
                          <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              {filteredCities.map((city) => (
                                <CommandItem
                                  value={city}
                                  key={city}
                                  onSelect={() => {
                                    form.setValue("birthPlace", city);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      city === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
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
