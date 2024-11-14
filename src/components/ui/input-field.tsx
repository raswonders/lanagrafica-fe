import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import { UseFormReturn } from "react-hook-form";

type InputFieldProps = {
  form: UseFormReturn;
  name: string;
  label: string;
  type?: string;
};

export function InputField({
  form,
  name,
  label,
  type = "text",
}: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
