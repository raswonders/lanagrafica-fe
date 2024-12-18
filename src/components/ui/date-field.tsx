import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import { Label } from "./label";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { createDateString } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

type DateFieldProps = {
  form: UseFormReturn;
  name: string;
  label: string;
  day: string;
  month: string;
  year: string;
  setDay: Dispatch<SetStateAction<string>>;
  setMonth: Dispatch<SetStateAction<string>>;
  setYear: Dispatch<SetStateAction<string>>;
};

export function DateField({
  form,
  name,
  label,
  day,
  month,
  year,
  setDay,
  setMonth,
  setYear,
}: DateFieldProps) {
  const { t } = useTranslation();
  const monthInputRef = useRef<HTMLInputElement | null>(null);
  const yearInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const triggerValidation = async () => {
      await form.trigger(name);
    };

    if (day && month && year.length === 4) {
      triggerValidation();
    }
  }, [day, month, year, name, form]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} className="hidden" />
          </FormControl>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <Label htmlFor="day" className="text-neutral-11">
                {t("dateField.day")}
              </Label>
              <Input
                id="day"
                maxLength={2}
                inputMode="numeric"
                value={day}
                style={{ width: "calc(2ch + 1.5rem + 2px)" }}
                onTouchStart={(e) => (e.target as HTMLInputElement).select()}
                className="mt-2"
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue.match(/^\d*$/)) {
                    setDay(nextValue);
                    const date = createDateString(nextValue, month, year);
                    field.onChange(date);
                  }
                  if (nextValue.length === e.target.maxLength) {
                    monthInputRef.current?.focus();
                  }
                }}
              />
            </div>

            <div className="flex flex-col items-center mr-4">
              <Label htmlFor="month" className="text-neutral-11">
                {t("dateField.month")}
              </Label>
              <Input
                id="month"
                maxLength={2}
                inputMode="numeric"
                value={month}
                style={{ width: "calc(2ch + 1.5rem + 2px)" }}
                onTouchStart={(e) => (e.target as HTMLInputElement).select()}
                ref={monthInputRef}
                className="mt-2"
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue.match(/^\d*$/)) {
                    setMonth(nextValue);
                    const date = createDateString(day, nextValue, year);
                    field.onChange(date);
                  }
                  if (nextValue.length === e.target.maxLength) {
                    yearInputRef.current?.focus();
                  }
                }}
              />
            </div>

            <div className="flex flex-col items-center mr-4">
              <Label htmlFor="year" className="text-neutral-11">
                {t("dateField.year")}
              </Label>
              <Input
                id="year"
                maxLength={2}
                inputMode="numeric"
                value={year}
                style={{ width: "calc(2ch + 1.5rem + 2px)" }}
                onTouchStart={(e) => (e.target as HTMLInputElement).select()}
                ref={yearInputRef}
                className="mt-2"
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue.match(/^\d*$/)) {
                    setYear(nextValue);
                    const date = createDateString(day, month, nextValue);
                    field.onChange(date);
                  }
                }}
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
