import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";

export default function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-700">{currentPage}</span> of{" "}
        <span className="font-medium text-slate-700">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={cn(
              "h-8 w-8 text-sm rounded-lg transition-colors cursor-pointer",
              page === currentPage
                ? "bg-primary text-white font-medium"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {page}
          </button>
        ))}
        <Button
          variant="secondary"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
