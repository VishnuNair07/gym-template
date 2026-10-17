"use client";

import { useState } from "react";
import {
  Utensils,
  Plus,
  Flame,
  CheckCircle,
  Users,
  PieChart,
  Apple,

  Sparkles,
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
import { useGymStore, DietPlan } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function DietsView() {
  const { diets, members, addDietPlan } = useGymStore();
  const { showToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<DietPlan | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    goal: "Muscle Gain" as DietPlan["goal"],
    calories: "2400",
    protein: "190",
    carbs: "240",
    fats: "65",
    mealsStr:
      "Breakfast | 4 eggs, oats with berries | 580 kcal\nLunch | Grilled chicken breast, jasmine rice, greens | 650 kcal\nPost-Workout | Whey isolate shake & banana | 400 kcal\nDinner | Salmon fillet, sweet potato, asparagus | 750 kcal",
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast({ type: "danger", title: "Validation Error", message: "Plan title is required." });
      return;
    }

    const meals = formData.mealsStr
      .split("\n")
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          title: parts[0] || "Meal",
          items: parts[1] || "Healthy ingredients",
          calories: parseInt(parts[2]?.replace(/[^0-9]/g, "") || "400", 10),
        };
      })
      .filter((m) => Boolean(m.title));

    addDietPlan({
      title: formData.title,
      goal: formData.goal,
      calories: parseInt(formData.calories, 10) || 2000,
      protein: parseInt(formData.protein, 10) || 150,
      carbs: parseInt(formData.carbs, 10) || 200,
      fats: parseInt(formData.fats, 10) || 60,
      meals,
    });

    showToast({
      type: "success",
      title: "Diet Template Created",
      message: `${formData.title} nutrition protocol is saved.`,
    });

    setCreateModalOpen(false);
    setFormData({
      title: "",
      goal: "Muscle Gain",
      calories: "2400",
      protein: "190",
      carbs: "240",
      fats: "65",
      mealsStr: "",
    });
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === selectedMemberId);
    if (!member || !selectedPlanForAssign) return;

    showToast({
      type: "success",
      title: "Nutrition Plan Assigned",
      message: `${selectedPlanForAssign.title} was linked to ${member.name}.`,
    });

    setAssignModalOpen(false);
    setSelectedMemberId("");
    setSelectedPlanForAssign(null);
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                Nutrition & Diet Protocols
              </h1>
              <Badge variant="info">{diets.length} Templates</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Macronutrient distributions, calorie targets, meal recipes, and personalized nutrition tracking.
            </p>
          </div>

          <Button variant="solid" onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Diet Plan
          </Button>
        </div>

        {/* Diets Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {diets.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={plan.goal === "Weight Loss" ? "warning" : "success"}>
                    {plan.goal}
                  </Badge>
                  <span className="text-xs font-bold text-primary">
                    {plan.calories.toLocaleString()} kcal / day
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary mt-2">{plan.title}</h3>

                {/* Macro breakdown bar */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-center">
                  <div className="rounded-xl border border-border bg-surface p-2">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Protein</span>
                    <p className="text-sm font-bold text-text-primary mt-0.5">{plan.protein}g</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-2">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Carbs</span>
                    <p className="text-sm font-bold text-text-primary mt-0.5">{plan.carbs}g</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-2">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Fats</span>
                    <p className="text-sm font-bold text-text-primary mt-0.5">{plan.fats}g</p>
                  </div>
                </div>

                {/* Meals */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Sample Meal Schedule ({plan.meals.length} Meals):
                  </p>
                  <div className="space-y-1.5">
                    {plan.meals.map((meal, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-surface p-2.5 text-xs space-y-0.5"
                      >
                        <div className="flex justify-between font-semibold text-text-primary">
                          <span>{meal.title}</span>
                          <span className="text-primary">{meal.calories} kcal</span>
                        </div>
                        <p className="text-text-secondary">{meal.items}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {plan.assignedMembers} Members on diet
                </span>

                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setSelectedPlanForAssign(plan);
                    setAssignModalOpen(true);
                  }}
                >
                  Assign to Member
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Diet Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Nutrition Protocol"
        size="lg"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Plan Name" required>
              <Input
                placeholder="e.g. Lean High-Protein Muscle Protocol"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Dietary Target Goal">
              <Select
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value as DietPlan["goal"] })
                }
              >
                <option value="Muscle Gain">Muscle Gain & Lean Bulk</option>
                <option value="Weight Loss">Caloric Deficit Weight Loss</option>
                <option value="Keto Lean">Keto & Low Carb</option>
                <option value="High Protein Balanced">High Protein Balanced</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <FormField label="Calories" required>
              <Input
                type="number"
                placeholder="2400"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Protein (g)">
              <Input
                type="number"
                placeholder="190"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              />
            </FormField>
            <FormField label="Carbs (g)">
              <Input
                type="number"
                placeholder="240"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              />
            </FormField>
            <FormField label="Fats (g)">
              <Input
                type="number"
                placeholder="65"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
              />
            </FormField>
          </div>

          <FormField
            label="Meal Schedule Format"
            helper="One meal per line formatted as: Meal Title | Ingredients / Items | Calories"
          >
            <Textarea
              rows={4}
              value={formData.mealsStr}
              onChange={(e) => setFormData({ ...formData, mealsStr: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save Nutrition Protocol
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Diet Modal */}
      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign ${selectedPlanForAssign?.title || ""} to Member`}
        size="md"
      >
        <form onSubmit={handleAssign} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Assign {selectedPlanForAssign?.title} ({selectedPlanForAssign?.calories} kcal) to a gym member.
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
                  {m.name} ({m.planName})
                </option>
              ))}
            </Select>
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Link Diet Plan
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}

