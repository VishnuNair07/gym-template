import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  required,
  error,
  helper,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          {label}
          {required && <span className="ml-1 text-danger font-bold">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-semibold text-danger flex items-center gap-1">{error}</p>
      ) : (
        helper && <p className="text-xs text-text-muted">{helper}</p>
      )}
    </div>
  );
}

