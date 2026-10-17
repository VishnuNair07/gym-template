"use client";

import { useState } from "react";
import {
  Award,
  Plus,
  Star,
  Users,
  Clock,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle,
  PauseCircle,
  Calendar,
  Sparkles,
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
import { Textarea } from "@/components/ui/Textarea";
import { useGymStore, Trainer } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function TrainersView() {
  const { trainers, members, addTrainer, updateTrainer, deleteTrainer, updateMember } = useGymStore();
  const { showToast } = useToast();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "Strength & Conditioning Coach",
    specialty: "",
    email: "",
    phone: "",
    rating: "4.9",
    activeClients: "12",
    availability: "Morning" as Trainer["availability"],
    status: "Active" as Trainer["status"],
    bio: "",
  });

  // Assign Member to Trainer Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTrainerForAssign, setSelectedTrainerForAssign] = useState<Trainer | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);

  // Profile Drawer
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingTrainerId(null);
    setFormData({
      name: "",
      role: "Strength & Conditioning Coach",
      specialty: "Hypertrophy, Powerlifting & Mobility",
      email: "",
      phone: "+1 (555) 000-0000",
      rating: "5.0",
      activeClients: "0",
      availability: "All Day",
      status: "Active",
      bio: "",
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (t: Trainer) => {
    setEditingTrainerId(t.id);
    setFormData({
      name: t.name,
      role: t.role,
      specialty: t.specialty,
      email: t.email,
      phone: t.phone,
      rating: t.rating.toString(),
      activeClients: t.activeClients.toString(),
      availability: t.availability,
      status: t.status,
      bio: t.bio || "",
    });
    setFormModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast({ type: "danger", title: "Validation Error", message: "Name and Email are required." });
      return;
    }

    const ratingNum = parseFloat(formData.rating) || 5.0;
    const clientsNum = parseInt(formData.activeClients, 10) || 0;

    if (editingTrainerId) {
      updateTrainer(editingTrainerId, {
        name: formData.name,
        role: formData.role,
        specialty: formData.specialty,
        email: formData.email,
        phone: formData.phone,
        rating: ratingNum,
        activeClients: clientsNum,
        availability: formData.availability,
        status: formData.status,
        bio: formData.bio,
      });
      showToast({ type: "success", title: "Trainer Updated", message: `${formData.name}'s profile was updated.` });
    } else {
      addTrainer({
        name: formData.name,
        role: formData.role,
        specialty: formData.specialty,
        email: formData.email,
        phone: formData.phone,
        rating: ratingNum,
        activeClients: clientsNum,
        availability: formData.availability,
        status: formData.status,
        bio: formData.bio,
      });
      showToast({ type: "success", title: "Trainer Added", message: `${formData.name} was added to staff.` });
    }

    setFormModalOpen(false);
  };

  const confirmDelete = () => {
    if (!trainerToDelete) return;
    deleteTrainer(trainerToDelete.id);
    showToast({
      type: "info",
      title: "Trainer Removed",
      message: `${trainerToDelete.name} was removed from staff.`,
    });
    setDeleteConfirmOpen(false);
    setTrainerToDelete(null);
  };

  const handleAssignMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainerForAssign || !selectedMemberId) {
      showToast({ type: "danger", title: "Error", message: "Please select a member to assign." });
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    updateMember(member.id, {
      trainerId: selectedTrainerForAssign.id,
      trainerName: selectedTrainerForAssign.name,
    });

    updateTrainer(selectedTrainerForAssign.id, {
      activeClients: selectedTrainerForAssign.activeClients + 1,
    });

    showToast({
      type: "success",
      title: "Client Assigned",
      message: `${member.name} is now training with ${selectedTrainerForAssign.name}.`,
    });

    setAssignModalOpen(false);
    setSelectedMemberId("");
    setSelectedTrainerForAssign(null);
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Trainers & Fitness Staff
              </h1>
              <Badge variant="info">{trainers.length} Coaches</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Certified coaches, schedule shifts, private client assignments, and specialties.
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Staff Member
          </Button>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="flex flex-col justify-between rounded-xl border border-border/80 bg-surface/40 p-4.5 shadow-2xs transition-all hover:border-border-strong hover:bg-surface/70"
            >
              <div>
                {/* Header card with avatar & status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
                    {trainer.name.charAt(0)}
                  </div>
                  <Badge variant={trainer.status === "Active" ? "success" : "warning"}>
                    {trainer.status}
                  </Badge>
                </div>

                <div className="mt-2.5">
                  <h3 className="text-sm font-bold text-text-primary">{trainer.name}</h3>
                  <p className="text-xs font-medium text-primary">{trainer.role}</p>
                  <p className="mt-1.5 text-xs text-text-muted min-h-[32px] line-clamp-2">
                    {trainer.specialty}
                  </p>
                </div>

                {/* Rating & Clients */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 border-y border-border/70 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    <span className="font-semibold font-mono tabular-nums text-text-primary">{trainer.rating}</span>
                    <span className="text-text-muted">/ 5.0</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <Users className="h-3.5 w-3.5 text-text-muted" />
                    <span className="font-semibold font-mono tabular-nums text-text-primary">{trainer.activeClients}</span>
                    <span className="text-text-muted">clients</span>
                  </div>
                </div>

                {/* Shift & Contact */}
                <div className="mt-3 space-y-1 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-text-muted" />
                    <span className="text-[11px]">Availability: {trainer.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-text-muted" />
                    <span className="truncate text-[11px] text-text-muted">{trainer.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                <Button
                  variant="subtle"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedTrainerForAssign(trainer);
                    setAssignModalOpen(true);
                  }}
                >
                  Assign Client
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setDrawerOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
                    title="View Profile"
                  >
                    <Users className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(trainer)}
                    className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
                    title="Edit Trainer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrainerToDelete(trainer);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-danger/10 text-text-muted hover:text-danger transition-colors"
                    title="Remove Trainer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Clients Quick Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Coach Client Roster</CardTitle>
            <CardDescription>
              Members currently receiving 1-on-1 personal training guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {trainers.map((t) => {
                const assigned = members.filter((m) => m.trainerId === t.id);
                return (
                  <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-text-primary">{t.name}</p>
                        <p className="text-xs text-text-muted">{t.specialty}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {assigned.length === 0 ? (
                        <span className="text-xs text-text-muted">No members assigned currently.</span>
                      ) : (
                        assigned.map((m) => (
                          <span
                            key={m.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary"
                          >
                            <Users className="h-3 w-3 text-primary" />
                            {m.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Trainer Modal */}
      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingTrainerId ? "Edit Coach Profile" : "Register New Fitness Trainer"}
        size="lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required>
              <Input
                placeholder="Dave Miller"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Role / Title" required>
              <Input
                placeholder="Head Strength Coach"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Email Address" required>
              <Input
                type="email"
                placeholder="dave@gympulse.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                placeholder="+1 (555) 911-2001"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormField>

            <FormField label="Availability Window">
              <Select
                value={formData.availability}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: e.target.value as Trainer["availability"],
                  })
                }
              >
                <option value="Morning">Morning Shift (5 AM - 1 PM)</option>
                <option value="Evening">Evening Shift (1 PM - 9 PM)</option>
                <option value="All Day">All Day / Flexible</option>
              </Select>
            </FormField>

            <FormField label="Employment Status">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Trainer["status"],
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Specialties & Certifications" required>
            <Input
              placeholder="e.g. CSCS, Olympic Lifting, Kettlebell Level 2"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Biography & Experience">
            <Textarea
              rows={3}
              placeholder="10+ years experience training collegiate athletes and competitive powerlifters."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              {editingTrainerId ? "Save Coach Changes" : "Register Trainer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Client Modal */}
      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Client to Coach ${selectedTrainerForAssign?.name || ""}`}
        size="md"
      >
        <form onSubmit={handleAssignMember} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Select a member to pair with coach{" "}
            <strong className="text-text-primary">{selectedTrainerForAssign?.name}</strong>.
          </p>

          <FormField label="Select Member" required>
            <Select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">-- Choose member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.planName}) {m.trainerName ? `• Currently with ${m.trainerName}` : ""}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Assign Coach
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Removal"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to remove coach{" "}
            <span className="font-semibold text-text-primary">{trainerToDelete?.name}</span>?
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" className="bg-danger hover:bg-danger/90 border-none" onClick={confirmDelete}>
              Remove Staff
            </Button>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}


