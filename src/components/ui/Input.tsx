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
          "group flex h-10 w-full items-center gap-2.5 rounded-lg border bg-surface px-3 text-sm transition-all duration-150",
          invalid
            ? "border-danger ring-2 ring-danger/10 focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/20"
            : "border-border/80 shadow-2xs hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-xs",
          disabled && "cursor-not-allowed opacity-60 bg-surface-secondary/60 hover:border-border/80"
        )}
      >
        {prefix && (
          <span className="shrink-0 text-text-muted transition-colors group-focus-within:text-primary">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full flex-1 bg-transparent border-0 p-0 text-sm font-medium text-text-primary outline-none focus:outline-none focus:ring-0 placeholder:text-text-muted/60 placeholder:font-normal disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="shrink-0 text-text-muted transition-colors group-focus-within:text-primary">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
