"use client";

import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  Bell,
  Search,
  UserCircle2,
  Sparkles,
  Menu,
  X,
  Dumbbell,
  Users,
  CreditCard,
  CalendarCheck,
  Receipt,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { useGymStore } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

function formatRole(role?: string) {
  if (!role) return "General Manager";
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Topbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth?.user);
  const { notifications, members, plans, settings } = useGymStore();
  const { showToast } = useToast();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  async function handleLogout() {
    await dispatch(logout());
    localStorage.removeItem("gym_auth_user");
    showToast({
      type: "info",
      title: "Logged Out",
      message: "You have been logged out of GymPulse Admin.",
    });
    router.replace("/login");
  }

  const displayName = user?.name ?? "Alex Morgan";
  const initial = displayName.charAt(0).toUpperCase();
  const roleLabel = formatRole(user?.roleType);

  // Search filter
  const filteredMembers = searchQuery.trim()
    ? members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const filteredPlans = searchQuery.trim()
    ? plans.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left section: mobile hamburger & quick search bar */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary md:hidden"
              aria-label="Open Navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2.5 rounded-lg border border-border/80 bg-surface/80 px-2.5 py-1.5 text-xs text-text-muted transition-all hover:border-border-strong hover:bg-surface hover:text-text-primary w-60 lg:w-72"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 text-left tracking-tight">Search gym registry...</span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick action search icon (mobile) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border bg-background text-text-secondary hover:bg-surface sm:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <Link
              href="/notifications"
              className="relative inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border/80 bg-background text-text-secondary transition-all hover:border-border-strong hover:bg-surface hover:text-text-primary"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
              )}
            </Link>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Subtle Divider */}
            <div className="mx-1 hidden h-5 w-px bg-border/70 sm:block" />

            {/* Profile dropdown */}
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  className="group flex items-center gap-2 rounded-lg border border-border/80 bg-background px-2 py-1 shadow-2xs transition-all hover:border-border-strong hover:bg-surface"
                >
                  {/* Avatar */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                    {initial}
                  </div>

                  {/* User meta */}
                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="truncate text-xs font-semibold text-text-primary leading-tight">
                      {displayName}
                    </p>
                    <p className="truncate text-[10px] text-text-muted leading-tight">
                      {roleLabel}
                    </p>
                  </div>

                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted transition-transform group-hover:translate-y-[1px]" />
                </button>
              }
            >
              <DropdownMenuLabel>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-text-primary">
                      {displayName}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      {user?.email || "alex.manager@gympulse.com"}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center rounded border border-border/80 bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">
                        {roleLabel}
                      </span>
                      <span className="inline-flex items-center rounded border border-border/80 bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                        Active Facility Admin
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <UserCircle2 className="h-4 w-4" />
                Gym Settings & Operations
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="danger" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <Modal
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        title="Quick Search & Navigation"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Type member name, email, or membership plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            prefix={<Search className="h-4 w-4 text-text-muted" />}
          />

          {searchQuery.trim() === "" ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Quick Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Link
                  href="/members"
                  onClick={() => setSearchOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 text-center transition-colors hover:border-primary hover:bg-primary-subtle/30"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-text-primary">All Members</span>
                </Link>
                <Link
                  href="/attendance"
                  onClick={() => setSearchOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 text-center transition-colors hover:border-primary hover:bg-primary-subtle/30"
                >
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-text-primary">Check-in</span>
                </Link>
                <Link
                  href="/payments"
                  onClick={() => setSearchOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 text-center transition-colors hover:border-primary hover:bg-primary-subtle/30"
                >
                  <Receipt className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-text-primary">Payments</span>
                </Link>
                <Link
                  href="/plans"
                  onClick={() => setSearchOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 text-center transition-colors hover:border-primary hover:bg-primary-subtle/30"
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-text-primary">Plans</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* Members Result */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Members ({filteredMembers.length})
                </p>
                {filteredMembers.length > 0 ? (
                  <div className="space-y-1">
                    {filteredMembers.map((m) => (
                      <Link
                        key={m.id}
                        href={`/members?search=${encodeURIComponent(m.name)}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-lg p-2 hover:bg-surface-secondary text-sm transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{m.name}</p>
                            <p className="text-xs text-text-muted">{m.email} • {m.planName}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-text-muted" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No matching members found.</p>
                )}
              </div>

              {/* Plans Result */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Membership Plans ({filteredPlans.length})
                </p>
                {filteredPlans.length > 0 ? (
                  <div className="space-y-1">
                    {filteredPlans.map((p) => (
                      <Link
                        key={p.id}
                        href="/plans"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-lg p-2 hover:bg-surface-secondary text-sm transition-colors"
                      >
                        <div>
                          <p className="font-medium text-text-primary">{p.name}</p>
                          <p className="text-xs text-text-muted">${p.price} / {p.durationMonths} month(s)</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-text-muted" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No matching plans.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex w-72 flex-col bg-background border-r border-border p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <span className="font-bold text-text-primary">{settings.gymName}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-surface text-text-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Members", href: "/members" },
                { label: "Plans", href: "/plans" },
                { label: "Attendance", href: "/attendance" },
                { label: "Trainers & Staff", href: "/trainers" },
                { label: "Payments", href: "/payments" },
                { label: "Classes & Schedule", href: "/classes" },
                { label: "Workout Plans", href: "/workouts" },
                { label: "Diet Plans", href: "/diets" },
                { label: "Reports & Analytics", href: "/reports" },
                { label: "Notifications", href: "/notifications" },
                { label: "Settings", href: "/settings" },
                { label: "AI Assistant", href: "/ai-assistant" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}