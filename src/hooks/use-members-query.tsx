import { searchMember } from "@/api/memberService";
import { extendWithStatus, fromSnakeToCamelCase } from "@/lib/utils";
import { Member } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

type QueryMembersResult = {
  members: Member[];
  maxPageParam: number;
};

export function useMembersQuery(
  debouncedSearch: string | null,
  membersPerPage: number,
) {
  async function queryMembers({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<QueryMembersResult> {
    const pageStart = pageParam * membersPerPage;
    const pageEnd = pageStart + membersPerPage - 1;
    const { data, count } = await searchMember(
      debouncedSearch,
      pageStart,
      pageEnd,
    );

    const total = count || 0;
    const dataNormalized = data ? (fromSnakeToCamelCase(data) as Member[]) : [];

    return {
      members: extendWithStatus(dataNormalized),
      maxPageParam: Math.floor(total / membersPerPage),
    };
  }

  return useInfiniteQuery({
    queryKey: ["members"],
    queryFn: queryMembers,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPageParam < lastPage.maxPageParam ? lastPageParam + 1 : null;
    },
    initialPageParam: 0,
  });
}
