import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "solid" | "subtle" | "ghost" | "line";
type Size = "sm" | "md" | "lg";

const baseClasses =
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 active:translate-y-px select-none";

const variantClasses: Record<Variant, string> = {
  solid: cn(
    "border border-primary/90 bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.2)]",
    "hover:bg-primary-hover hover:border-primary",
    "active:shadow-none"
  ),

  subtle: cn(
    "border border-primary/20 bg-primary-subtle text-primary shadow-xs",
    "hover:bg-primary-subtle/80 hover:border-primary/30",
    "active:shadow-none"
  ),

  ghost: cn(
    "border border-transparent bg-transparent text-text-secondary",
    "hover:bg-surface-secondary/70 hover:text-text-primary",
    "active:bg-surface-secondary"
  ),

  line: cn(
    "border border-border/80 bg-background text-text-primary shadow-xs",
    "hover:border-border-strong hover:bg-surface",
    "active:bg-surface-secondary"
  ),
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 rounded-lg px-3 text-xs tracking-tight",
  md: "h-9 rounded-lg px-3.5 text-xs font-semibold tracking-tight",
  lg: "h-10 rounded-xl px-4 text-sm font-semibold tracking-tight",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
};

export function Button({
  variant = "solid",
  size = "md",
  block = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        block && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
      )}
      {children}
    </button>
  );
}