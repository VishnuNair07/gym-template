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
          "w-full min-h-24 rounded-lg border bg-background px-3 py-2 text-sm outline-none placeholder:text-text-muted transition-colors",
          invalid
            ? "border-danger focus:ring-2 focus:ring-danger/20"
            : "border-border hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15",
          disabled && "cursor-not-allowed opacity-50 bg-surface",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
