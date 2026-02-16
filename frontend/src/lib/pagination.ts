import type { Pagination } from "@/features/tasks/types";

export type PaginationItem = number | "ellipsis";

export function generatePagination(
  pagination: Pagination,
  siblingCount = 2,
): PaginationItem[] {
  const totalPages = pagination.totalPages;
  const currentPage = pagination.page;

  if (totalPages <= 0) {
    return [];
  }

  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from(
      { length: leftItemCount },
      (_, index) => index + 1,
    );

    return [...leftRange, "ellipsis", totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const start = totalPages - rightItemCount + 1;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, index) => start + index,
    );

    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, index) => leftSiblingIndex + index,
  );

  return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
}