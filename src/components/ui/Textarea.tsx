import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, className, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full min-h-24 rounded-lg border bg-surface px-3 py-2.5 text-sm font-medium text-text-primary outline-none transition-all duration-150 placeholder:text-text-muted/60 placeholder:font-normal",
          invalid
            ? "border-danger ring-2 ring-danger/10 focus:border-danger focus:ring-2 focus:ring-danger/20"
            : "border-border/80 shadow-2xs hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-xs",
          disabled && "cursor-not-allowed opacity-60 bg-surface-secondary/60 hover:border-border/80",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
