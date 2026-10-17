"use client";

import {
  ChevronDown,
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  UserCircle2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

function formatRole(role?: string) {
  if (!role) return "Administrator";
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Topbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  async function handleLogout() {
    await dispatch(logout());
    router.replace("/login");
  }

  const displayName = user?.name ?? user?.email ?? "Admin";
  const initial = displayName.charAt(0).toUpperCase();
  const roleLabel = formatRole(user?.roleType);
  const userTypeLabel = user?.userType === "admin" ? "Admin Panel" : "Mobile User";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex min-h-[72px] items-center justify-end gap-4 px-4 sm:px-6">

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick action icons */}
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition-all hover:-translate-y-0.5 hover:bg-surface hover:text-text-primary md:inline-flex"
            aria-label="Search"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition-all hover:-translate-y-0.5 hover:bg-surface hover:text-text-primary"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* Theme toggle wrapper so it matches the rest visually */}
          <div className="rounded-xl">
            <ThemeToggle />
          </div>

          {/* Divider */}
          <div className="mx-1 hidden h-8 w-px bg-border lg:block" />

          {/* Profile dropdown */}
          <DropdownMenu
            trigger={
              <button
                type="button"
                className="group flex items-center gap-3 rounded-2xl border border-border bg-background px-2.5 py-2 shadow-sm"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary ring-1 ring-primary/15">
                  {initial}
                </div>

                {/* User meta */}
                <div className="hidden min-w-0 text-left sm:block">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {displayName}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="truncate">{roleLabel}</span>
                  </div>
                </div>

                <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-y-[1px]" />
              </button>
            }
          >
            <DropdownMenuLabel>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-text-primary">
                    {displayName}
                  </p>

                  {user?.email && (
                    <p className="truncate text-xs text-text-muted">{user.email}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      {roleLabel}
                    </span>

                    <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      {user?.userType === "admin" ? "Admin" : "Mobile"}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <UserCircle2 className="h-4 w-4" />
              My Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="danger" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}