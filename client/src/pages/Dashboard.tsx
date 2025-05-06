import { Link } from "react-router-dom";
import { useInvoices } from "@/hooks/useInvoices";
import { useAuth } from "@/context/AuthContext";
import { Invoice } from "@/api/invoices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useInvoices();

  const invoices: Invoice[] = data
    ? "data" in data && "meta" in data
      ? (data as PaginatedResponse<Invoice>).data
      : (data as Invoice[])
    : [];

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "PAID").length;
  const pendingInvoices = invoices.filter(
    (inv) => inv.status === "PENDING",
  ).length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "OVERDUE",
  ).length;

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-md">
        An error occurred while loading dashboard data
        <Button variant="outline" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {user ? `Welcome, ${user.name}` : "Dashboard"}
        </h1>
        <Link to="/invoices">
          <Button>View All Invoices</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-3xl">{totalInvoices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Total amount: ${totalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Invoices</CardDescription>
            <CardTitle className="text-3xl">{paidInvoices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Paid amount: ${paidAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Invoices</CardDescription>
            <CardTitle className="text-3xl">{pendingInvoices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue Invoices</CardDescription>
            <CardTitle className="text-3xl">{overdueInvoices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your most recent invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground py-4">No invoices found.</p>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center p-4 border rounded-md hover:bg-muted/20"
                >
                  <div>
                    <p className="font-medium">{invoice.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      Invoice #{invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(invoice.amount || 0).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        invoice.status === "PAID"
                          ? "bg-blue-100 text-blue-800"
                          : invoice.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {invoice.status === "PAID"
                        ? "Paid"
                        : invoice.status === "PENDING"
                          ? "Open"
                          : "Overdue"}
                    </span>
                  </div>
                </div>
              ))}

              <Link
                to="/invoices"
                className="block mt-4 text-primary hover:underline text-center"
              >
                View all invoices
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
