import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, disabled, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn("inline-flex items-center gap-2 text-sm", disabled && "cursor-not-allowed opacity-50")}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          disabled={disabled}
          className={cn(
            "h-4 w-4 border-border-strong text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0",
            className
          )}
          {...props}
        />
        {label}
      </label>
    );
  }
);
Radio.displayName = "Radio";
