import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

type PaginationLinkProps = React.ComponentProps<typeof Button> & {
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive,
  size = "icon",
  variant = "ghost",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "secondary" : variant}
      size={size}
      className={cn("min-w-8", className)}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span>Previous</span>
    </Button>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="size-4" />
    </Button>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex size-8 items-center justify-center text-neutral-500", className)}
      {...props}
    >
      …
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
