
"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Award,
  Receipt,
  CalendarDays,
  Dumbbell,
  Utensils,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useGymStore } from "@/context/GymStoreContext";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: "notifications";
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: "Core Operations",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Members", href: "/members", icon: Users },
      { label: "Membership Plans", href: "/plans", icon: CreditCard },
      { label: "Attendance", href: "/attendance", icon: CalendarCheck },
    ],
  },
  {
    group: "Facility & Billing",
    items: [
      { label: "Trainers & Staff", href: "/trainers", icon: Award },
      { label: "Payments & Ledger", href: "/payments", icon: Receipt },
      { label: "Classes & Schedule", href: "/classes", icon: CalendarDays },
    ],
  },
  {
    group: "Programs",
    items: [
      { label: "Workout Routines", href: "/workouts", icon: Dumbbell },
      { label: "Diet Protocols", href: "/diets", icon: Utensils },
    ],
  },
  {
    group: "Intelligence & Tools",
    items: [
      { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        badgeKey: "notifications",
      },
      {
        label: "AI Operations Advisor",
        href: "/ai-assistant",
        icon: Sparkles,
        highlight: true,
      },
      { label: "System Settings", href: "/settings", icon: Settings },
    ],
  },
];

const STORAGE_KEY = "gym.sidebar.collapsed";

const subscribeSidebar = (onStoreChange: () => void) => {
  window.addEventListener("sidebar-toggle", onStoreChange);
  return () => window.removeEventListener("sidebar-toggle", onStoreChange);
};

const getSidebarSnapshot = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const getSidebarServerSnapshot = () => false;

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getSidebarServerSnapshot
  );
  const { notifications, settings } = useGymStore();

  const unreadCount = notifications.reduce(
    (count, notification) => count + (notification.unread ? 1 : 0),
    0
  );

  const gymName = settings.gymName?.trim() || "APEX OS";

  const toggleSidebar = useCallback(() => {
    const next = !getSidebarSnapshot();
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Sidebar still works when storage is unavailable.
    }
    window.dispatchEvent(new Event("sidebar-toggle"));
  }, []);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") {
        return pathname === href;
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  return (
    <aside
      aria-label="Main sidebar"
      className={cn(
        "hidden md:flex h-dvh shrink-0 flex-col overflow-hidden",
        "border-r border-shell-border bg-shell-bg text-shell-text",
        "transition-[width] duration-200 ease-in-out",
        "motion-reduce:transition-none",
        collapsed ? "w-[68px]" : "w-[236px]"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-shell-border",
          collapsed ? "justify-center px-2" : "justify-between px-3.5"
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className={cn(
              "flex h-8.5 w-8.5 items-center justify-center rounded-lg",
              "border border-slate-700/80 bg-slate-900/80 text-primary",
              "transition-colors hover:bg-slate-800",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <Dumbbell size={17} strokeWidth={2.2} />
          </button>
        ) : (
          <>
            <Link
              href="/dashboard"
              aria-label={`${gymName} dashboard`}
              className="flex min-w-0 items-center gap-2.5 rounded-lg"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                <Dumbbell size={17} strokeWidth={2.4} />
              </span>

              <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-extrabold uppercase tracking-[0.14em] text-white">
                  {gymName}
                </span>
                <span className="truncate text-[10px] text-slate-400">
                  Admin Platform
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className={cn(
                "flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-md",
                "text-slate-400 transition-colors",
                "hover:bg-slate-800 hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <PanelLeftClose size={15} strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-2.5 py-4 scrollbar-thin"
      >
        {navGroups.map((group) => (
          <section
            key={group.group}
            aria-label={group.group}
            className="space-y-0.5"
          >
            {!collapsed && (
              <h2 className="truncate px-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {group.group}
              </h2>
            )}

            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              const showBadge =
                item.badgeKey === "notifications" && unreadCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex h-8.5 items-center rounded-lg",
                    "text-xs font-semibold",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    collapsed
                      ? "justify-center px-2"
                      : "gap-2.5 px-2.5",
                    active
                      ? "bg-shell-active-bg font-bold text-white shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    size={16}
                    strokeWidth={active ? 2.2 : 1.9}
                    className={cn(
                      "shrink-0 transition-colors",
                      active ? "text-primary" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />

                  {!collapsed && (
                    <span className="min-w-0 flex-1 truncate tracking-[-0.01em]">
                      {item.label}
                    </span>
                  )}

                  {showBadge && !collapsed && (
                    <span
                      aria-label={`${unreadCount} unread notifications`}
                      className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white shadow-2xs"
                    >
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </section>
        ))}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-shell-border",
          collapsed ? "p-2" : "p-3"
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-lg",
              "text-text-muted transition-colors",
              "hover:bg-surface-secondary hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <PanelLeftOpen size={17} strokeWidth={1.8} />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/60 px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800 text-primary">
              <ShieldIcon />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                Apex Facility OS
              </p>
              <p className="truncate text-[10px] text-slate-400">
                Turnstile scanner active
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function ShieldIcon() {
  return <Settings size={15} strokeWidth={1.8} />;
}
