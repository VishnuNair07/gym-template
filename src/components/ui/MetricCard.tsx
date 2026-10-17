import { type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface MetricCardMeta {
  label: string;
  value: string | number;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  delta?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  accentColor?: "primary" | "success" | "warning" | "info" | "danger";
  meta?: MetricCardMeta[];
  className?: string;
}

const accentMap = {
  primary: {
    bar: "from-primary/60 via-primary/20 to-transparent",
    iconBox: "border-primary/20 bg-primary-subtle text-primary",
  },
  success: {
    bar: "from-success/60 via-success/20 to-transparent",
    iconBox: "border-success/20 bg-success-subtle text-success",
  },
  warning: {
    bar: "from-warning/60 via-warning/20 to-transparent",
    iconBox: "border-warning/20 bg-warning-subtle text-warning",
  },
  info: {
    bar: "from-info/60 via-info/20 to-transparent",
    iconBox: "border-info/20 bg-info-subtle text-info",
  },
  danger: {
    bar: "from-danger/60 via-danger/20 to-transparent",
    iconBox: "border-danger/20 bg-danger-subtle text-danger",
  },
};

export function MetricCard({
  title,
  value,
  icon,
  delta,
  accentColor = "primary",
  meta,
  className,
}: MetricCardProps) {
  const styles = accentMap[accentColor] || accentMap.primary;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-background p-0 shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-sm",
        className
      )}
    >
      {/* Top 2px precision hairline accent */}
      <div className={cn("h-[2px] w-full bg-gradient-to-r", styles.bar)} />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
              {value}
            </p>
          </div>
          {icon && (
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                styles.iconBox
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {delta && (
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-tight border",
                delta.positive !== false
                  ? "border-success/20 bg-success-subtle text-success"
                  : "border-danger/20 bg-danger-subtle text-danger"
              )}
            >
              {delta.positive !== false ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {delta.value}
            </span>
            {delta.label && (
              <span className="text-[11px] text-text-muted">{delta.label}</span>
            )}
          </div>
        )}

        {meta && meta.length > 0 && (
          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
            {meta.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/60 bg-surface-secondary/50 px-2.5 py-1.5"
              >
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider truncate">
                  {item.label}
                </p>
                <p className="text-xs font-semibold text-text-primary tabular-nums truncate mt-0.5">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
