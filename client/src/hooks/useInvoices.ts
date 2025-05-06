import { useQuery } from "@tanstack/react-query";
import { invoicesApi } from "@/api/invoices";

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const useInvoices = (
  sortDirection?: "asc" | "desc",
  pagination?: PaginationParams,
) => {
  const queryKey = [
    "invoices",
    sortDirection || "default",
    pagination?.page,
    pagination?.limit,
  ];

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await invoicesApi.getInvoices(sortDirection, pagination);
    },
    staleTime: 5 * 60 * 1000,
  });
};
