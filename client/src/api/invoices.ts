import axiosInstance from "./axios";
import { z } from "zod";

const apiResponseFields = z.object({
  id: z.number().optional(),
  vendor_name: z.string().optional(),
  amount: z.number().optional(),
  due_date: z.string().optional(),
  description: z.string().optional(),
  paid: z.boolean().optional(),
  createdAt: z.string().optional(),
  userId: z.number().optional(),
});

export const invoiceSchema = z
  .object({
    id: z.string().optional(),
    invoiceNumber: z.string(),
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid email format"),
    amount: z.number().min(0, "Amount must be positive"),
    dueDate: z.string(),
    status: z.enum(["PENDING", "PAID", "OVERDUE"]),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .merge(apiResponseFields);

export const createInvoiceSchema = invoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = Partial<CreateInvoiceInput>;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const invoicesApi = {
  getInvoices: async (
    sortDirection?: "asc" | "desc",
    pagination?: PaginationParams,
  ): Promise<Invoice[] | PaginatedResponse<Invoice>> => {
    const params = new URLSearchParams();

    if (sortDirection) {
      params.append("sortDirection", sortDirection);
    }

    if (pagination) {
      if (pagination.page !== undefined) {
        params.append("page", pagination.page.toString());
      }
      if (pagination.limit !== undefined) {
        params.append("limit", pagination.limit.toString());
      }
    }

    const queryString = params.toString();
    const url = queryString ? `/invoices?${queryString}` : "/invoices";

    const response = await axiosInstance.get(url);
    return response.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await axiosInstance.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  create: async (invoice: CreateInvoiceInput): Promise<Invoice> => {
    const response = await axiosInstance.post<Invoice>("/invoices", invoice);
    return response.data;
  },

  update: async (id: string, invoice: UpdateInvoiceInput): Promise<Invoice> => {
    const response = await axiosInstance.patch<Invoice>(
      `/invoices/${id}`,
      invoice,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/invoices/${id}`);
  },
};
