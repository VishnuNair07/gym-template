import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type Variant = "neutral" | "success" | "danger" | "warning" | "info" | "primary";

const variantClasses: Record<Variant, { badge: string; dot: string }> = {
  neutral: {
    badge: "border-border bg-surface-secondary/70 text-text-secondary",
    dot: "bg-text-muted",
  },
  success: {
    badge: "border-success/20 bg-success-subtle text-success",
    dot: "bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]",
  },
  danger: {
    badge: "border-danger/20 bg-danger-subtle text-danger",
    dot: "bg-danger shadow-[0_0_8px_rgba(244,63,94,0.5)]",
  },
  warning: {
    badge: "border-warning/25 bg-warning-subtle text-warning",
    dot: "bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  },
  info: {
    badge: "border-info/20 bg-info-subtle text-info",
    dot: "bg-info shadow-[0_0_8px_rgba(56,189,248,0.5)]",
  },
  primary: {
    badge: "border-primary/25 bg-primary-subtle text-primary",
    dot: "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]",
  },
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  dot?: boolean;
};

export function Badge({
  variant = "neutral",
  dot = true,
  className,
  children,
  ...props
}: BadgeProps) {
  const styles = variantClasses[variant] || variantClasses.neutral;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-colors",
        styles.badge,
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)} />}
      <span>{children}</span>
    </span>
  );
}
