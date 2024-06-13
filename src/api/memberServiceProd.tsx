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
type Filter = "all" | "active" | "inactive" | "deleted" | "suspended-members";

async function getMembers(filter: Filter = "all", pageNumber: Number) {
  const url = `https://lanagrafica.101roma.club:5051/api/v1/member/${filter}/${pageNumber}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}
