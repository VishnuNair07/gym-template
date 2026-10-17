"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  CalendarCheck,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Receipt,
  Dumbbell,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { useGymStore } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function DashboardView() {
  const {
    members,
    plans,
    attendance,
    payments,
    classes,
    checkInMember,
    checkOutMember,
    addMember,
    addPayment,
    updateMember,
  } = useGymStore();

  const { showToast } = useToast();

  // Quick Action Modals
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedMemberForCheckin, setSelectedMemberForCheckin] = useState("");
  const [lockerNumberInput, setLockerNumberInput] = useState("");

  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    planId: plans[0]?.id || "",
    emergencyContact: "",
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    memberId: members[0]?.id || "",
    amount: "49",
    planName: "Standard Monthly",
    paymentMethod: "Credit Card" as const,
  });

  const [chartView, setChartView] = useState<"revenue" | "members">("revenue");

  // Calculations
  const activeMembers = members.filter((m) => m.status === "Active");
  const expiringMembers = members.filter((m) => {
    if (m.status !== "Active") return false;
    const expiry = new Date(m.expiryDate).getTime();
    const now = new Date("2026-10-17").getTime();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  const currentlyInGym = attendance.filter((a) => a.status === "In Gym");
  const todayAttendance = attendance.filter((a) => a.date === "2026-10-17");

  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Quick Check-in Handler
  const handleQuickCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForCheckin) {
      showToast({ type: "danger", title: "Error", message: "Please select a member to check in." });
      return;
    }

    const member = members.find((m) => m.id === selectedMemberForCheckin);
    if (member?.status === "Expired") {
      showToast({
        type: "warning",
        title: "Membership Expired",
        message: `${member.name}'s membership is expired. Please renew first.`,
      });
      return;
    }

    checkInMember(selectedMemberForCheckin, lockerNumberInput);
    showToast({
      type: "success",
      title: "Check-in Successful",
      message: `${member?.name} has checked into the facility.`,
    });
    setCheckInModalOpen(false);
    setSelectedMemberForCheckin("");
    setLockerNumberInput("");
  };

  // Quick Add Member Handler
  const handleQuickAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim() || !newMemberForm.email.trim()) {
      showToast({ type: "danger", title: "Validation Error", message: "Name and Email are required." });
      return;
    }

    const selectedPlan = plans.find((p) => p.id === newMemberForm.planId) || plans[0];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + (selectedPlan?.durationMonths || 1));

    addMember({
      name: newMemberForm.name,
      email: newMemberForm.email,
      phone: newMemberForm.phone || "+1 (555) 000-0000",
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      emergencyContact: newMemberForm.emergencyContact,
    });

    showToast({
      type: "success",
      title: "Member Added",
      message: `${newMemberForm.name} was successfully registered!`,
    });

    setAddMemberModalOpen(false);
    setNewMemberForm({
      name: "",
      email: "",
      phone: "",
      planId: plans[0]?.id || "",
      emergencyContact: "",
    });
  };

  // Quick Record Payment Handler
  const handleQuickPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === paymentForm.memberId);
    if (!member) return;

    addPayment({
      memberId: member.id,
      memberName: member.name,
      planName: paymentForm.planName,
      amount: parseFloat(paymentForm.amount) || 0,
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
      paymentMethod: paymentForm.paymentMethod,
    });

    showToast({
      type: "success",
      title: "Payment Recorded",
      message: `Received $${paymentForm.amount} from ${member.name}.`,
    });

    setPaymentModalOpen(false);
  };

  // Renew member action
  const handleRenewMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const plan = plans.find((p) => p.id === member.planId) || plans[0];

    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    baseDate.setMonth(baseDate.getMonth() + (plan.durationMonths || 1));

    updateMember(memberId, {
      status: "Active",
      expiryDate: baseDate.toISOString().split("T")[0],
    });

    addPayment({
      memberId: member.id,
      memberName: member.name,
      planName: `${plan.name} (Renewal)`,
      amount: plan.price,
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
      paymentMethod: "Credit Card",
    });

    showToast({
      type: "success",
      title: "Membership Renewed",
      message: `${member.name}'s plan has been extended to ${baseDate.toISOString().split("T")[0]}.`,
    });
  };

  // Revenue chart mock data
  const revenueChartData = [
    { month: "May", rev: 14200, members: 310, height: 60 },
    { month: "Jun", rev: 15800, members: 335, height: 68 },
    { month: "Jul", rev: 16400, members: 350, height: 72 },
    { month: "Aug", rev: 17100, members: 368, height: 78 },
    { month: "Sep", rev: 18200, members: 382, height: 85 },
    { month: "Oct (Live)", rev: 19450, members: 395, height: 95 },
  ];

  return (
    <Shell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Gym Operations Dashboard
              </h1>
              <Badge variant="success">Live Facility</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Real-time member activity, turnstile scans, active revenue, and capacity metrics.
            </p>
          </div>

          {/* Quick-action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="solid"
              size="sm"
              onClick={() => setCheckInModalOpen(true)}
              className="gap-1.5"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Quick Check-in
            </Button>

            <Button
              variant="line"
              size="sm"
              onClick={() => setAddMemberModalOpen(true)}
              className="gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              New Member
            </Button>

            <Button
              variant="line"
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              className="gap-1.5"
            >
              <DollarSign className="h-3.5 w-3.5" />
              Record Payment
            </Button>

            <Link href="/classes">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Dumbbell className="h-3.5 w-3.5" />
                Classes
              </Button>
            </Link>
          </div>
        </div>

        {/* Priority Insight / Tonal Card if there are expiring memberships */}
        {expiringMembers.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-warning/20 bg-warning-subtle/30 px-4 py-3 text-text-primary">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warning/15 text-warning ring-1 ring-warning/20">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  {expiringMembers.length} Memberships expiring within 30 days
                </p>
                <p className="text-[11px] text-text-muted">
                  Send renewal reminders or extend membership passes to prevent churn.
                </p>
              </div>
            </div>
            <Link href="/members?filter=expiring">
              <Button variant="line" size="sm" className="text-xs shrink-0 self-start sm:self-auto border-warning/30 hover:bg-warning/10">
                Review Renewals
              </Button>
            </Link>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            title="Total Active Members"
            value={activeMembers.length}
            icon={<Users className="h-5 w-5" />}
            accentColor="primary"
            delta={{ value: "+12.4%", positive: true, label: "vs last month" }}
            meta={[
              { label: "New this week", value: "8 members" },
              { label: "Frozen accounts", value: `${members.filter((m) => m.status === "Frozen").length}` },
            ]}
          />

          <MetricCard
            title="Monthly Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            accentColor="success"
            delta={{ value: "+8.5%", positive: true, label: "vs target" }}
            meta={[
              { label: "Avg Membership", value: "$68.50" },
              { label: "Pending Dues", value: "$49.00" },
            ]}
          />

          <MetricCard
            title="Today's Check-ins"
            value={todayAttendance.length}
            icon={<CalendarCheck className="h-5 w-5" />}
            accentColor="info"
            delta={{ value: "+18%", positive: true, label: "peak hour pace" }}
            meta={[
              { label: "Currently on floor", value: `${currentlyInGym.length} members` },
              { label: "Avg workout time", value: "68 min" },
            ]}
          />

          <MetricCard
            title="Active Classes Today"
            value={classes.length}
            icon={<Dumbbell className="h-5 w-5" />}
            accentColor="warning"
            delta={{ value: "88%", positive: true, label: "avg capacity fill" }}
            meta={[
              { label: "Total slots", value: "82 slots" },
              { label: "Waitlisted", value: "4 members" },
            ]}
          />
        </div>

        {/* Two-column Layout (Left: Content 8-cols, Right: Rail 4-cols) */}
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
          {/* Left Column (col-span-8) */}
          <div className="space-y-6 2xl:col-span-8">
            {/* Revenue and Membership Growth Visualizer */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle>Financial & Membership Trajectory</CardTitle>
                    <CardDescription>
                      Performance trends over the last 6 months
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => setChartView("revenue")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        chartView === "revenue"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      Revenue ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartView("members")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        chartView === "members"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      Active Members
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold tracking-tight text-text-primary">
                        {chartView === "revenue" ? "$19,450" : "395"}
                      </span>
                      <span className="ml-2 text-xs font-medium text-success">
                        +14.2% Growth
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">Updated 10 minutes ago</span>
                  </div>

                  {/* Chart Bar Visualization */}
                  <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-52 pt-6 pb-2 border-b border-border/70">
                    {revenueChartData.map((item, idx) => {
                      const isMax = idx === revenueChartData.length - 1;
                      return (
                        <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                          <div className="text-[10px] font-semibold font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                            {chartView === "revenue" ? `$${(item.rev / 1000).toFixed(1)}k` : item.members}
                          </div>
                          <div
                            style={{ height: `${item.height}%` }}
                            className={`w-full max-w-[38px] rounded-t-sm transition-all duration-300 ${
                              isMax
                                ? "bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-primary-hover"
                                : "bg-primary/20 hover:bg-primary/35 border-t border-primary/30"
                            }`}
                          />
                          <span className="mt-2 text-xs font-medium text-text-muted">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-primary" />
                        <span className="text-[11px] text-text-muted">Current Month Projection</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-primary/20 border border-primary/30" />
                        <span className="text-[11px] text-text-muted">Historical Performance</span>
                      </div>
                    </div>
                    <Link
                      href="/reports"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                    >
                      Full Reports <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Summaries & Occupancy Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Facility Occupancy & Peak Hours</CardTitle>
                    <CardDescription>
                      Hourly floor crowd distribution (Average weekday)
                    </CardDescription>
                  </div>
                  <Badge variant="info">Peak: 6 PM - 8 PM</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { slot: "06:00 AM - 09:00 AM (Early Birds)", load: 78, label: "High Volume" },
                    { slot: "09:00 AM - 12:00 PM (Mid Morning)", load: 45, label: "Moderate" },
                    { slot: "12:00 PM - 02:00 PM (Lunch Circuit)", load: 60, label: "Active" },
                    { slot: "02:00 PM - 05:00 PM (Off-Peak Quiet)", load: 28, label: "Low Capacity" },
                    { slot: "05:00 PM - 08:30 PM (Evening Prime)", load: 92, label: "Near Full (92%)" },
                    { slot: "08:30 PM - 11:00 PM (Late Night)", load: 35, label: "Light" },
                  ].map((period) => (
                    <div key={period.slot} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-text-primary">{period.slot}</span>
                        <span className="text-text-muted tabular-nums text-[11px]">{period.label} ({period.load}%)</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
                        <div
                          style={{ width: `${period.load}%` }}
                          className={`h-full rounded-full transition-all ${
                            period.load > 85
                              ? "bg-danger"
                              : period.load > 60
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Today's Check-ins */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Facility Activity Stream</CardTitle>
                    <CardDescription>
                      Real-time member scans at the turnstile & gym floor
                    </CardDescription>
                  </div>
                  <Link href="/attendance">
                    <Button variant="ghost" size="sm">
                      View All Logs
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {attendance.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                          {log.memberName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-primary">
                            {log.memberName}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono tabular-nums">
                            <Clock className="h-3 w-3" />
                            <span>In: {log.checkInTime}</span>
                            {log.checkOutTime && <span>• Out: {log.checkOutTime}</span>}
                            {log.lockerNumber && <span>• Locker {log.lockerNumber}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {log.status === "In Gym" ? (
                          <>
                            <Badge variant="success">In Gym</Badge>
                            <Button
                              variant="line"
                              size="sm"
                              onClick={() => {
                                checkOutMember(log.id);
                                showToast({
                                  type: "info",
                                  title: "Checked Out",
                                  message: `${log.memberName} has checked out.`,
                                });
                              }}
                            >
                              Check Out
                            </Button>
                          </>
                        ) : (
                          <Badge variant="neutral">Completed</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Rail Column (col-span-4) */}
          <div className="space-y-6 2xl:col-span-4">
            {/* Upcoming Membership Expirations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Expirations</CardTitle>
                  <Badge variant="warning">{expiringMembers.length} Expiring</Badge>
                </div>
                <CardDescription>
                  Memberships requiring renewal this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expiringMembers.length === 0 ? (
                  <p className="py-4 text-center text-xs text-text-muted">
                    No active memberships expiring soon.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {expiringMembers.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-border/80 bg-surface-secondary/50 p-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-text-primary">{m.name}</p>
                            <p className="text-[11px] text-text-muted">{m.planName}</p>
                            <p className="mt-1 text-[11px] font-mono tabular-nums text-warning">
                              Expires: {m.expiryDate}
                            </p>
                          </div>
                          <Button
                            variant="line"
                            size="sm"
                            onClick={() => handleRenewMember(m.id)}
                            className="text-xs h-7 px-2"
                          >
                            Renew
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Financial Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Payments</CardTitle>
                  <Link href="/payments" className="text-xs text-primary font-medium hover:underline">
                    View All
                  </Link>
                </div>
                <CardDescription>Latest membership & personal trainer sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {payments.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between border-b border-border/60 pb-2.5 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-text-primary">
                          {tx.memberName}
                        </p>
                        <p className="truncate text-[11px] text-text-muted">
                          {tx.planName} • {tx.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold font-mono tabular-nums text-text-primary">
                          ${tx.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            tx.status === "Paid"
                              ? "success"
                              : tx.status === "Pending"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick AI Insight Assistant Demonstration */}
            <Card className="border-border/80 bg-surface/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <CardTitle>AI Operations Advisor</CardTitle>
                    <CardDescription>Real-time predictive telemetry</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border/80 bg-background/80 p-3 text-xs leading-relaxed text-text-secondary">
                  <p className="font-semibold text-text-primary mb-1">
                    Recommendation for Tonight:
                  </p>
                  Peak evening occupancy is trending at 92%. Scheduling an additional instructor
                  on the Iron Arena turf will reduce equipment wait time by ~24%.
                </div>
                <Link href="/ai-assistant">
                  <Button variant="subtle" size="sm" block className="gap-2">
                    Open AI Demonstration <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Check-in Modal */}
      <Modal
        open={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        title="Check-in Member to Facility"
      >
        <form onSubmit={handleQuickCheckin} className="space-y-4">
          <FormField label="Select Member" required>
            <Select
              value={selectedMemberForCheckin}
              onChange={(e) => setSelectedMemberForCheckin(e.target.value)}
              required
            >
              <option value="">-- Choose active member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.planName}) - [{m.status}]
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Assigned Locker Number (Optional)" helper="e.g. L-12 or leave blank for auto">
            <Input
              placeholder="e.g. L-18"
              value={lockerNumberInput}
              onChange={(e) => setLockerNumberInput(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Complete Check-in
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Add Member Modal */}
      <Modal
        open={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        title="Register New Gym Member"
        size="lg"
      >
        <form onSubmit={handleQuickAddMember} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required>
              <Input
                placeholder="Marcus Vance"
                value={newMemberForm.name}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Email Address" required>
              <Input
                type="email"
                placeholder="marcus@example.com"
                value={newMemberForm.email}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                placeholder="+1 (555) 000-0000"
                value={newMemberForm.phone}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
              />
            </FormField>

            <FormField label="Membership Plan" required>
              <Select
                value={newMemberForm.planId}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, planId: e.target.value })}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price} / {p.durationMonths}mo)
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Emergency Contact (Name & Phone)">
            <Input
              placeholder="Jane Vance (+1 555-999-8888)"
              value={newMemberForm.emergencyContact}
              onChange={(e) =>
                setNewMemberForm({ ...newMemberForm, emergencyContact: e.target.value })
              }
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setAddMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Register & Save Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Record Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Member Payment"
      >
        <form onSubmit={handleQuickPayment} className="space-y-4">
          <FormField label="Select Member" required>
            <Select
              value={paymentForm.memberId}
              onChange={(e) => setPaymentForm({ ...paymentForm, memberId: e.target.value })}
            >
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
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Payment Method">
              <Select
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value as typeof paymentForm.paymentMethod,
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

          <FormField label="Description / Plan Reference">
            <Input
              value={paymentForm.planName}
              onChange={(e) => setPaymentForm({ ...paymentForm, planName: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save Payment
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}

