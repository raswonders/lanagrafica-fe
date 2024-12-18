import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";

type ComboboxProps = {
  form: UseFormReturn;
  name: string;
  label: string;
  data: string[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  value?: string;
  disabled?: boolean;
};

export function Combobox({
  form,
  name,
  label,
  data,
  search,
  setSearch,
  value,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const maxSuggested = 9;
  const { t } = useTranslation();

  useEffect(() => {
    if (value !== undefined) {
      form.setValue(name, value);
      form.clearErrors();
    }
  }, [form, name, value]);

  const matchingFirstWord = data.filter((entry) => {
    return entry.toLowerCase().split(" ")[0] === search.toLowerCase();
  });

  const matchingAnyWord = data.filter((entry) => {
    return entry
      .toLowerCase()
      .split(" ")
      .slice(1)
      .some((word) => word === search.toLowerCase());
  });

  const matchingStartFirstWord = data.filter((entry) => {
    return entry.toLowerCase().split(" ")[0].startsWith(search.toLowerCase());
  });

  const matchingStartAnyWord = data.filter((entry) => {
    return entry
      .toLowerCase()
      .split(" ")
      .slice(1)
      .some((word) => word.startsWith(search.toLowerCase()));
  });

  const matchingSubstring = data.filter((entry) => {
    return entry.toLowerCase().includes(search.toLowerCase());
  });

  const filteredData = [
    ...new Set([
      ...matchingFirstWord,
      ...matchingAnyWord,
      ...matchingStartFirstWord,
      ...matchingStartAnyWord,
      ...matchingSubstring,
    ]),
  ].slice(0, maxSuggested);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="w-max">{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
              <FormControl>
                <Button
                  variant="select"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between px-3",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? field.value : t("combobox.buttonPlaceholder")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  value={search}
                  onValueChange={setSearch}
                  placeholder={t("combobox.commandPlaceholder")}
                />
                <CommandList>
                  <CommandEmpty>{t("combobox.noItems")}</CommandEmpty>
                  <CommandGroup>
                    {filteredData.map((entry) => (
                      <CommandItem
                        value={entry}
                        key={entry}
                        onSelect={() => {
                          form.setValue(name, entry, { shouldDirty: true });
                          form.clearErrors(name);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            entry === field.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {entry}
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
  );
}
