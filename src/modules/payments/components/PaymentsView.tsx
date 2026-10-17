"use client";

import { useState, useMemo } from "react";
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Printer,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  Calendar,
  User,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { StatCard } from "@/components/ui/StatCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { useGymStore, PaymentTransaction } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function PaymentsView() {
  const { payments, members, plans, settings, addPayment, updatePaymentStatus } = useGymStore();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Record Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: members[0]?.id || "",
    amount: "49.00",
    planName: "Standard Monthly Membership",
    paymentMethod: "Credit Card" as PaymentTransaction["paymentMethod"],
    status: "Paid" as PaymentTransaction["status"],
  });

  // Invoice Preview Modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  // Stats calculation
  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingDues = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedTotal = payments
    .filter((p) => p.status === "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  // Filtered transactions
  const filteredPayments = useMemo(() => {
    return payments.filter((tx) => {
      const matchesSearch =
        tx.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.planName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || tx.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesMethod = methodFilter === "all" || tx.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === formData.memberId);
    if (!member) {
      showToast({ type: "danger", title: "Error", message: "Please select a member." });
      return;
    }

    const amountNum = parseFloat(formData.amount) || 0;
    if (amountNum <= 0) {
      showToast({ type: "danger", title: "Error", message: "Enter a valid payment amount." });
      return;
    }

    const newTx = addPayment({
      memberId: member.id,
      memberName: member.name,
      planName: formData.planName,
      amount: amountNum,
      date: new Date().toISOString().split("T")[0],
      status: formData.status,
      paymentMethod: formData.paymentMethod,
    });

    showToast({
      type: "success",
      title: "Payment Processed",
      message: `Invoice ${newTx.invoiceNumber} recorded for $${amountNum.toFixed(2)}.`,
    });

    setPaymentModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: PaymentTransaction["status"]) => {
    switch (status) {
      case "Paid":
        return <Badge variant="success">Paid</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      case "Refunded":
        return <Badge variant="danger">Refunded</Badge>;
    }
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Billing & Payments Ledger
              </h1>
              <Badge variant="success">Simulated Financials</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Point of sale entries, invoice receipts, pending dues, and billing history.
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={() => setPaymentModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Record Transaction
          </Button>
        </div>

        {/* Financial KPI Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Collected Revenue"
            value={`$${totalPaid.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4" />}
            variant="success"
            trend="All verified payments"
          />
          <StatCard
            label="Pending Invoices"
            value={`$${pendingDues.toFixed(2)}`}
            icon={<AlertCircle className="h-4 w-4" />}
            variant="warning"
            trend={`${payments.filter((p) => p.status === "Pending").length} unpaid dues`}
          />
          <StatCard
            label="Processed Refunds"
            value={`$${refundedTotal.toFixed(2)}`}
            icon={<CreditCard className="h-4 w-4" />}
            variant="info"
          />
        </div>

        {/* Search & Filters */}
        <Card className="p-3 bg-surface/40 border-border/80">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <Input
              placeholder="Search invoice #, member, or plan..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<Search className="h-3.5 w-3.5 text-text-muted" />}
            />

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </Select>

            <Select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Payment Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI / Net Banking">UPI / Net Banking</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
            </Select>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-text-muted">
                      No payment transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <span className="font-mono text-xs font-semibold text-primary">
                          {tx.invoiceNumber}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-semibold text-text-primary">{tx.memberName}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-text-secondary">{tx.planName}</span>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs font-bold text-text-primary tabular-nums">
                          ${tx.amount.toFixed(2)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-text-muted">{tx.paymentMethod}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono text-text-secondary tabular-nums">{tx.date}</span>
                      </TableCell>

                      <TableCell>{getStatusBadge(tx.status)}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="line"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => {
                              setSelectedTx(tx);
                              setInvoiceModalOpen(true);
                            }}
                          >
                            <FileText className="h-3 w-3" />
                            Invoice
                          </Button>

                          {tx.status === "Pending" && (
                            <Button
                              variant="subtle"
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => {
                                updatePaymentStatus(tx.id, "Paid");
                                showToast({
                                  type: "success",
                                  title: "Marked as Paid",
                                  message: `Invoice ${tx.invoiceNumber} is now marked Paid.`,
                                });
                              }}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-text-muted">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredPayments.length)} of{" "}
                {filteredPayments.length} transactions
              </p>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Record Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record New Transaction"
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <FormField label="Member" required>
            <Select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount ($)" required>
              <Input
                type="number"
                step="0.01"
                placeholder="49.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Payment Method">
              <Select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentMethod: e.target.value as PaymentTransaction["paymentMethod"],
                  })
                }
              >
                <option value="Credit Card">Credit Card</option>
                <option value="UPI / Net Banking">UPI / Net Banking</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Description / Plan">
            <Input
              placeholder="e.g. Pro Performance Renewal or Personal Training"
              value={formData.planName}
              onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
            />
          </FormField>

          <FormField label="Initial Payment Status">
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as PaymentTransaction["status"],
                })
              }
            >
              <option value="Paid">Paid (Settled)</option>
              <option value="Pending">Pending Due</option>
              <option value="Refunded">Refunded</option>
            </Select>
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save Transaction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invoice Preview & Printable Dialog */}
      <Modal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Official Tax Invoice Receipt"
        size="lg"
      >
        {selectedTx && (
          <div className="space-y-6 print:p-0">
            {/* Printable Invoice Shell */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-6">
              {/* Gym & Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{settings.gymName}</h2>
                  <p className="text-xs text-text-muted mt-1">{settings.address}</p>
                  <p className="text-xs text-text-muted">{settings.email} • {settings.phone}</p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant={selectedTx.status === "Paid" ? "success" : "warning"} className="text-sm px-3 py-1">
                    {selectedTx.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm font-mono font-bold text-primary mt-2">
                    {selectedTx.invoiceNumber}
                  </p>
                  <p className="text-xs text-text-muted">Issue Date: {selectedTx.date}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="rounded-xl border border-border bg-surface p-4 text-xs space-y-1">
                <span className="font-semibold uppercase tracking-wider text-text-muted">Billed To:</span>
                <p className="font-bold text-sm text-text-primary">{selectedTx.memberName}</p>
                <p className="text-text-secondary">Member ID: {selectedTx.memberId}</p>
                <p className="text-text-secondary">Payment Mode: {selectedTx.paymentMethod}</p>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-text-muted uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 font-medium text-text-primary">
                      {selectedTx.planName}
                    </td>
                    <td className="py-3 text-right">1</td>
                    <td className="py-3 text-right">${selectedTx.amount.toFixed(2)}</td>
                    <td className="py-3 text-right font-bold text-text-primary">
                      ${selectedTx.amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-4 border-t border-border">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal:</span>
                    <span>${selectedTx.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Tax (0% included):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-text-primary pt-2 border-t border-border">
                    <span>Total Amount:</span>
                    <span>${selectedTx.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 print:hidden">
              <Button variant="ghost" onClick={() => setInvoiceModalOpen(false)}>
                Close
              </Button>
              <Button variant="solid" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print / Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Shell>
  );
}


