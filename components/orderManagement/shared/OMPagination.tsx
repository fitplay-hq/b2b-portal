"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface OMPaginationProps {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function OMPagination({ meta }: OMPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const { page, totalPages, limit, total } = meta;

  if (totalPages <= 1 && total <= limit) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{total === 0 ? 0 : (page - 1) * limit + 1}</span> to{" "}
        <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => router.push(createPageURL(1))}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => router.push(createPageURL(page - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          Page {page} of {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => router.push(createPageURL(page + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => router.push(createPageURL(totalPages))}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
