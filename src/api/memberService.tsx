import { supabase } from "./supabase";
import { extendDate, genCardNumber } from "@/lib/utils";
import { MemberDB, MemberDTO, MemberInsert, MemberUpdate } from "@/types/types";

export async function renewMember(
  id: number,
  expirationDate: string,
): Promise<MemberDTO | null> {
  const cardNumber = genCardNumber();
  const nextExpiration = extendDate(expirationDate);

  const { data, error } = await supabase
    .from("members")
    .update({
      card_number: String(cardNumber),
      expiration_date: nextExpiration,
      is_active: true,
    })
    .eq("id", id);

  if (error) throw error;

  return data;
}

export async function updateMember(id: number, details: MemberUpdate) {
  const { data, error } = await supabase
    .from("members")
    .update(details)
    .eq("id", id);

  if (error) throw error;

  return data;
}

export async function insertMember(details: MemberInsert) {
  const { error } = await supabase.from("members").insert(details);

  if (error) throw error;
}

export async function searchMember(
  debouncedSearch: string | null,
  pageStart: number,
  pageEnd: number,
) {
  let data, error;
  if (debouncedSearch) {
    const searchWords = debouncedSearch.trim().split(/\s+/).filter(Boolean);
    const searchParam = searchWords.join(" & ");
    ({ data, error } = await supabase
      .from("members")
      .select("*")
      .order("id", { ascending: true })
      .textSearch("name_surname", searchParam)
      .range(pageStart, pageEnd));
  } else {
    ({ data, error } = await supabase
      .from("members")
      .select("*")
      .order("id", { ascending: true })
      .range(pageStart, pageEnd));
  }

  if (error) throw error;

  return data;
}
