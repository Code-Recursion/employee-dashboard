"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/models/employee.types";

interface EmployeePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const getPageNumbers = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
};

export function EmployeePagination({
  pagination,
  onPageChange,
  disabled = false,
}: EmployeePaginationProps) {
  const { page, totalPages, total, limit } = pagination;
  const pages = getPageNumbers(page, totalPages || 1);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (totalPages <= 1) {
    return (
      <p className="text-sm text-neutral-500 text-center pt-4">
        {total === 0
          ? "No results"
          : `Showing ${start}–${end} of ${total}`}
      </p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <p className="text-sm text-neutral-500">
        Showing {start}–{end} of {total} · Page {page} of {totalPages}
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(page - 1)}
              disabled={disabled || page <= 1}
            />
          </PaginationItem>

          {pages.map((p, index) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => onPageChange(p)}
                  disabled={disabled}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              disabled={disabled || page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
