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
            "h-11 w-full appearance-none rounded-xl border bg-background pl-3 pr-10 text-sm font-medium text-text-primary shadow-sm outline-none transition-all duration-200",
            "placeholder:text-text-muted",
            invalid
              ? "border-danger bg-danger/5 focus:border-danger focus:ring-4 focus:ring-danger/10"
              : "border-border hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/10",
            disabled && "cursor-not-allowed border-border bg-surface text-text-muted opacity-70",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {children}

          {options &&
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>

        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
            disabled ? "text-text-muted" : "text-text-secondary"
          )}
        />
      </div>
    );
  }
);

Select.displayName = "Select";