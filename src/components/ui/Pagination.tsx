import { cn } from "@/lib/utils/cn";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-8 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
            p === page
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-text-secondary hover:bg-surface"
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-8 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
