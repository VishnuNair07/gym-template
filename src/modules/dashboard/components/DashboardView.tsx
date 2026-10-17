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
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Activity,
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

  const tierDistribution = [
    { name: "Black Elite Tier", pct: 22, color: "bg-primary" },
    { name: "Gold Premium", pct: 41, color: "bg-cyan-500" },
    { name: "Standard Monthly", pct: 26, color: "bg-indigo-500" },
    { name: "Student / Off-Peak", pct: 8, color: "bg-amber-500" },
    { name: "Day Pass / Trial", pct: 3, color: "bg-rose-500" },
  ];

  const trainerActivity = [
    { name: "Marcus Vance", count: 42, pct: 90 },
    { name: "Elena Rostova", count: 38, pct: 82 },
    { name: "Sarah Jenkins", count: 29, pct: 64 },
    { name: "David Kim", count: 24, pct: 52 },
    { name: "Maya Patel", count: 19, pct: 41 },
  ];

  return (
    <Shell>
      <div className="space-y-5">
        {/* Top Header Card matching Screenshot Overview */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-text-muted uppercase">
                GYM OPERATIONS PLATFORM OVERVIEW
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-text-primary">
                Apex Gym Admin Console
              </h1>
              <p className="mt-1 text-xs text-text-muted">
                Downtown Elite Facility · Oct 17, 2026 · 21:58 IST
              </p>
            </div>

            {/* Alert badge on the top right */}
            {expiringMembers.length > 0 && (
              <Link
                href="/members?filter=expiring"
                className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-3.5 py-1 text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
              >
                <span className="flex h-2 w-2 rounded-full bg-danger animate-pulse" />
                <span>{expiringMembers.length} memberships need review</span>
              </Link>
            )}
          </div>

          {/* 5-Column Metrics Row with Subtle Hairline Dividers */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/40 pt-5 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-border/30">
            {/* Metric 1 */}
            <div className="px-2 first:pl-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                TOTAL MEMBERS
              </p>
              <p className="mt-1 text-2xl font-extrabold text-text-primary tabular-nums">
                {activeMembers.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-primary flex items-center gap-1">
                <span>+21</span>
                <span className="text-text-muted font-normal">total in system</span>
              </p>
            </div>

            {/* Metric 2 */}
            <div className="px-2 sm:pl-4 pt-3 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                CHECK-INS TODAY
              </p>
              <p className="mt-1 text-2xl font-extrabold text-text-primary tabular-nums">
                {todayAttendance.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-primary flex items-center gap-1">
                <span>↗ 24%</span>
                <span className="text-text-muted font-normal">peak floor occupancy</span>
              </p>
            </div>

            {/* Metric 3 */}
            <div className="px-2 sm:pl-4 pt-3 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                AVG FITNESS SCORE
              </p>
              <p className="mt-1 text-2xl font-extrabold text-text-primary tabular-nums">
                8.4
              </p>
              <p className="mt-1 text-xs font-semibold text-cyan-500 flex items-center gap-1">
                <span>↗ active</span>
                <span className="text-text-muted font-normal">member rating</span>
              </p>
            </div>

            {/* Metric 4 */}
            <div className="px-2 sm:pl-4 pt-3 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                PENDING DUES
              </p>
              <p className="mt-1 text-2xl font-extrabold text-danger tabular-nums">
                {expiringMembers.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-danger flex items-center gap-1">
                <span>! {expiringMembers.length}</span>
                <span className="text-text-muted font-normal">requires front-desk review</span>
              </p>
            </div>

            {/* Metric 5 */}
            <div className="px-2 sm:pl-4 pt-3 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                ACTIVE TRAINERS
              </p>
              <p className="mt-1 text-2xl font-extrabold text-text-primary tabular-nums">
                12
              </p>
              <p className="mt-1 text-xs font-semibold text-primary flex items-center gap-1">
                <span>10</span>
                <span className="text-text-muted font-normal">active on floor now</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Row matching Screenshot */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mr-1">
              QUICK ACTIONS
            </span>

            <button
              type="button"
              onClick={() => setAddMemberModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-all"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Member</span>
            </button>

            <button
              type="button"
              onClick={() => setCheckInModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-2xs hover:border-primary hover:text-primary hover:bg-surface-secondary/50 transition-all"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Quick Check-in</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-2xs hover:border-primary hover:text-primary hover:bg-surface-secondary/50 transition-all"
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>Record Payment</span>
            </button>

            <Link href="/classes">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-2xs hover:border-primary hover:text-primary hover:bg-surface-secondary/50 transition-all"
              >
                <Dumbbell className="h-3.5 w-3.5" />
                <span>Schedule Class</span>
              </button>
            </Link>
          </div>

          {/* Date Range Selector */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary self-start sm:self-auto shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-text-muted" />
            <span>Oct 2026</span>
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </div>
        </div>

        {/* Analytics Section Title */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-base font-extrabold tracking-tight text-text-primary">
            Facility Analytics
          </h2>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            Full report <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Analytics Cards Grid matching Screenshot */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Card 1: Check-in Volume */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-primary">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Check-in Volume</h3>
                    <p className="text-[11px] text-text-muted">Daily volume · last 7 days</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-semibold text-text-secondary">
                  <span>7 days</span>
                  <ChevronDown className="h-3 w-3 text-text-muted" />
                </div>
              </div>

              {/* Curved SVG Area/Line Chart */}
              <div className="mt-5 w-full">
                <svg viewBox="0 0 320 90" className="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="gymChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--app-primary)" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="var(--app-primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 55 C 35 45, 65 22, 105 34 C 145 46, 185 70, 225 78 C 265 86, 295 90, 320 84 L 320 90 L 0 90 Z"
                    fill="url(#gymChartGrad)"
                  />
                  <path
                    d="M 0 55 C 35 45, 65 22, 105 34 C 145 46, 185 70, 225 78 C 265 86, 295 90, 320 84"
                    fill="none"
                    stroke="var(--app-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom 3 Summary Stats with Subtle Vertical Dividers */}
            <div className="mt-4 grid grid-cols-3 border-t border-border/40 pt-4 text-center divide-x divide-border/30">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">TODAY</p>
                <p className="mt-0.5 text-base font-extrabold text-text-primary tabular-nums">47</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">PEAK (FRI)</p>
                <p className="mt-0.5 text-base font-extrabold text-text-primary tabular-nums">58</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">7D AVG</p>
                <p className="mt-0.5 text-base font-extrabold text-text-primary tabular-nums">41</p>
              </div>
            </div>
          </div>

          {/* Card 2: Membership Tier Distribution */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Score Distribution</h3>
                  <p className="text-[11px] text-text-muted">All completed interviews / tiers</p>
                </div>
              </div>

              {/* Stacked colored horizontal bars */}
              <div className="mt-4 space-y-2.5">
                {tierDistribution.map((tier) => (
                  <div key={tier.name} className="flex items-center gap-3 text-xs">
                    <span className="w-28 shrink-0 truncate text-text-secondary text-[11px]">
                      {tier.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        style={{ width: `${tier.pct}%` }}
                        className={`h-full rounded-full ${tier.color}`}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-mono text-[11px] font-bold text-text-muted tabular-nums">
                      {tier.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Block */}
            <div className="mt-4 border-t border-border/40 pt-3">
              <p className="text-[10px] font-bold tracking-wider uppercase text-text-muted">INSIGHT</p>
              <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                63% of active members maintain recurring annual or elite tier subscriptions.
              </p>
            </div>
          </div>

          {/* Card 3: Trainer Activity */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Recruiter / Trainer Activity</h3>
                  <p className="text-[11px] text-text-muted">Candidates / sessions added · this week</p>
                </div>
              </div>

              {/* Ranked dark horizontal bars with name on left and count on right */}
              <div className="mt-4 space-y-2.5">
                {trainerActivity.map((coach) => (
                  <div key={coach.name} className="flex items-center gap-3 text-xs">
                    <span className="w-24 shrink-0 truncate text-text-secondary font-medium text-[11px]">
                      {coach.name}
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        style={{ width: `${coach.pct}%` }}
                        className="h-full rounded-full bg-text-primary"
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right font-mono text-[11px] font-bold text-text-primary tabular-nums">
                      {coach.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Block */}
            <div className="mt-4 border-t border-border/40 pt-3">
              <p className="text-[10px] font-bold tracking-wider uppercase text-text-muted">TOTAL</p>
              <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                96 candidate & member sessions logged across 12 trainers this week.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Check-ins and Needs Review */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Table: Recent Check-ins (8 cols) */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Recent Facility Check-ins ({attendance.length} of 21)
                </h3>
                <p className="text-[11px] text-text-muted">Turnstile badge scans & current gym floor occupancy</p>
              </div>
              <Link
                href="/attendance"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View all logs <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border overflow-x-auto">
              {attendance.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {log.memberName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary leading-tight">
                        {log.memberName}
                      </p>
                      <p className="text-[10px] text-text-muted font-mono tabular-nums">
                        In: {log.checkInTime} • {log.lockerNumber ? `Locker ${log.lockerNumber}` : "No locker"}
                      </p>
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
                          className="h-6 text-[10px] px-2"
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
          </div>

          {/* Right Card: Needs Review (4 cols) */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Needs Review ({expiringMembers.length} pending)
                </h3>
                <p className="text-[11px] text-text-muted">Memberships expiring within 30 days</p>
              </div>
              <Link
                href="/members?filter=expiring"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {expiringMembers.length === 0 ? (
                <p className="py-6 text-center text-xs text-text-muted">
                  All memberships are in good standing.
                </p>
              ) : (
                expiringMembers.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-xl bg-surface-secondary/70 p-3 transition-colors hover:bg-surface-secondary"
                  >
                    <div>
                      <p className="text-xs font-bold text-text-primary">{m.name}</p>
                      <p className="text-[10px] text-text-muted">{m.planName}</p>
                      <p className="text-[10px] font-mono tabular-nums text-danger mt-0.5">
                        Expires: {m.expiryDate}
                      </p>
                    </div>
                    <Button
                      variant="solid"
                      size="sm"
                      onClick={() => handleRenewMember(m.id)}
                      className="h-7 text-xs px-2.5"
                    >
                      Renew
                    </Button>
                  </div>
                ))
              )}
            </div>
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

          <div className="flex justify-end gap-2 pt-3">
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

