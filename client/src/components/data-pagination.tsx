import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination/pagination";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: DataPaginationProps) {
  if (totalPages <= 1) return null;

  const siblingCount = 1;
  const showLeftDots = currentPage > siblingCount + 1;
  const showRightDots = currentPage < totalPages - siblingCount - 1;

  const getVisiblePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const startPage = Math.max(0, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    const pageNumbers = [];

    if (showLeftDots) {
      pageNumbers.push(0);
    }

    if (showLeftDots) {
      pageNumbers.push(-1);
    } else {
      for (let i = 0; i < startPage; i++) {
        pageNumbers.push(i);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (showRightDots) {
      pageNumbers.push(-2);
    } else {
      for (let i = endPage + 1; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    if (showRightDots) {
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            style={{
              opacity: currentPage === 0 ? 0.5 : 1,
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
            }}
          />
        </PaginationItem>
        {getVisiblePageNumbers().map((pageNum, index) => {
          if (pageNum < 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${pageNum}`}>
              <PaginationLink
                isActive={pageNum === currentPage}
                onClick={() => onPageChange(pageNum)}
                style={{ cursor: "pointer" }}
              >
                {pageNum + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            style={{
              opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
              cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
