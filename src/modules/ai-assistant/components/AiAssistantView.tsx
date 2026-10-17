"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingDown,
  Dumbbell,
  Clock,
  Utensils,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useGymStore } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  actionableSuggestion?: {
    type: "workout" | "churn" | "staffing" | "diet";
    label: string;
  };
}

export function AiAssistantView() {
  const { members, plans, trainers, attendance, addWorkoutPlan, addDietPlan } = useGymStore();
  const { showToast } = useToast();

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello Alex! I am your Apex Gym AI Intelligence Assistant. I monitor real-time member check-ins, subscription churn risk, and can automatically generate workout or nutrition regimens for your members. How can I assist you today?",
      time: "Just now",
    },
  ]);

  const promptSuggestions = [
    {
      label: "Analyze Churn Risk for Expiring Members",
      query: "Analyze member retention and identify who is at highest risk of dropping their gym membership this month.",
      icon: TrendingDown,
    },
    {
      label: "Generate 5-Day PPL Hypertrophy Routine",
      query: "Create a 5-day push/pull/legs split focused on progressive overload and hypertrophy.",
      icon: Dumbbell,
    },
    {
      label: "Optimize Peak Floor Staffing for Evening Rush",
      query: "Check our attendance occupancy data and recommend how many trainers should be scheduled for the 6 PM peak.",
      icon: Clock,
    },
    {
      label: "Formulate High-Protein Cutting Nutrition Protocol",
      query: "Formulate a 2,000 calorie high-protein meal strategy for fat loss with 180g protein.",
      icon: Utensils,
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${messages.length + 1}`,
      sender: "user",
      text: query,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    // Simulate AI synthesis based on query keywords
    setTimeout(() => {
      let aiResponseText = "";
      let actionable: Message["actionableSuggestion"] = undefined;

      const lower = query.toLowerCase();
      if (lower.includes("churn") || lower.includes("expir") || lower.includes("retention")) {
        const expiring = members.filter((m) => m.status === "Expired" || m.status === "Pending");
        aiResponseText = `Analysis Complete: Detected ${expiring.length} members with expired or pending passes. Key insight: Members who attend < 2 times per week have an 82% churn probability. Recommend sending automated SMS renewal perks (e.g., 1 complimentary trainer session upon renewal).`;
        actionable = { type: "churn", label: "Queue Automated Renewal Reminders" };
      } else if (lower.includes("workout") || lower.includes("hypertrophy") || lower.includes("ppl")) {
        aiResponseText = `Generated Program: "5-Day Advanced PPL Protocol" (4 sets × 8-12 reps per movement). Day 1: Barbell Bench, Incline DB Press, Dips. Day 2: Deadlifts, Barbell Rows, Lat Pulldowns. Day 3: Back Squats, Leg Press, Romanian Deadlifts. Day 4: Rest / Active Recovery. Day 5: Upper Hypertrophy Pump.`;
        actionable = { type: "workout", label: "Save to Gym Workout Library" };
      } else if (lower.includes("staff") || lower.includes("peak") || lower.includes("occupancy")) {
        aiResponseText = `Staffing Optimization: Facility occupancy averages 92% between 5:30 PM - 8:00 PM on weekdays. Current scheduled trainers: Elena Rostova & Marcus Sterling. We recommend assigning Coach Dave Miller to the free weights turf to decrease equipment wait times and improve member satisfaction scores.`;
        actionable = { type: "staffing", label: "Adjust Evening Trainer Roster" };
      } else if (lower.includes("diet") || lower.includes("nutrition") || lower.includes("cut")) {
        aiResponseText = `Nutrition Protocol: "Metabolic Lean Shred (2,000 kcal)". Macro Distribution: 185g Protein (37%), 175g Carbs (35%), 60g Fats (28%). Recommended structure: 4 whole egg whites + oatmeal for breakfast, grilled chicken & brown rice for lunch, whey isolate post-workout, and wild salmon with greens for dinner.`;
        actionable = { type: "diet", label: "Add to Diet Protocols Library" };
      } else {
        aiResponseText = `I analyzed our current gym operations (${members.length} members, ${trainers.length} coaches, ${plans.length} subscription plans). All facility metrics are running within nominal parameters. Let me know if you would like me to draft member communications, generate customized exercise splits, or audit financial records.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${prev.length + 1}`,
          sender: "ai",
          text: aiResponseText,
          time: "Just now",
          actionableSuggestion: actionable,
        },
      ]);
      setLoading(false);
    }, 900);
  };

  const handleExecuteAction = (action: NonNullable<Message["actionableSuggestion"]>) => {
    if (action.type === "workout") {
      addWorkoutPlan({
        title: "AI 5-Day PPL Hypertrophy Split",
        level: "Advanced",
        goal: "Muscle Building",
        daysPerWeek: 5,
        exercises: [
          { name: "Flat Barbell Bench Press", sets: "4", reps: "8-10", rest: "90s" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", rest: "60s" },
          { name: "Barbell Deadlift", sets: "4", reps: "6", rest: "120s" },
          { name: "Back Squats", sets: "4", reps: "8-10", rest: "120s" },
        ],
      });
      showToast({
        type: "success",
        title: "AI Routine Saved",
        message: "5-Day PPL Protocol was added to the Gym Workout Plans library.",
      });
    } else if (action.type === "diet") {
      addDietPlan({
        title: "AI Metabolic Lean Shred (2,000 kcal)",
        goal: "Weight Loss",
        calories: 2000,
        protein: 185,
        carbs: 175,
        fats: 60,
        meals: [
          { title: "Breakfast", items: "Egg whites, oats, blueberries", calories: 450 },
          { title: "Lunch", items: "Grilled chicken, brown rice, broccoli", calories: 550 },
          { title: "Snack", items: "Whey isolate shake & almond milk", calories: 280 },
          { title: "Dinner", items: "Wild salmon fillet with asparagus", calories: 720 },
        ],
      });
      showToast({
        type: "success",
        title: "AI Diet Saved",
        message: "Metabolic Lean Shred protocol added to Diet Plans.",
      });
    } else {
      showToast({
        type: "info",
        title: "Action Processed",
        message: `${action.label} has been triggered.`,
      });
    }
  };

  return (
    <Shell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              AI Gym Operations Assistant
            </h1>
            <Badge variant="primary" className="bg-primary-subtle text-primary border-primary/20">
              Interactive Demo
            </Badge>
          </div>
          <p className="text-sm text-text-muted">
            Intelligent assistant fine-tuned for fitness club management, member churn mitigation, exercise programming, and staffing optimization.
          </p>
        </div>

        {/* Suggestion Prompts */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {promptSuggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.query)}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary hover:bg-surface hover:shadow-xs group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-text-muted group-hover:text-primary group-hover:bg-primary-subtle transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                  <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{item.query}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Conversation Card */}
        <Card className="min-h-[440px] flex flex-col justify-between p-0 overflow-hidden border-border">
          {/* Messages feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[500px]">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAi ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isAi
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-surface-secondary text-text-primary border border-border"
                    }`}
                  >
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-2 ${
                      isAi
                        ? "bg-surface border border-border text-text-primary shadow-xs"
                        : "bg-primary text-primary-foreground font-medium"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Actionable button if AI suggested saving or running an action */}
                    {msg.actionableSuggestion && (
                      <div className="pt-2 border-t border-border/50">
                        <Button
                          variant="solid"
                          size="sm"
                          onClick={() => handleExecuteAction(msg.actionableSuggestion!)}
                          className="gap-1.5 text-xs h-7"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          {msg.actionableSuggestion.label}
                        </Button>
                      </div>
                    )}

                    <div
                      className={`text-[10px] ${
                        isAi ? "text-text-muted" : "text-primary-foreground/75 text-right"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground animate-spin">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-xs text-text-muted">
                  <span className="animate-pulse">Synthesizing gym metrics & response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input bar */}
          <div className="border-t border-border bg-background p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask AI anything about gym members, workout routines, nutrition, or attendance..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button variant="solid" type="submit" disabled={loading || !inputQuery.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

