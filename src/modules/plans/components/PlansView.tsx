"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  Check,
  Edit2,
  Trash2,
  Users,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { useGymStore, MembershipPlan } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function PlansView() {
  const { plans, members, addPlan, updatePlan, deletePlan, updateMember, addPayment } = useGymStore();
  const { showToast } = useToast();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationMonths: "1",
    description: "",
    featuresStr: "",
    popular: false,
    active: true,
  });

  // Assign Plan Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<MembershipPlan | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Delete Plan Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);

  const handleOpenAdd = () => {
    setEditingPlanId(null);
    setFormData({
      name: "",
      price: "49",
      durationMonths: "1",
      description: "",
      featuresStr: "Gym floor access\nLocker room access\n1 Fitness assessment",
      popular: false,
      active: true,
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlanId(plan.id);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      durationMonths: plan.durationMonths.toString(),
      description: plan.description,
      featuresStr: plan.features.join("\n"),
      popular: !!plan.popular,
      active: plan.active,
    });
    setFormModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast({ type: "danger", title: "Validation Error", message: "Name and Price are required." });
      return;
    }

    const features = formData.featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const priceNum = parseFloat(formData.price) || 0;
    const durationNum = parseInt(formData.durationMonths, 10) || 1;

    if (editingPlanId) {
      updatePlan(editingPlanId, {
        name: formData.name,
        price: priceNum,
        durationMonths: durationNum,
        description: formData.description,
        features,
        popular: formData.popular,
        active: formData.active,
      });
      showToast({ type: "success", title: "Plan Updated", message: `${formData.name} was updated.` });
    } else {
      addPlan({
        name: formData.name,
        price: priceNum,
        durationMonths: durationNum,
        description: formData.description,
        features,
        popular: formData.popular,
        active: formData.active,
      });
      showToast({ type: "success", title: "Plan Created", message: `${formData.name} is now available.` });
    }

    setFormModalOpen(false);
  };

  const confirmDelete = () => {
    if (!planToDelete) return;
    deletePlan(planToDelete.id);
    showToast({
      type: "info",
      title: "Plan Deleted",
      message: `${planToDelete.name} has been removed.`,
    });
    setDeleteConfirmOpen(false);
    setPlanToDelete(null);
  };

  const handleAssignPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForAssign || !selectedMemberId) {
      showToast({ type: "danger", title: "Error", message: "Select a member to assign this plan." });
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + (selectedPlanForAssign.durationMonths || 1));

    updateMember(member.id, {
      planId: selectedPlanForAssign.id,
      planName: selectedPlanForAssign.name,
      status: "Active",
      expiryDate: expiry.toISOString().split("T")[0],
    });

    addPayment({
      memberId: member.id,
      memberName: member.name,
      planName: selectedPlanForAssign.name,
      amount: selectedPlanForAssign.price,
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
      paymentMethod: "Credit Card",
    });

    showToast({
      type: "success",
      title: "Plan Assigned",
      message: `${selectedPlanForAssign.name} assigned to ${member.name}.`,
    });

    setAssignModalOpen(false);
    setSelectedMemberId("");
    setSelectedPlanForAssign(null);
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Membership Plans & Pricing
              </h1>
              <Badge variant="info">{plans.length} Tiers</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Configure billing terms, durations, prices, feature bundles, and member tier assignments.
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create Plan
          </Button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-xl border bg-surface/40 p-5 shadow-2xs transition-all hover:border-border-strong ${
                plan.popular ? "border-primary/60 ring-1 ring-primary/30" : "border-border/80"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                  Featured Tier
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-text-primary">{plan.name}</h3>
                  <Badge variant={plan.active ? "success" : "neutral"}>
                    {plan.active ? "Active" : "Archived"}
                  </Badge>
                </div>

                <p className="mt-1.5 text-xs text-text-muted min-h-[32px] line-clamp-2">
                  {plan.description}
                </p>

                <div className="mt-3.5 flex items-baseline gap-1 border-b border-border/70 pb-3.5">
                  <span className="text-2xl font-extrabold font-mono tracking-tight text-text-primary tabular-nums">
                    ${plan.price}
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    / {plan.durationMonths === 1 ? "month" : `${plan.durationMonths} months`}
                  </span>
                </div>

                {/* Features checklist */}
                <div className="mt-3.5 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Included Features:
                  </p>
                  <ul className="space-y-1.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        <Check className="h-3.5 w-3.5 shrink-0 text-success mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer & Actions */}
              <div className="mt-5 pt-3.5 border-t border-border/70 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-primary" />
                    <strong className="text-text-primary font-mono tabular-nums">{plan.memberCount}</strong> active members
                  </span>
                  <span className="font-mono tabular-nums">{plan.durationMonths} mo duration</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      setSelectedPlanForAssign(plan);
                      setAssignModalOpen(true);
                    }}
                  >
                    Assign Member
                  </Button>
                  <div className="flex gap-1 justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
                      title="Edit Plan"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPlanToDelete(plan);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 rounded-lg border border-border bg-background hover:bg-danger-subtle text-text-muted hover:text-danger transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features Breakdown</CardTitle>
            <CardDescription>
              Detailed overview of capabilities across membership tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-xs font-semibold text-text-muted uppercase">
                    <th className="p-3">Facility Capability</th>
                    {plans.map((p) => (
                      <th key={p.id} className="p-3 text-center">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {[
                    "Gym Floor & Cardio Equipment",
                    "Locker Room & High-Pressure Showers",
                    "Unlimited Group HIIT & Spinning",
                    "Steam Room & Sauna Access",
                    "Dedicated Personal Trainer Sessions",
                    "Complimentary Guest Passes",
                    "Custom Meal & Nutrition Strategy",
                  ].map((feature, idx) => (
                    <tr key={idx} className="hover:bg-surface/50">
                      <td className="p-3 font-medium text-text-primary">{feature}</td>
                      {plans.map((plan) => {
                        const hasFeature =
                          idx < 2 ||
                          (idx < 4 && plan.price >= 100) ||
                          (idx >= 4 && plan.durationMonths >= 12);
                        return (
                          <td key={plan.id} className="p-3 text-center">
                            {hasFeature ? (
                              <Check className="h-4 w-4 text-success mx-auto" />
                            ) : (
                              <span className="text-text-muted">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Plan Modal */}
      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingPlanId ? "Edit Membership Plan" : "Create New Membership Plan"}
        size="md"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <FormField label="Plan Name" required>
            <Input
              placeholder="e.g. Pro Performance (Quarterly)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price ($)" required>
              <Input
                type="number"
                placeholder="49"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Duration (Months)" required>
              <Select
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months (Quarterly)</option>
                <option value="6">6 Months (Biannual)</option>
                <option value="12">12 Months (Annual)</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Short Description">
            <Input
              placeholder="e.g. Full club access including steam room & classes."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <FormField
            label="Included Features (one per line)"
            helper="Enter each feature or perk on a new line."
          >
            <Textarea
              rows={4}
              placeholder="Gym floor access&#10;Locker room access&#10;Unlimited classes"
              value={formData.featuresStr}
              onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
            />
          </FormField>

          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Featured / Most Popular Badge</p>
              <p className="text-xs text-text-muted">Highlight this plan on dashboard & pricing</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, popular: !formData.popular })}
              className="text-primary"
            >
              {formData.popular ? (
                <ToggleRight className="h-6 w-6 text-primary" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-text-muted" />
              )}
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              {editingPlanId ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Plan to Member Modal */}
      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign ${selectedPlanForAssign?.name || "Plan"} to Member`}
        size="md"
      >
        <form onSubmit={handleAssignPlan} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Select a member to upgrade or renew with the{" "}
            <strong className="text-text-primary">{selectedPlanForAssign?.name}</strong> ($
            {selectedPlanForAssign?.price}).
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
                  {m.name} (Currently on {m.planName})
                </option>
              ))}
            </Select>
          </FormField>

          <div className="rounded-xl border border-border bg-surface p-3 text-xs text-text-muted">
            This will update the member&apos;s expiration date to +{selectedPlanForAssign?.durationMonths}{" "}
            month(s) and automatically record a simulated receipt for ${selectedPlanForAssign?.price}.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Assign & Record Payment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Plan Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-text-primary">{planToDelete?.name}</span>? Existing
            members will keep their active plan until their next renewal.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" className="bg-danger hover:bg-danger/90 border-none" onClick={confirmDelete}>
              Delete Plan
            </Button>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}

