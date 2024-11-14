import {
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
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SelectFieldProps = {
  form: UseFormReturn;
  name: string;
  label: string;
  data: string[];
};
export function SelectField({ form, name, label, data }: SelectFieldProps) {
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  "w-[200px] justify-between",
                  !field.value && "text-muted-foreground",
                )}
              >
                <SelectValue placeholder={t("selectField.placeholder")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((entry) => {
                return (
                  <SelectItem value={entry} key={entry}>
                    {entry}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
