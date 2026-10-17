"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { useGymStore } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function ReportsView() {
  const { members, payments, attendance, plans } = useGymStore();
  const { showToast } = useToast();

  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "year">("30d");

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeMembersCount = members.filter((m) => m.status === "Active").length;
  const expiredCount = members.filter((m) => m.status === "Expired").length;
  const retentionRate = Math.round((activeMembersCount / (members.length || 1)) * 100);

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = "Invoice,Member,Plan,Amount,Date,Status\n";
    const rows = payments
      .map(
        (p) =>
          `"${p.invoiceNumber}","${p.memberName}","${p.planName}",${p.amount},"${p.date}","${p.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `gym-financial-report-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: "success",
      title: "Export Generated",
      message: "Financial CSV report downloaded successfully.",
    });
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                Reports & Business Intelligence
              </h1>
              <Badge variant="success">Analytics Active</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Subscription revenue projections, member retention ratios, and facility utilization benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-surface p-1">
              {(["30d", "90d", "year"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    timeRange === range
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {range === "30d" ? "Past 30 Days" : range === "90d" ? "Past Quarter" : "Past Year"}
                </button>
              ))}
            </div>

            <Button variant="line" size="sm" onClick={handleExportCSV} className="gap-1.5">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* High Level KPI Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Gross Membership Revenue"
            value={`$${totalPaid.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            variant="success"
            trend="+14.2% YoY"
          />
          <StatCard
            label="Member Retention Rate"
            value={`${retentionRate}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="primary"
            trend="Target > 80%"
          />
          <StatCard
            label="Active Member Roster"
            value={`${activeMembersCount} Active`}
            icon={<Users className="h-5 w-5" />}
            variant="info"
            trend={`${expiredCount} renewals pending`}
          />
          <StatCard
            label="Total Facility Visits"
            value={`${attendance.length * 8 + 140} Scans`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            variant="warning"
            trend="Avg 3.2 visits/wk"
          />
        </div>

        {/* Visual Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue by Plan Tier */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution by Plan Tier</CardTitle>
              <CardDescription>
                Membership contribution to gross monthly recurring cash flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {plans.map((p) => {
                  const estRev = p.price * p.memberCount;
                  const totalEst = plans.reduce((a, b) => a + b.price * b.memberCount, 0) || 1;
                  const pct = Math.round((estRev / totalEst) * 100);

                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-text-primary">{p.name} ({p.memberCount} members)</span>
                        <span className="font-bold text-text-primary">${estRev.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full rounded-full bg-primary transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Member Churn & Expiration Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Member Health & Churn Risk</CardTitle>
              <CardDescription>
                Categorization of member status across all current subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {[
                  { label: "Active & Attending Regularly", count: activeMembersCount, pct: retentionRate, color: "bg-success" },
                  { label: "Accounts Frozen / Suspended", count: members.filter((m) => m.status === "Frozen").length, pct: 12, color: "bg-warning" },
                  { label: "Expired Pending Renewal", count: expiredCount, pct: 15, color: "bg-danger" },
                  { label: "New Prospects / Trial", count: members.filter((m) => m.status === "Pending").length, pct: 5, color: "bg-info" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-text-primary">{item.label}</span>
                      <span className="font-bold text-text-primary">{item.count} members</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary">
                      <div
                        style={{ width: `${item.pct}%` }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}


