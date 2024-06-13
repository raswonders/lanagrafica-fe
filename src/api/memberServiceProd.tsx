// export async function searchMember(
//   debouncedSearch: string | null,
//   pageStart: number,
//   pageEnd: number,
// ) {
//   let data, count, error;
//   if (debouncedSearch) {
//     const searchWords = debouncedSearch.trim().split(/\s+/).filter(Boolean);
//     const searchParam = searchWords.join(" & ");
//     ({ data, count, error } = await supabase
//       .from("member")
//       .select("*", { count: "exact" })
//       .order("id", { ascending: true })
//       .textSearch("name_surname", searchParam)
//       .range(pageStart, pageEnd));
//   } else {
//     ({ data, count, error } = await supabase
//       .from("member")
//       .select("*", { count: "exact" })
//       .order("id", { ascending: true })
//       .range(pageStart, pageEnd));
//   }

//   if (error) throw error;

//   return { data, count };
// }

// FIXME used temporary to bypass TLS/SSL expired cert error
// remove when query of api won't give ssl tls errors
import fetch from "node-fetch";
import https from "https";
import { MemberDTO } from "@/types";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

type Filter = "all" | "active" | "inactive" | "deleted" | "suspended-members";

export async function getMembers(filter: Filter, pageNumber: Number) {
  const url = `https://lanagrafica.101roma.club:5051/api/v1/member/${filter}/${pageNumber}`;

  const response = await fetch(url, { agent });
  console.log(`Response status: ${response.status}`);

  // handle buggy 404 responses
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as MemberDTO[];
}
