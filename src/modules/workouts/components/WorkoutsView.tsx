"use client";

import { useState } from "react";
import {
  Dumbbell,
  Plus,
  Flame,
  CheckCircle,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
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
import { useGymStore, WorkoutPlan } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function WorkoutsView() {
  const { workouts, members, addWorkoutPlan } = useGymStore();
  const { showToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<WorkoutPlan | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    level: "Intermediate" as WorkoutPlan["level"],
    goal: "Muscle Building" as WorkoutPlan["goal"],
    daysPerWeek: "4",
    exercisesStr:
      "Barbell Bench Press | 4 sets | 8-10 reps | 90s rest\nBarbell Back Squat | 4 sets | 6-8 reps | 120s rest\nCable Lat Pulldown | 3 sets | 12 reps | 60s rest\nDumbbell Shoulder Press | 3 sets | 10 reps | 60s rest",
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast({ type: "danger", title: "Validation Error", message: "Plan title is required." });
      return;
    }

    const exercises = formData.exercisesStr
      .split("\n")
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          name: parts[0] || "Exercise",
          sets: parts[1] || "3 sets",
          reps: parts[2] || "10 reps",
          rest: parts[3] || "60s rest",
        };
      })
      .filter((ex) => Boolean(ex.name));

    addWorkoutPlan({
      title: formData.title,
      level: formData.level,
      goal: formData.goal,
      daysPerWeek: parseInt(formData.daysPerWeek, 10) || 4,
      exercises,
    });

    showToast({
      type: "success",
      title: "Workout Routine Added",
      message: `${formData.title} template is now active in library.`,
    });

    setCreateModalOpen(false);
    setFormData({
      title: "",
      level: "Intermediate",
      goal: "Muscle Building",
      daysPerWeek: "4",
      exercisesStr: "",
    });
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === selectedMemberId);
    if (!member || !selectedPlanForAssign) return;

    showToast({
      type: "success",
      title: "Workout Assigned",
      message: `${selectedPlanForAssign.title} was pushed to ${member.name}'s training profile.`,
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
                Workout Routines & Exercise Programs
              </h1>
              <Badge variant="info">{workouts.length} Programs</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Pre-built training splits, sets, repetitions, recovery intervals, and member assignments.
            </p>
          </div>

          <Button variant="solid" onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workout Plan
          </Button>
        </div>

        {/* Workout Plans Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {workouts.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={plan.level === "Advanced" ? "danger" : plan.level === "Intermediate" ? "warning" : "success"}>
                    {plan.level}
                  </Badge>
                  <span className="text-xs font-semibold text-text-muted">
                    {plan.daysPerWeek} Days / Week
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary mt-2">{plan.title}</h3>
                <p className="text-xs font-medium text-primary mt-0.5">Focus: {plan.goal}</p>

                {/* Exercises list preview */}
                <div className="mt-4 space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Routine Breakdown ({plan.exercises.length} Exercises):
                  </p>
                  <div className="space-y-1.5">
                    {plan.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs"
                      >
                        <span className="font-medium text-text-primary">{ex.name}</span>
                        <span className="text-text-muted">
                          {ex.sets} × {ex.reps} ({ex.rest})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {plan.assignedMembers} Members on plan
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

      {/* Create Workout Plan Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Workout Template"
        size="lg"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Routine Title" required className="sm:col-span-2">
              <Input
                placeholder="e.g. 5-Day Push/Pull/Legs Hypertrophy"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Days Per Week">
              <Select
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
              >
                <option value="3">3 Days (Full Body)</option>
                <option value="4">4 Days (Upper / Lower)</option>
                <option value="5">5 Days (PPL Split)</option>
                <option value="6">6 Days (Advanced Split)</option>
              </Select>
            </FormField>

            <FormField label="Fitness Level">
              <Select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as WorkoutPlan["level"] })
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </Select>
            </FormField>

            <FormField label="Primary Target Goal" className="sm:col-span-2">
              <Select
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value as WorkoutPlan["goal"] })
                }
              >
                <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                <option value="Fat Loss">Metabolic Shred & Fat Loss</option>
                <option value="Endurance">Cardiovascular Endurance</option>
                <option value="Athletic Conditioning">Athletic Power & Conditioning</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="Exercises Routine Format"
            helper="Enter one exercise per line formatted as: Name | Sets | Reps | Rest"
          >
            <Textarea
              rows={5}
              value={formData.exercisesStr}
              onChange={(e) => setFormData({ ...formData, exercisesStr: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save Program
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Workout Modal */}
      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign ${selectedPlanForAssign?.title || ""} to Member`}
        size="md"
      >
        <form onSubmit={handleAssign} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Select a member to assign the {selectedPlanForAssign?.title} training regimen.
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
              Assign Routine
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}


