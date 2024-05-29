import { insertMember, renewMember, updateMember } from "@/api/memberService";
import { SerializedMember } from "@/components/ui/add-member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export type RenewMutation = {
  mutate: (args: { id: number; expirationDate: string; name: string }) => void;
};

export type UpdateMutation = {
  mutate: (args: {
    id: number;
    details: Partial<SerializedMember>;
    name: string;
  }) => void;
};

export type InsertMutation = {
  mutate: (args: { details: Partial<SerializedMember>; name: string }) => void;
};

export function useMembersMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const renewMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      expirationDate: string;
      name: string;
    }) => renewMember(variables.id, variables.expirationDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("membersTable.renewSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("membersTable.renewError"), error);
      toast.error(
        t("membersTable.renewError", {
          name: variables.name,
        }),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      details: Partial<SerializedMember>;
      name: string;
    }) => updateMember(variables.id, variables.details),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("membersTable.updateSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("membersTable.updateError"), error);
      toast.error(
        t("membersTable.updateError", {
          name: variables.name,
        }),
      );
    },
  });

  const insertMutation = useMutation({
    mutationFn: (variables: {
      details: Partial<SerializedMember>;
      name: string;
    }) => insertMember(variables.details),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(t("newMember.insertSuccess", { name: variables.name }));
    },
    onError: (error, variables) => {
      console.error(t("newMember.insertError"), error);
      toast.error(
        t("newMember.insertError", {
          name: variables.name,
        }),
      );
    },
  });
  return { renewMutation, updateMutation, insertMutation };
}
