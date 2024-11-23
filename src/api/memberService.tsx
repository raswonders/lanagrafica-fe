import { supabase } from "./supabase";
import { extendDate, genCardNumber } from "@/lib/utils";
import { MemberInsert, MemberUpdate } from "@/types/types";

function serialize<T extends MemberUpdate | MemberInsert>(data: T) {
  const serialized = Object.entries(data).map((item) => {
    item[1] = item[1] === "" ? null : item[1];
    return item;
  });

  return Object.fromEntries(serialized) as T;
}

export async function renewMember(id: number, expirationDate: string) {
  const cardNumber = genCardNumber();
  const nextExpiration = extendDate(expirationDate);

  const { error } = await supabase
    .from("members")
    .update({
      card_number: String(cardNumber),
      expiration_date: nextExpiration,
      is_active: true,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function updateMember(id: number, details: MemberUpdate) {
  const { error } = await supabase
    .from("members")
    .update(serialize(details))
    .eq("id", id);

  if (error) throw error;
}

export async function insertMember(details: MemberInsert) {
  const { error } = await supabase.from("members").insert(serialize(details));

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
