import { type SelectHTMLAttributes, forwardRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type SelectOption = { label: string; value: string };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  children?: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid, options, placeholder, className, disabled, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border bg-surface pl-3 pr-9 text-sm font-medium text-text-primary outline-none transition-all duration-150",
            "placeholder:text-text-muted/60",
            invalid
              ? "border-danger ring-2 ring-danger/10 focus:border-danger focus:ring-2 focus:ring-danger/20"
              : "border-border/80 shadow-2xs hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-xs",
            disabled && "cursor-not-allowed opacity-60 bg-surface-secondary/60 hover:border-border/80",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden className="bg-surface text-text-muted">
              {placeholder}
            </option>
          )}

          {children}

          {options &&
            options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
                {opt.label}
              </option>
            ))}
        </select>

        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors text-text-muted"
          )}
        />
      </div>
    );
  }
);

Select.displayName = "Select";