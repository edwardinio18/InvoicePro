import { useState } from "react";
import { Link } from "react-router-dom";
import { useInvoices } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAllInvoices,
  clearSelectedInvoices,
  toggleSelectInvoice,
} from "@/store/slices/invoiceSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  Trash2,
  Eye,
  Edit,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import { Invoice } from "@/types";
import { DataPagination } from "@/components/data-pagination";
import { PaginatedResponse, PaginationParams } from "@/api/invoices";

const ITEMS_PER_PAGE = 10;

const isPaginatedResponse = (data: any): data is PaginatedResponse<any> => {
  return data && typeof data === "object" && "data" in data && "meta" in data;
};

const InvoiceList = () => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(0);

  const paginationParams: PaginationParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  const { data, isLoading, error, refetch } = useInvoices(
    sortDirection,
    paginationParams,
  );

  const invoices = data
    ? isPaginatedResponse(data)
      ? data.data
      : (data as any[])
    : [];

  const paginationMeta =
    data && isPaginatedResponse(data)
      ? data.meta
      : {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          total: invoices.length,
          totalPages: Math.ceil(invoices.length / ITEMS_PER_PAGE),
        };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<Invoice | null>(null);

  const dispatch = useAppDispatch();
  const { selectedInvoices } = useAppSelector((state) => state.invoices);

  const processedInvoices = invoices.map((invoice) => ({
    id: String(invoice.id || ""),
    clientName: invoice.clientName || invoice.vendor_name || "",
    amount: invoice.amount || 0,
    dueDate: invoice.dueDate || invoice.due_date || "",
    description: invoice.description || "",
    status: invoice.status || (invoice.paid ? "PAID" : "PENDING"),
    createdAt: invoice.createdAt || "",
  })) as Invoice[];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(selectAllInvoices(processedInvoices.map((inv) => inv.id)));
    } else {
      dispatch(clearSelectedInvoices());
    }
  };

  const handleSelectInvoice = (id: string) => {
    dispatch(toggleSelectInvoice(id));
  };

  const toggleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
  };

  const openInvoiceModal = (id: string) => {
    const invoice = processedInvoices.find((inv) => inv.id === id);
    if (invoice) {
      setSelectedInvoiceData(invoice);
      setIsModalOpen(true);
    }
  };

  const closeInvoiceModal = () => {
    setIsModalOpen(false);
    setSelectedInvoiceData(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusClass = () => {
    return "text-[#5a69c7]";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Paid";
      case "PENDING":
        return "Open";
      case "OVERDUE":
        return "Overdue";
      default:
        return "Pending";
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    } catch (e: unknown) {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="p-5 bg-red-50 border border-red-200 text-red-800 rounded-lg mb-6">
          <p className="font-medium">
            An error occurred while loading invoices
          </p>
          <p className="text-sm mt-1 text-red-700">
            Please try again or contact support if the problem persists.
          </p>
          <Button
            variant="outline"
            className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      )}
      {processedInvoices.length === 0 && !isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-800">
            No invoices found
          </h3>
          <p className="mt-2 text-slate-500">
            Create your first invoice to get started with invoice management.
          </p>
          <Link to="/invoices/create" className="mt-6 inline-block">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg">
            <div className="bg-[#dee2f7] rounded-lg min-w-[800px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#95a3e1] text-white">
                    <th className="p-4 text-left w-10 border border-[#bdc4df]">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedInvoices.length ===
                            processedInvoices.length &&
                          processedInvoices.length > 0
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium border border-[#bdc4df]">
                      Date
                    </th>
                    <th className="p-4 text-left text-sm font-medium border border-[#bdc4df]">
                      Payee
                    </th>
                    <th className="p-4 text-left text-sm font-medium border border-[#bdc4df]">
                      Description
                    </th>
                    <th className="p-4 text-left text-sm font-medium border border-[#bdc4df]">
                      Due Date
                    </th>
                    <th className="p-4 text-left text-sm font-medium border border-[#bdc4df]">
                      <div className="flex items-center justify-between">
                        <span>Amount</span>
                        <button
                          onClick={toggleSort}
                          className="flex items-center justify-center"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium border border-[#bdc4df]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
                          <p className="mt-2 text-slate-600">
                            Loading invoices...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    processedInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border border-[#bdc4df] hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => openInvoiceModal(invoice.id)}
                      >
                        <td
                          className="p-4 border border-[#bdc4df]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => handleSelectInvoice(invoice.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-4 text-sm text-[#4b4b4b] border border-[#bdc4df]">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="p-4 text-sm text-[#4b4b4b] border border-[#bdc4df]">
                          {invoice.clientName || "Client"}
                        </td>
                        <td className="p-4 text-sm text-[#4b4b4b] border border-[#bdc4df]">
                          {invoice.description || "Invoice"}
                        </td>
                        <td className="p-4 text-sm text-[#4b4b4b] border border-[#bdc4df]">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="p-4 text-sm text-[#4b4b4b] border border-[#bdc4df]">
                          <span className="italic">
                            {invoice.amount
                              ? `$ ${invoice.amount.toFixed(2)}`
                              : "$ 0.00"}
                          </span>
                        </td>
                        <td className="p-4 border border-[#bdc4df]">
                          <span className={`text-sm ${getStatusClass()}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-slate-500 w-full">
              Showing {processedInvoices.length} of {paginationMeta.total}{" "}
              invoices
            </p>
            <DataPagination
              currentPage={paginationMeta.page}
              totalPages={paginationMeta.totalPages}
              onPageChange={handlePageChange}
              className="justify-end"
            />
          </div>
        </div>
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoiceData && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Payee
                    </h3>
                    <p className="text-slate-900 font-medium">
                      {selectedInvoiceData.clientName}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Description
                    </h3>
                    <p className="text-slate-900">
                      {selectedInvoiceData.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Invoice Date
                    </h3>
                    <p className="text-slate-900">
                      {formatDate(selectedInvoiceData.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Amount
                    </h3>
                    <p className="text-slate-900 font-medium text-lg">
                      ${selectedInvoiceData.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Due Date
                    </h3>
                    <p className="text-slate-900">
                      {formatDate(selectedInvoiceData.dueDate)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Status
                    </h3>
                    <p className={`${getStatusClass()} font-medium`}>
                      {getStatusText(selectedInvoiceData.status)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-300 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-300 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  onClick={closeInvoiceModal}
                  variant="outline"
                  className="border-slate-300 mr-3"
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Mark as{" "}
                  {selectedInvoiceData.status === "PAID" ? "Unpaid" : "Paid"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceList;
