import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "primary" | "success" | "warning" | "info";
  className?: string;
  trend?: string;
}

const variantStyles = {
  primary: "border-primary/20 bg-primary-subtle text-primary",
  success: "border-success/20 bg-success-subtle text-success",
  warning: "border-warning/20 bg-warning-subtle text-warning",
  info: "border-info/20 bg-info-subtle text-info",
};

export function StatCard({
  label,
  value,
  icon,
  variant = "primary",
  className,
  trend,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4 shadow-xs transition-all duration-200 hover:border-border-strong",
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
            variantStyles[variant]
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted truncate">
          {label}
        </p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <p className="text-xl font-bold tracking-tight text-text-primary tabular-nums">
            {value}
          </p>
          {trend && (
            <span className="text-[11px] font-medium text-success truncate">{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
}
