import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "success" | "danger" | "warning" | "info";

const variantClasses: Record<Variant, string> = {
  success: "bg-success-subtle text-success border-success/20",
  danger: "bg-danger-subtle text-danger border-danger/20",
  warning: "bg-warning-subtle text-warning border-warning/20",
  info: "bg-info-subtle text-info border-info/20",
};

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  title?: string;
};

export function Alert({ variant = "info", title, className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border px-4 py-3 text-sm shadow-sm", variantClasses[variant], className)}
      {...props}
    >
      {title && <p className="font-medium">{title}</p>}
      {children && <p className={title ? "mt-1 text-text-secondary" : undefined}>{children}</p>}
    </div>
  );
}
