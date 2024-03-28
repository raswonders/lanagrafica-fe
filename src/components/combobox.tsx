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

import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ComboboxProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
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
    }
  }, [form, name, value]);

  const matchingStart = data.filter((entry) => {
    return entry
      .toLowerCase()
      .split(" ")
      .some((word) => word.startsWith(search.toLowerCase()));
  });

  const matchingSubstring = data.filter((entry) => {
    return entry.toLowerCase().includes(search.toLowerCase());
  });

  const filteredData = [
    ...new Set([...matchingStart, ...matchingSubstring]),
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
                    "w-[200px] justify-between",
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
                          form.setValue(name, entry);
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
