
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
        "border-r border-border bg-surface",
        "transition-[width] duration-200 ease-in-out",
        "motion-reduce:transition-none",
        collapsed ? "w-[68px]" : "w-[252px]"
      )}
    >
      <div
        className={cn(
          "flex h-[60px] shrink-0 items-center border-b border-border/80",
          collapsed ? "justify-center px-2" : "justify-between px-3"
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "border border-border bg-surface-secondary/60 text-primary",
              "transition-colors hover:bg-primary-subtle",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <Dumbbell size={18} strokeWidth={2} />
          </button>
        ) : (
          <>
            <Link
              href="/dashboard"
              aria-label={`${gymName} dashboard`}
              className="flex min-w-0 items-center gap-2.5 rounded-lg"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Dumbbell size={18} strokeWidth={2.2} />
              </span>

              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[12px] font-bold uppercase tracking-[0.11em] text-text-primary">
                  {gymName}
                </span>
                <span className="truncate text-[10px] tracking-tight text-text-muted">
                  Fitness Management
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "text-text-muted transition-colors",
                "hover:bg-surface-secondary hover:text-text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <PanelLeftClose size={16} strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-2.5 py-5 scrollbar-thin"
      >
        {navGroups.map((group) => (
          <section
            key={group.group}
            aria-label={group.group}
            className="space-y-1"
          >
            {!collapsed && (
              <h2 className="truncate px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
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
                    "group relative flex h-9 items-center rounded-lg",
                    "text-[13px] font-semibold",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    collapsed
                      ? "justify-center px-2"
                      : "gap-3 px-3",
                    active
                      ? "bg-primary-subtle font-semibold text-primary"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
                    item.highlight &&
                    !active &&
                    "text-primary hover:bg-primary-subtle/60"
                  )}
                >
                  {active && !collapsed && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-primary"
                    />
                  )}

                  <Icon
                    aria-hidden="true"
                    size={17}
                    strokeWidth={active ? 2.1 : 1.8}
                    className={cn(
                      "shrink-0 transition-colors",
                      active
                        ? "text-primary"
                        : "text-text-muted group-hover:text-text-primary",
                      item.highlight && !active && "text-primary"
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
                      className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold tabular-nums text-white"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}

                  {showBadge && collapsed && (
                    <span
                      aria-label={`${unreadCount} unread notifications`}
                      className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger ring-2 ring-surface"
                    />
                  )}
                </Link>
              );
            })}
          </section>
        ))}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-border/80",
          collapsed ? "p-2.5" : "p-3"
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
          <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-surface-secondary/50 px-3 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary">
              <ShieldIcon />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-text-primary">
                Management Console
              </p>
              <p className="mt-0.5 truncate text-[10px] text-text-muted">
                Gym operations workspace
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
