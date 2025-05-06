import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvoiceState {
  selectedInvoices: string[];
  filterStatus: "ALL" | "PAID" | "PENDING" | "OVERDUE";
  sortBy: "date" | "amount" | "dueDate";
  sortDirection: "asc" | "desc";
}

const initialState: InvoiceState = {
  selectedInvoices: [],
  filterStatus: "ALL",
  sortBy: "date",
  sortDirection: "desc",
};

export const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    toggleSelectInvoice: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedInvoices.includes(id)) {
        state.selectedInvoices = state.selectedInvoices.filter(
          (invId) => invId !== id,
        );
      } else {
        state.selectedInvoices.push(id);
      }
    },
    selectAllInvoices: (state, action: PayloadAction<string[]>) => {
      state.selectedInvoices = action.payload;
    },
    clearSelectedInvoices: (state) => {
      state.selectedInvoices = [];
    },
    setFilterStatus: (
      state,
      action: PayloadAction<"ALL" | "PAID" | "PENDING" | "OVERDUE">,
    ) => {
      state.filterStatus = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"date" | "amount" | "dueDate">,
    ) => {
      state.sortBy = action.payload;
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    },
  },
});

export const {
  toggleSelectInvoice,
  selectAllInvoices,
  clearSelectedInvoices,
  setFilterStatus,
  setSortBy,
  toggleSortDirection,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
