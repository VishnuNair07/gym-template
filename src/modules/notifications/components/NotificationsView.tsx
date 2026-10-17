"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useGymStore, GymNotification } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function NotificationsView() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
  } = useGymStore();

  const { showToast } = useToast();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => n.unread) : notifications;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    showToast({
      type: "success",
      title: "All Caught Up",
      message: "All alerts have been marked as read.",
    });
  };

  const handleClearAll = () => {
    clearAllNotifications();
    showToast({
      type: "info",
      title: "Alerts Cleared",
      message: "Notification log has been cleared.",
    });
  };

  const getIcon = (type: GymNotification["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "danger":
        return <AlertTriangle className="h-5 w-5 text-danger" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  return (
    <Shell>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                System Notifications & Alerts
              </h1>
              {unreadCount > 0 ? (
                <Badge variant="danger">{unreadCount} Unread</Badge>
              ) : (
                <Badge variant="success">All Read</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Turnstile warnings, subscription renewal reminders, payment updates, and facility alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="line"
              size="sm"
              disabled={unreadCount === 0}
              onClick={handleMarkAllRead}
              className="gap-1.5"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={notifications.length === 0}
              onClick={handleClearAll}
              className="gap-1.5 text-danger hover:text-danger hover:bg-danger-subtle"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === "all"
                ? "bg-primary text-primary-foreground"
                : "text-text-muted hover:text-text-primary hover:bg-surface"
              }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "text-text-muted hover:text-text-primary hover:bg-surface"
              }`}
          >
            Unread Only ({unreadCount})
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Bell className="h-8 w-8 text-text-muted" />
                <h3 className="font-semibold text-text-primary">No notifications</h3>
                <p className="text-xs text-text-muted">
                  You are all caught up on facility alerts and renewal updates.
                </p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => notif.unread && markNotificationRead(notif.id)}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-all ${notif.unread
                    ? "border-primary/40 bg-primary-subtle/15 shadow-xs cursor-pointer hover:bg-primary-subtle/25"
                    : "border-border bg-background"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-text-primary">{notif.title}</p>
                      {notif.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-text-muted pt-1">
                      <Clock className="h-3 w-3" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>

                {notif.unread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notif.id);
                    }}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}


