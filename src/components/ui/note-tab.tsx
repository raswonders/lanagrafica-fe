import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Textarea } from "./textarea";
import { Member } from "@/types/types";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "@radix-ui/react-tabs";

type NoteTabProps = {
  form: UseFormReturn<Member>;
};

export function NoteTab({ form }: NoteTabProps) {
  const { t } = useTranslation();
  return (
    <TabsContent value="note">
      <FormField
        control={form.control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("memberDetails.noteLabel")}</FormLabel>
            <FormControl>
              <Textarea className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
