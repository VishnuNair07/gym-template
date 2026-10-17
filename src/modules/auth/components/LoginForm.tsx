"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { useToast } from "@/context/ToastContext";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [email, setEmail] = useState("admin@gympulse.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      // Dummy credentials accepted
      if (
        (email === "admin@gympulse.com" || email === "admin@apex.com" || email.includes("admin")) &&
        (password === "admin123" || password === "password" || password.length >= 4)
      ) {
        const authUser = {
          id: "usr_admin_01",
          name: "Alex Morgan",
          email,
          roleType: "General Manager",
          userType: "admin" as const,
        };

        dispatch(setUser(authUser));
        localStorage.setItem("gym_auth_user", JSON.stringify(authUser));

        showToast({
          type: "success",
          title: "Authentication Successful",
          message: "Welcome back to Apex Gym Admin Control.",
        });

        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Use admin@gympulse.com and admin123.");
        setLoading(false);
        showToast({
          type: "danger",
          title: "Login Failed",
          message: "Invalid credentials. Use demo credentials displayed below.",
        });
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail("admin@gympulse.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] bg-background">
      {/* Left branding panel (Section 5) */}
      <div className="relative hidden xl:flex overflow-hidden border-r border-border/60 flex-col justify-between p-12 bg-[linear-gradient(135deg,rgba(59,130,246,0.08),transparent_35%,rgba(16,185,129,0.08))]">
        {/* Blur orbs */}
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-success/10 blur-3xl" />

        {/* Brand Chip */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-text-primary">
                Apex Gym Management
              </span>
              <p className="text-xs text-text-muted">Enterprise Club Administration Suite</p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
            High performance operations for fitness clubs & health centers.
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Real-time turnstile monitoring, member subscription billing, trainer pairing, and intelligent attendance metrics in one place.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 shadow-sm backdrop-blur">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Live Turnstile & Floor Activity</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Track member scans, automated locker assignments, and hourly floor capacity limits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 shadow-sm backdrop-blur">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Subscription Lifecycle & POS</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Automated renewal tracking, simulated tax invoices, and trainer schedule rosters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-text-muted pt-6 border-t border-border/50">
          <span>Apex Gym Systems v2.4</span>
          <span>Security & Compliance Audited</span>
        </div>
      </div>

      {/* Right auth panel (the form) */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background/90 shadow-2xl backdrop-blur">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-[linear-gradient(90deg,rgba(59,130,246,0.9),rgba(16,185,129,0.9))]" />

            <div className="p-8 space-y-6">
              {/* Header inside card */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                  Admin Access
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                  Sign in to Apex Gym
                </h1>
                <p className="mt-1 text-xs text-text-muted">
                  Enter your administrative credentials to manage club operations.
                </p>
              </div>

              {/* Demo Credentials Helper Banner */}
              <div className="rounded-xl border border-primary/20 bg-primary-subtle/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <KeyRound className="h-3.5 w-3.5" />
                    Demo Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="text-xs text-text-secondary space-y-0.5">
                  <p><strong>Email:</strong> admin@gympulse.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-danger/30 bg-danger-subtle p-3 text-xs text-danger">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <FormField label="Staff Email Address" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gympulse.com"
                    required
                    prefix={<Mail className="h-4 w-4 text-text-muted" />}
                    className="h-12 rounded-xl"
                  />
                </FormField>

                <FormField label="Password" required>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    prefix={<Lock className="h-4 w-4 text-text-muted" />}
                    className="h-12 rounded-xl"
                  />
                </FormField>

                <Button
                  variant="solid"
                  size="lg"
                  type="submit"
                  loading={loading}
                  block
                  className="h-12 rounded-xl font-semibold shadow-md mt-2"
                >
                  Sign In to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              {/* Trust strip (Section 5) */}
              <div className="rounded-2xl border border-border/70 bg-surface/80 p-3 text-center">
                <p className="text-[11px] text-text-muted">
                  🔒 Encrypted Session • Role-based access control enabled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

