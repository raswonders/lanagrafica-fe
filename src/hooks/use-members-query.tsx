import { searchMember } from "@/api/memberService";
import { extendWithStatus } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMembersQuery(
  debouncedSearch: string | null,
  membersPerPage: number,
) {
  async function fetchMembers({ pageParam }: { pageParam: number }) {
    const pageStart = pageParam * membersPerPage;
    const pageEnd = pageStart + membersPerPage - 1;
    const data =
      (await searchMember(debouncedSearch, pageStart, pageEnd)) || [];
    return extendWithStatus(data);
  }

  return useInfiniteQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === membersPerPage ? lastPageParam + 1 : null,
    initialPageParam: 0,
  });
}
