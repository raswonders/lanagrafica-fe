import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  createDateString,
  parseDay,
  parseMonth,
  parseYear,
  isAdult,
  isValidISODate,
  hasExpired,
  hasBeenSuspended,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge } from "./status-badge";
import { useWindowSize } from "@/hooks/use-window-size";
import { UpdateMutation } from "@/hooks/use-table-mutations";
import { MemberExt } from "@/types/types";
import { PersonalTab } from "./personal-tab";
import { MembershipTab } from "./membership-tab";
import { NoteTab } from "./note-tab";

export function MemberDetails({
  row,
  updateMutation,
  children,
  variant = "personal",
}: {
  row: MemberExt;
  updateMutation: UpdateMutation;
  children: React.ReactNode;
  variant?: "personal" | "membership" | "note";
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(parseDay(row.birth_date));
  const [month, setMonth] = useState(parseMonth(row.birth_date));
  const [year, setYear] = useState(parseYear(row.birth_date));

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
    measure: z.string().refine((measure) => measure || !isSuspended, {
      message: t("validation.required"),
    }),
    note: z.string(),
    suspended_till: z.string(),
    expiration_date: z.string(),
  });

  const form = useForm<MemberExt>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: row.name,
      surname: row.surname,
      birth_date: createDateString(day, month, year),
      birth_place: row.birth_date,
      country: row.country,
      doc_type: row.doc_type,
      doc_id: row.doc_id,
      email: row.email || "",
      measure: row.measure || "",
      note: row.note || "",
      suspended_till: row.suspended_till || "",
      expiration_date: row.expiration_date || "",
    },
  });

  const { isDirty } = form.formState;
  const isSuspended = hasBeenSuspended(
    new Date(form.watch("suspended_till") || ""),
  );
  const isExpired = hasExpired(new Date(form.watch("expiration_date") || ""));
  const isActive = !isSuspended && !isExpired;
  const isMobile = useWindowSize();

  async function onSubmit(member: MemberExt) {
    // FIXME uptade this object to contain only dirty fields from form
    const changedFields = { is_active: isActive };

    await updateMutation.mutate({
      id: row.id,
      details: changedFields,
      name: row.name || "",
    });
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {isMobile ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>{children}</SheetTrigger>
            </TooltipTrigger>
            <TooltipContent className={variant === "note" ? "max-w-96" : ""}>
              {variant === "personal" && t("membersTable.editMember")}
              {variant === "note" && row.note}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <SheetContent className="overflow-y-scroll w-full">
        <SheetHeader>
          <SheetTitle>
            <div className="flex gap-2">
              {`${row.name} ${row.surname}`}
              <StatusBadge status={row.status} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex justify-center">
          <Tabs defaultValue={variant} className="w-full space-y-6">
            <TabsList>
              <TabsTrigger value="personal">
                {t("memberDetails.personalTab")}
              </TabsTrigger>
              <TabsTrigger value="membership">
                {t("memberDetails.membershipTab")}
              </TabsTrigger>
              <TabsTrigger value="note">
                {t("memberDetails.noteTab")}
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <PersonalTab
                  form={form}
                  day={day}
                  month={month}
                  year={year}
                  setDay={setDay}
                  setMonth={setMonth}
                  setYear={setYear}
                  row={row}
                />
                <MembershipTab
                  form={form}
                  row={row}
                  isExpired={isExpired}
                  isSuspended={isSuspended}
                />
                <NoteTab form={form} />
                <Button
                  disabled={!isDirty || form.formState.isSubmitting}
                  type="submit"
                  className="w-full mt-8"
                >
                  {t("memberDetails.save")}
                </Button>
              </form>
            </Form>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
