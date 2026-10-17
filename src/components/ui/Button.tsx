import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "solid" | "subtle" | "ghost" | "line";
type Size = "sm" | "md" | "lg";

const baseClasses =
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 active:translate-y-px";

const variantClasses: Record<Variant, string> = {
  solid: cn(
    "border border-primary bg-primary text-primary-foreground shadow-sm",
    "hover:bg-primary-hover hover:border-primary-hover",
    "active:shadow-xs"
  ),

  subtle: cn(
    "border border-primary/10 bg-primary-subtle text-primary shadow-sm",
    "hover:bg-primary-subtle/80 hover:border-primary/20",
    "active:shadow-none"
  ),

  ghost: cn(
    "border border-transparent bg-transparent text-text-secondary",
    "hover:bg-surface hover:text-text-primary",
    "active:bg-surface-hover"
  ),

  line: cn(
    "border border-border bg-background text-text-primary shadow-sm",
    "hover:border-border-strong hover:bg-surface",
    "active:bg-surface-hover"
  ),
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 rounded-lg px-3 text-sm",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-11 rounded-xl px-5 text-base",
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
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        block && "w-full",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      <span className={cn("inline-flex items-center", loading && "opacity-90")}>
        {children}
      </span>
    </button>
  );
}