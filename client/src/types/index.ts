export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  description: string;
  status: string;
  createdAt: string;

  vendor_name?: string;
  due_date?: string;
  paid?: boolean;
}
