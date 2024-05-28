import { Member } from "@/components/ui/members-table";
import { supabase } from "./supabase";
import { extendDate, genCardNumber } from "@/lib/utils";
import { SerializedMember } from "@/components/ui/add-member";

export async function renewMember(
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

export async function searchMember(
  debouncedSearch: string | null,
  pageStart: number,
  pageEnd: number,
) {
  let data, count, error;
  if (debouncedSearch) {
    const searchWords = debouncedSearch.trim().split(/\s+/).filter(Boolean);
    const searchParam = searchWords.join(" & ");
    ({ data, count, error } = await supabase
      .from("member")
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .textSearch("name_surname", searchParam)
      .range(pageStart, pageEnd));
  } else {
    ({ data, count, error } = await supabase
      .from("member")
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(pageStart, pageEnd));
  }

  if (error) throw error;

  return { data, count };
}
