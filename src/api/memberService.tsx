import { Member } from "@/components/ui/members-table";
import { supabase } from "./supabase"
import { extendDate, genCardNumber } from "@/lib/utils";
import { SerializedMember } from "@/components/ui/add-member";

export async function renewMemberCard(
  id: number,
  expirationDate: string,
): Promise<Member | null> {
  const cardNumber = genCardNumber();
  const nextExpiration = extendDate(new Date(expirationDate));

  const { data, error } = await supabase
    .from("member")
    .update({
      card_number: String(cardNumber),
      expiration_date: nextExpiration,
      is_active: true,
    })
    .eq("id", id);

  if (error) throw error;

  return data;
}

export async function updateMember(
  id: number,
  details: Partial<SerializedMember>,
): Promise<Member | null> {
  const { data, error } = await supabase
    .from("member")
    .update(details)
    .eq("id", id);

  if (error) throw error;

  return data;
}

export async function insertMember(details: Partial<SerializedMember>) {
  const { error } = await supabase.from("member").insert(details);

  if (error) throw error;
}