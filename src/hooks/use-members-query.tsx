import { searchMember } from "@/api/memberService";
import { extendWithStatus, fromSnakeToCamelCase } from "@/lib/utils";
import { Member } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMembersQuery(
  debouncedSearch: string | null,
  membersPerPage: number,
) {
  async function queryMembers({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<Member[]> {
    const pageStart = pageParam * membersPerPage;
    const pageEnd = pageStart + membersPerPage - 1;
    const { data } = await searchMember(debouncedSearch, pageStart, pageEnd);

    const dataNormalized = data ? (fromSnakeToCamelCase(data) as Member[]) : [];

    return extendWithStatus(dataNormalized);
  }

  // FIXME should return TData make sure all row transformation happens before 
  return useInfiniteQuery({
    queryKey: ["members"],
    queryFn: queryMembers,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === membersPerPage ? lastPageParam + 1 : null,
    initialPageParam: 0,
  });
}
