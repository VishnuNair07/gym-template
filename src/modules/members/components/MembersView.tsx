"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  PauseCircle,
  Calendar,
  Phone,
  Mail,
  Award,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { FormField } from "@/components/ui/FormField";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { useGymStore, Member } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function MembersView() {
  const {
    members,
    plans,
    trainers,
    addMember,
    updateMember,
    deleteMember,
    toggleMemberStatus,
  } = useGymStore();

  const { showToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "joinDate" | "attendance">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected member for Profile Drawer
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Add / Edit Member Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    planId: plans[0]?.id || "",
    status: "Active" as Member["status"],
    emergencyContact: "",
    trainerId: "",
    notes: "",
  });

  // Delete Confirmation Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery);

        const matchesStatus = statusFilter === "all" || m.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesPlan = planFilter === "all" || m.planId === planFilter;

        return matchesSearch && matchesStatus && matchesPlan;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === "name") cmp = a.name.localeCompare(b.name);
        else if (sortBy === "joinDate") cmp = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        else if (sortBy === "attendance") cmp = a.attendanceCount - b.attendanceCount;
        return sortOrder === "asc" ? cmp : -cmp;
      });
  }, [members, searchQuery, statusFilter, planFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMemberId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      planId: plans[0]?.id || "",
      status: "Active",
      emergencyContact: "",
      trainerId: "",
      notes: "",
    });
    setFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (m: Member) => {
    setEditingMemberId(m.id);
    setFormData({
      name: m.name,
      email: m.email,
      phone: m.phone,
      planId: m.planId,
      status: m.status,
      emergencyContact: m.emergencyContact || "",
      trainerId: m.trainerId || "",
      notes: m.notes || "",
    });
    setFormModalOpen(true);
  };

  // Submit Add / Edit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast({ type: "danger", title: "Validation Error", message: "Name and Email are required." });
      return;
    }

    const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0];
    const selectedTrainer = trainers.find((t) => t.id === formData.trainerId);

    if (editingMemberId) {
      updateMember(editingMemberId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        status: formData.status,
        emergencyContact: formData.emergencyContact,
        trainerId: selectedTrainer?.id,
        trainerName: selectedTrainer?.name,
        notes: formData.notes,
      });
      showToast({ type: "success", title: "Member Updated", message: `${formData.name}'s profile was updated.` });

      if (selectedMember && selectedMember.id === editingMemberId) {
        setSelectedMember({
          ...selectedMember,
          ...formData,
          planName: selectedPlan.name,
          trainerName: selectedTrainer?.name,
        });
      }
    } else {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + (selectedPlan.durationMonths || 1));

      addMember({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        status: formData.status,
        joinDate: new Date().toISOString().split("T")[0],
        expiryDate: expiry.toISOString().split("T")[0],
        emergencyContact: formData.emergencyContact,
        trainerId: selectedTrainer?.id,
        trainerName: selectedTrainer?.name,
        notes: formData.notes,
      });
      showToast({ type: "success", title: "Member Created", message: `${formData.name} was successfully registered.` });
    }

    setFormModalOpen(false);
  };

  // Delete Action
  const confirmDelete = () => {
    if (!memberToDelete) return;
    deleteMember(memberToDelete.id);
    showToast({
      type: "info",
      title: "Member Deleted",
      message: `${memberToDelete.name} was removed from the system.`,
    });
    setDeleteConfirmOpen(false);
    if (selectedMember?.id === memberToDelete.id) {
      setDrawerOpen(false);
    }
    setMemberToDelete(null);
  };

  const getStatusBadge = (status: Member["status"]) => {
    switch (status) {
      case "Active":
        return <Badge variant="success">Active</Badge>;
      case "Expired":
        return <Badge variant="danger">Expired</Badge>;
      case "Frozen":
        return <Badge variant="warning">Frozen</Badge>;
      case "Pending":
        return <Badge variant="info">Pending</Badge>;
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
                Member Directory
              </h1>
              <Badge variant="neutral">{members.length} Members</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Manage member registrations, membership plans, check-in history, and assigned personal trainers.
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add New Member
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-3 bg-surface/40 border-border/80">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search name, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                prefix={<Search className="h-3.5 w-3.5 text-text-muted" />}
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired</option>
              <option value="frozen">Frozen</option>
            </Select>

            <Select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Plans</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>

            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "joinDate" | "attendance")}
                className="flex-1"
              >
                <option value="name">Sort: Name</option>
                <option value="joinDate">Sort: Join Date</option>
                <option value="attendance">Sort: Attendance</option>
              </Select>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-text-secondary hover:border-border-strong hover:bg-surface hover:text-text-primary transition-colors"
                title={`Toggle sort order (${sortOrder})`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Members Table */}
        <Card className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Membership Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Trainer</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-text-muted">
                      No members match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMember(member);
                                setDrawerOpen(true);
                              }}
                              className="text-xs font-semibold text-text-primary hover:text-primary transition-colors text-left"
                            >
                              {member.name}
                            </button>
                            <p className="text-[11px] text-text-muted">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-medium text-text-primary">{member.planName}</span>
                      </TableCell>

                      <TableCell>{getStatusBadge(member.status)}</TableCell>

                      <TableCell>
                        <span className="text-xs text-text-secondary">
                          {member.trainerName || "—"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono tabular-nums text-text-primary">
                          {member.attendanceCount} visits
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono tabular-nums text-text-muted">
                          {member.expiryDate}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMember(member);
                              setDrawerOpen(true);
                            }}
                            className="p-1 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
                            title="View Profile Drawer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 rounded-lg text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
                            title="Edit Member"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <DropdownMenu
                            trigger={
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                toggleMemberStatus(member.id);
                                showToast({
                                  type: "info",
                                  title: "Status Changed",
                                  message: `${member.name}'s status toggled.`,
                                });
                              }}
                            >
                              {member.status === "Active" ? (
                                <>
                                  <PauseCircle className="h-4 w-4 text-warning" />
                                  Freeze Membership
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  Activate Membership
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="danger"
                              onClick={() => {
                                setMemberToDelete(member);
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Member
                            </DropdownMenuItem>
                          </DropdownMenu>
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
                {Math.min(currentPage * pageSize, filteredMembers.length)} of{" "}
                {filteredMembers.length} members
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

      {/* Member Profile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedMember?.name || "Member Profile"}
        size="md"
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* Profile Overview */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary ring-2 ring-primary/20">
                {selectedMember.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedMember.name}
                </h3>
                <p className="text-xs text-text-muted">{selectedMember.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(selectedMember.status)}
                  <span className="text-xs text-text-secondary">
                    Member since {selectedMember.joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-surface-secondary p-3">
                <p className="text-xs text-text-muted">Total Visits</p>
                <p className="mt-1 text-xl font-bold text-text-primary">
                  {selectedMember.attendanceCount}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-secondary p-3">
                <p className="text-xs text-text-muted">Lifetime Value</p>
                <p className="mt-1 text-xl font-bold text-text-primary">
                  ${selectedMember.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Membership Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Membership Information
              </h4>
              <div className="rounded-xl border border-border bg-background p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Current Plan:</span>
                  <span className="font-semibold text-text-primary">{selectedMember.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Expires On:</span>
                  <span className="font-semibold text-text-primary">{selectedMember.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Assigned Coach:</span>
                  <span className="font-medium text-text-primary">
                    {selectedMember.trainerName || "None assigned"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Emergency Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Contact & Emergency
              </h4>
              <div className="rounded-xl border border-border bg-background p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">{selectedMember.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <span className="text-xs text-text-secondary">
                    Emergency: {selectedMember.emergencyContact || "No contact specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Member Notes */}
            {selectedMember.notes && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Trainer Notes
                </h4>
                <div className="rounded-xl border border-border bg-surface p-3 text-xs text-text-secondary leading-relaxed">
                  {selectedMember.notes}
                </div>
              </div>
            )}

            {/* Drawer Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                variant="line"
                size="sm"
                block
                onClick={() => {
                  setDrawerOpen(false);
                  handleOpenEdit(selectedMember);
                }}
              >
                Edit Details
              </Button>
              <Button
                variant="solid"
                size="sm"
                block
                onClick={() => {
                  toggleMemberStatus(selectedMember.id);
                  showToast({
                    type: "info",
                    title: "Status Toggled",
                    message: "Member status was updated.",
                  });
                  setDrawerOpen(false);
                }}
              >
                {selectedMember.status === "Active" ? "Freeze Account" : "Activate Account"}
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add / Edit Member Modal */}
      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingMemberId ? "Edit Member Profile" : "Register New Gym Member"}
        size="lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required>
              <Input
                placeholder="Marcus Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Email Address" required>
              <Input
                type="email"
                placeholder="marcus@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormField>

            <FormField label="Membership Plan" required>
              <Select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price} / {p.durationMonths}mo)
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Member Status">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Member["status"] })
                }
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Frozen">Frozen</option>
                <option value="Pending">Pending</option>
              </Select>
            </FormField>

            <FormField label="Assign Personal Trainer (Optional)">
              <Select
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
              >
                <option value="">-- No trainer assigned --</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role})
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Emergency Contact (Name & Phone)">
            <Input
              placeholder="Sarah Vance (+1 555-888-2341)"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </FormField>

          <FormField label="Fitness Goals & Medical Notes">
            <Input
              placeholder="e.g. Marathon training, shoulder rehab note..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              {editingMemberId ? "Save Changes" : "Create Member"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete member{" "}
            <span className="font-semibold text-text-primary">{memberToDelete?.name}</span>?
            This will remove their history and plan assignments.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" className="bg-danger hover:bg-danger/90 border-none" onClick={confirmDelete}>
              Delete Member
            </Button>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}

