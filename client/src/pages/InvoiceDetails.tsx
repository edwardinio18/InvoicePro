import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { invoicesApi } from "@/api/invoices";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: invoice,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoicesApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading invoice details...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-md">
        An error occurred while loading the invoice
        <Button variant="outline" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-4 bg-muted text-center rounded-md">
        <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested invoice could not be found.
        </p>
        <Link to="/invoices">
          <Button>Return to Invoices</Button>
        </Link>
      </div>
    );
  }

  const statusColor =
    invoice.status === "PAID"
      ? "bg-blue-100 text-blue-800"
      : invoice.status === "OVERDUE"
        ? "bg-red-100 text-red-800"
        : "bg-orange-100 text-orange-800";

  const statusText =
    invoice.status === "PAID"
      ? "Paid"
      : invoice.status === "PENDING"
        ? "Open"
        : "Overdue";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-muted-foreground">
            Created on{" "}
            {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/invoices/${id}/edit`}>
            <Button variant="outline">Edit Invoice</Button>
          </Link>
          <Link to="/invoices">
            <Button variant="secondary">Back to Invoices</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Invoice Details</CardTitle>
            <span className={`px-3 py-1 rounded-full text-xs ${statusColor}`}>
              {statusText}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Billed To
              </h3>
              <p className="font-medium">{invoice.clientName}</p>
              <p>{invoice.clientEmail}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Invoice Details
              </h3>
              <p>
                <span className="text-muted-foreground">Invoice Number:</span>{" "}
                {invoice.invoiceNumber}
              </p>
              <p>
                <span className="text-muted-foreground">Due Date:</span>{" "}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
              <p className="font-medium mt-2">
                Amount: ${(invoice.amount ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          {invoice.description && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </h3>
              <p>{invoice.description}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 flex justify-between">
          <p className="text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date(
              invoice.updatedAt || invoice.createdAt || Date.now(),
            ).toLocaleDateString()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Are you sure you want to delete this invoice?")) {
                  invoicesApi.delete(id!).then(() => {
                    navigate("/invoices");
                  });
                }
              }}
            >
              Delete
            </Button>
            {invoice.status !== "PAID" && (
              <Button
                onClick={() => {
                  invoicesApi.update(id!, { status: "PAID" }).then(() => {
                    refetch();
                  });
                }}
              >
                Mark as Paid
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
