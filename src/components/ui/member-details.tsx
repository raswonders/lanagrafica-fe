import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  serializeForUpdate,
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
import { Member } from "@/types";
import { PersonalTab } from "./personal-tab";
import { MembershipTab } from "./membership-tab";
import { NoteTab } from "./note-tab";

export function MemberDetails({
  row,
  updateMutation,
  children,
  variant = "personal",
}: {
  row: Member;
  updateMutation: UpdateMutation;
  children: React.ReactNode;
  variant?: "personal" | "membership" | "note";
}) {
  const { t } = useTranslation();
  const [day, setDay] = useState(parseDay(row.birthDate));
  const [month, setMonth] = useState(parseMonth(row.birthDate));
  const [year, setYear] = useState(parseYear(row.birthDate));
  const isMobile = useWindowSize();

  const formSchema = z.object({
    name: z.string().min(1, { message: t("validation.required") }),
    surname: z.string().min(1, { message: t("validation.required") }),
    birthDate: z
      .string()
      .min(1, { message: t("validation.required") })
      .refine(isValidISODate, { message: t("validation.wrongDate") })
      .refine(isAdult, { message: t("validation.notAdult") }),
    birthPlace: z.string().min(1, { message: t("validation.required") }),
    country: z.string().min(1, { message: t("validation.required") }),
    docType: z.string().min(1, { message: t("validation.required") }),
    docId: z.string().min(1, { message: t("validation.required") }),
    email: z.string(),
    measure: z.string().refine((measure) => measure || !isSuspended, {
      message: t("validation.required"),
    }),
    note: z.string(),
    suspendedTill: z.string(),
    expirationDate: z.string(),
  });

  const form = useForm<Member>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: row.name,
      surname: row.surname,
      birthDate: createDateString(day, month, year),
      birthPlace: row.birthPlace,
      country: row.country,
      docType: row.docType,
      docId: row.docId,
      email: row.email || "",
      measure: row.measure || "",
      note: row.note || "",
      suspendedTill: row.suspendedTill || "",
      expirationDate: row.expirationDate || "",
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(member: Member) {
    const serializedMember = serializeForUpdate(member, isActive);
    await updateMutation.mutate({
      id: row.id,
      details: serializedMember,
      name: row.name,
    });
    setOpen(false);
  }

  const isSuspended: boolean = Boolean(form.watch("suspendedTill"));
  const isExpired = hasExpired(new Date(form.watch("expirationDate")));
  const isActive = !isSuspended && !isExpired;
  const [open, setOpen] = useState(false);

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
                <TabsContent value="personal">
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
                </TabsContent>
                <TabsContent value="membership">
                  <MembershipTab
                    form={form}
                    row={row}
                    isExpired={isExpired}
                    isSuspended={isSuspended}
                  />
                </TabsContent>
                <TabsContent value="note">
                  <NoteTab form={form} />
                </TabsContent>
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
