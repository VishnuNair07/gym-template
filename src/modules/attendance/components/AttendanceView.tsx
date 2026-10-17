"use client";

import { useState, useMemo } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  LogOut,
  Users,
  ShieldAlert,
  Flame,
  DoorOpen,
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
import { useGymStore, AttendanceRecord } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function AttendanceView() {
  const { members, attendance, checkInMember, checkOutMember } = useGymStore();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "In Gym" | "Completed">("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Check-in Modal
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [lockerNumber, setLockerNumber] = useState("");

  const currentlyInGym = attendance.filter((a) => a.status === "In Gym");
  const completedToday = attendance.filter((a) => a.status === "Completed" && a.date === "2026-10-17");

  // Filtered attendance list
  const filteredRecords = useMemo(() => {
    return attendance.filter((rec) => {
      const matchesSearch =
        rec.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.lockerNumber && rec.lockerNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || rec.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = rec.date === "2026-10-17";
      } else if (dateFilter === "yesterday") {
        matchesDate = rec.date === "2026-10-16";
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendance, searchQuery, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      showToast({ type: "danger", title: "Error", message: "Please select a member to check in." });
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    if (member?.status === "Expired") {
      showToast({
        type: "warning",
        title: "Membership Expired",
        message: `${member.name}'s membership is expired. Please renew first.`,
      });
      return;
    }

    // Check if already in gym
    const alreadyIn = attendance.find((a) => a.memberId === selectedMemberId && a.status === "In Gym");
    if (alreadyIn) {
      showToast({
        type: "info",
        title: "Already Checked In",
        message: `${member?.name} is already recorded on the gym floor (Locker: ${alreadyIn.lockerNumber}).`,
      });
      setCheckInModalOpen(false);
      return;
    }

    const rec = checkInMember(selectedMemberId, lockerNumber);
    showToast({
      type: "success",
      title: "Check-in Complete",
      message: `${member?.name} checked in successfully. Assigned locker ${rec.lockerNumber}.`,
    });

    setCheckInModalOpen(false);
    setSelectedMemberId("");
    setLockerNumber("");
  };

  const handleCheckOut = (record: AttendanceRecord) => {
    checkOutMember(record.id);
    showToast({
      type: "info",
      title: "Member Checked Out",
      message: `${record.memberName} has exited the facility. Locker ${record.lockerNumber} released.`,
    });
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Turnstile & Attendance Tracker
              </h1>
              <Badge variant="success">Floor Live</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Live scan logs, locker tracking, check-ins, check-outs, and gym floor capacity analytics.
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={() => setCheckInModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Check-in Member
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Currently in Gym"
            value={`${currentlyInGym.length} Members`}
            icon={<DoorOpen className="h-4 w-4" />}
            variant="success"
            trend="Active now"
          />
          <StatCard
            label="Today's Total Check-ins"
            value={`${attendance.filter((a) => a.date === "2026-10-17").length}`}
            icon={<CalendarCheck className="h-4 w-4" />}
            variant="primary"
            trend="+12% vs yesterday"
          />
          <StatCard
            label="Workouts Completed Today"
            value={`${completedToday.length}`}
            icon={<CheckCircle2 className="h-4 w-4" />}
            variant="info"
          />
          <StatCard
            label="Peak Floor Capacity"
            value="38% Load"
            icon={<Flame className="h-4 w-4" />}
            variant="warning"
            trend="Peak at 6:30 PM"
          />
        </div>

        {/* Currently On Floor Live Board */}
        {currentlyInGym.length > 0 && (
          <Card className="border-border/80 bg-surface/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success ring-4 ring-success/20 animate-pulse" />
                  <CardTitle>Currently Inside Facility ({currentlyInGym.length})</CardTitle>
                </div>
                <Badge variant="success">Live Scanner</Badge>
              </div>
              <CardDescription>
                Members actively utilizing the gym equipment, lockers, and studios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {currentlyInGym.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/80 bg-background/80 p-2.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                        {item.memberName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-text-primary">{item.memberName}</p>
                        <p className="text-[11px] font-mono tabular-nums text-text-muted">
                          In: {item.checkInTime} • {item.lockerNumber}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="line"
                      size="sm"
                      onClick={() => handleCheckOut(item)}
                      className="text-xs h-7 px-2"
                    >
                      Check Out
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter and Search Bar */}
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              placeholder="Search by member name or locker number..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<Search className="h-4 w-4 text-text-muted" />}
            />

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "In Gym" | "Completed");
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="In Gym">Currently In Gym</option>
              <option value="Completed">Completed Workouts</option>
            </Select>

            <Select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today (Oct 17, 2026)</option>
              <option value="yesterday">Yesterday (Oct 16, 2026)</option>
            </Select>
          </div>
        </Card>

        {/* Attendance Log Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Check-Out Time</TableHead>
                  <TableHead>Locker Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-text-muted">
                      No attendance records found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                            {rec.memberName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{rec.memberName}</p>
                            <p className="text-xs text-text-muted">ID: {rec.memberId}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-text-secondary">{rec.date}</span>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-text-primary">{rec.checkInTime}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-text-secondary">
                          {rec.checkOutTime || "— (Active)"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="neutral">{rec.lockerNumber || "None"}</Badge>
                      </TableCell>

                      <TableCell>
                        {rec.status === "In Gym" ? (
                          <Badge variant="success">In Gym</Badge>
                        ) : (
                          <Badge variant="neutral">Completed</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {rec.status === "In Gym" ? (
                          <Button
                            variant="line"
                            size="sm"
                            onClick={() => handleCheckOut(rec)}
                            className="text-xs h-7 px-2.5"
                          >
                            Check Out
                          </Button>
                        ) : (
                          <span className="text-xs text-text-muted">Done</span>
                        )}
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
                {Math.min(currentPage * pageSize, filteredRecords.length)} of{" "}
                {filteredRecords.length} records
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

      {/* Check-In Modal */}
      <Modal
        open={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        title="Manual Turnstile Check-In"
        size="md"
      >
        <form onSubmit={handleCheckInSubmit} className="space-y-4">
          <FormField label="Select Member" required>
            <Select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">-- Choose member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.planName}) - [{m.status}]
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Locker Number"
            helper="Leave blank to assign next available locker automatically."
          >
            <Input
              placeholder="e.g. L-16"
              value={lockerNumber}
              onChange={(e) => setLockerNumber(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Scan & Check-In
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}

