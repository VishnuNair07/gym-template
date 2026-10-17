import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  invalid?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, prefix, suffix, className, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm transition-colors",
          invalid
            ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
            : "border-border hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
          disabled && "cursor-not-allowed opacity-50 bg-surface hover:border-border"
        )}
      >
        {prefix && <span className="text-text-muted">{prefix}</span>}
        <input
          ref={ref}
          disabled={disabled}
          className={cn("flex-1 bg-transparent outline-none placeholder:text-text-muted", className)}
          {...props}
        />
        {suffix && <span className="text-text-muted">{suffix}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
