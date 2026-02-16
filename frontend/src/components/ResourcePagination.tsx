import { useSearchParams } from "react-router";
import { generatePagination } from "@/lib/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Pagination as PaginationMeta } from "@/features/tasks/types";

export function ResourcePagination({
  pagination,
}: {
  pagination: PaginationMeta;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pages = generatePagination(pagination);

  function handlePageChange(page: number) {
    if (page === pagination.page) {
      return;
    }

    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: page.toString(),
    });
  }

  const pageParam = searchParams.get("page");
  const currentPage =
    pageParam !== null ? parseInt(pageParam) : pagination.page;

  return (
    <div className="relative mt-auto flex items-center">
      <Field orientation="horizontal" className="z-10 w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          value={searchParams.get("pageSize") ?? pagination.pageSize.toString()}
          onValueChange={(value) => {
            searchParams.set("pageSize", value);
            searchParams.delete("page");
            setSearchParams(searchParams);
          }}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="absolute">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={!pagination.hasPreviousPage}
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(
                  Math.min(pagination.totalPages, currentPage + 1),
                )
              }
              disabled={!pagination.hasNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
