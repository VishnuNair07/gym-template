"use client";

import { useState } from "react";
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  MapPin,
  Check,
  X,
  UserCheck,
  Dumbbell,
  Flame,
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
import { useGymStore, FitnessClass } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export function ClassesView() {
  const { classes, trainers, members, addClass, bookClassMember, cancelClassBooking } = useGymStore();
  const { showToast } = useToast();

  const [activeDayTab, setActiveDayTab] = useState<typeof DAYS[number]>("Monday");

  // Create Class Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    trainerId: trainers[0]?.id || "",
    day: "Monday" as typeof DAYS[number],
    time: "07:00 AM - 08:00 AM",
    duration: "60",
    capacity: "20",
    room: "Studio A (Main Turf)",
    category: "HIIT" as FitnessClass["category"],
  });

  // Book Member Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast({ type: "danger", title: "Validation Error", message: "Class title is required." });
      return;
    }

    const trainer = trainers.find((t) => t.id === formData.trainerId) || trainers[0];
    const durationNum = parseInt(formData.duration, 10) || 60;
    const capacityNum = parseInt(formData.capacity, 10) || 20;

    addClass({
      title: formData.title,
      trainerId: trainer.id,
      trainerName: trainer.name,
      day: formData.day,
      time: formData.time,
      duration: durationNum,
      capacity: capacityNum,
      room: formData.room,
      category: formData.category,
    });

    showToast({
      type: "success",
      title: "Class Scheduled",
      message: `${formData.title} was scheduled for ${formData.day}.`,
    });

    setCreateModalOpen(false);
    setFormData({
      title: "",
      trainerId: trainers[0]?.id || "",
      day: "Monday",
      time: "07:00 AM - 08:00 AM",
      duration: "60",
      capacity: "20",
      room: "Studio A (Main Turf)",
      category: "HIIT",
    });
  };

  const handleBookMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedMemberId) {
      showToast({ type: "danger", title: "Error", message: "Please select a member to book." });
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    if (selectedClass.enrolledMemberIds.includes(member.id)) {
      showToast({
        type: "warning",
        title: "Already Enrolled",
        message: `${member.name} is already registered for this session.`,
      });
      return;
    }

    const success = bookClassMember(selectedClass.id, member.id);
    if (success) {
      showToast({
        type: "success",
        title: "Spot Confirmed",
        message: `${member.name} is booked for ${selectedClass.title}.`,
      });
      setBookModalOpen(false);
      setSelectedMemberId("");
    } else {
      showToast({
        type: "danger",
        title: "Class Full",
        message: "This class has reached maximum participant capacity.",
      });
    }
  };

  const handleCancelBooking = (classItem: FitnessClass, memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    cancelClassBooking(classItem.id, memberId);
    showToast({
      type: "info",
      title: "Booking Cancelled",
      message: `${member?.name || "Member"} was removed from the session.`,
    });
  };

  // Day filter
  const dayClasses = classes.filter((c) => c.day === activeDayTab);

  const getCategoryBadge = (category: FitnessClass["category"]) => {
    switch (category) {
      case "HIIT":
        return <Badge variant="danger">HIIT</Badge>;
      case "Strength":
        return <Badge variant="info">Strength</Badge>;
      case "Yoga":
        return <Badge variant="success">Yoga</Badge>;
      case "Spinning":
        return <Badge variant="warning">Spinning</Badge>;
      case "CrossFit":
        return <Badge variant="danger">CrossFit</Badge>;
      case "Pilates":
        return <Badge variant="info">Pilates</Badge>;
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
                Classes & Schedule
              </h1>
              <Badge variant="info">{classes.length} Sessions</Badge>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Weekly group workout calendar, certified coach assignments, and live capacity booking.
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={() => setCreateModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Schedule Class
          </Button>
        </div>

        {/* Days of Week Tab Bar */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-border/70 pb-2">
          {DAYS.map((day) => {
            const count = classes.filter((c) => c.day === day).length;
            const active = activeDayTab === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDayTab(day)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "border border-border/80 bg-background text-text-secondary hover:border-border-strong hover:bg-surface hover:text-text-primary"
                }`}
              >
                <span>{day}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-mono tabular-nums ${
                    active ? "bg-white/20 text-white" : "bg-surface text-text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Classes Grid for Active Day */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">
              Scheduled for {activeDayTab} ({dayClasses.length} sessions)
            </h2>
          </div>

          {dayClasses.length === 0 ? (
            <Card className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary text-text-muted">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">No classes on {activeDayTab}</h3>
                <p className="text-xs text-text-muted max-w-sm">
                  Add a group fitness class like HIIT, Pilates, or Power Yoga to populate this day&apos;s schedule.
                </p>
                <Button variant="line" size="sm" onClick={() => setCreateModalOpen(true)}>
                  Schedule Session
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dayClasses.map((item) => {
                const percentBooked = Math.round((item.bookedCount / item.capacity) * 100);
                const isFull = item.bookedCount >= item.capacity;

                return (
                  <Card key={item.id} className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {item.category}
                          </span>
                          <h3 className="text-base font-bold text-text-primary mt-0.5">
                            {item.title}
                          </h3>
                        </div>
                        {getCategoryBadge(item.category)}
                      </div>

                      {/* Coach & Room */}
                      <div className="mt-4 space-y-2 text-xs text-text-secondary border-t border-border pt-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-text-muted" />
                          <span>
                            Coach: <strong className="text-text-primary">{item.trainerName}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-text-muted" />
                          <span>{item.time} ({item.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-text-muted" />
                          <span>{item.room}</span>
                        </div>
                      </div>

                      {/* Capacity progress */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-text-muted">Capacity</span>
                          <span className={isFull ? "text-danger font-bold" : "text-text-primary font-semibold"}>
                            {item.bookedCount} / {item.capacity} booked ({percentBooked}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
                          <div
                            style={{ width: `${percentBooked}%` }}
                            className={`h-full rounded-full transition-all ${
                              isFull ? "bg-danger" : percentBooked > 75 ? "bg-warning" : "bg-primary"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Enrolled members chips */}
                      {item.enrolledMemberIds.length > 0 && (
                        <div className="mt-4 space-y-1.5">
                          <p className="text-[11px] font-semibold text-text-muted uppercase">
                            Enrolled ({item.enrolledMemberIds.length}):
                          </p>
                          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                            {item.enrolledMemberIds.map((mId) => {
                              const m = members.find((x) => x.id === mId);
                              return (
                                <span
                                  key={mId}
                                  className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-text-secondary"
                                >
                                  {m?.name || "Member"}
                                  <button
                                    type="button"
                                    onClick={() => handleCancelBooking(item, mId)}
                                    className="text-text-muted hover:text-danger p-0.5"
                                    title="Cancel booking"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Book button */}
                    <div className="mt-5 pt-3 border-t border-border flex items-center gap-2">
                      <Button
                        variant={isFull ? "line" : "solid"}
                        size="sm"
                        block
                        disabled={isFull}
                        onClick={() => {
                          setSelectedClass(item);
                          setBookModalOpen(true);
                        }}
                      >
                        {isFull ? "Class Full" : "Book Member Spot"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Class Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule Fitness Class"
        size="lg"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Class Name" required>
              <Input
                placeholder="e.g. Morning HIIT Ignition"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Class Discipline">
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as FitnessClass["category"],
                  })
                }
              >
                <option value="HIIT">HIIT & Metabolic</option>
                <option value="Strength">Strength & Power</option>
                <option value="Yoga">Power Yoga & Core</option>
                <option value="Spinning">Spinning & Cycling</option>
                <option value="CrossFit">CrossFit WOD</option>
                <option value="Pilates">Reformer Pilates</option>
              </Select>
            </FormField>

            <FormField label="Assigned Instructor" required>
              <Select
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Day of Week">
              <Select
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value as typeof DAYS[number] })
                }
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Time Window" required>
              <Input
                placeholder="07:00 AM - 07:45 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Location / Room">
              <Input
                placeholder="Studio A (Main Turf)"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </FormField>

            <FormField label="Duration (Minutes)">
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </FormField>

            <FormField label="Max Capacity (Slots)">
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save Class to Schedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Book Member Slot Modal */}
      <Modal
        open={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title={`Enroll Member: ${selectedClass?.title || ""}`}
        size="md"
      >
        <form onSubmit={handleBookMember} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Select an active member to reserve one of the{" "}
            <strong className="text-text-primary">
              {selectedClass ? selectedClass.capacity - selectedClass.bookedCount : 0} open spots
            </strong>{" "}
            in {selectedClass?.title}.
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
            <Button variant="ghost" type="button" onClick={() => setBookModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Confirm Reservation
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}

