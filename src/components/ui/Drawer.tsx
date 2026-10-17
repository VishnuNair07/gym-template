"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  placement?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  children: ReactNode;
  footer?: ReactNode;
  headerActions?: ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
  bodyClassName?: string;
};

const sizeClasses: Record<NonNullable<DrawerProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-full",
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  placement = "right",
  size = "md",
  children,
  footer,
  headerActions,
  closeOnOverlayClick = true,
  className,
  bodyClassName,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute top-0 flex h-full w-full flex-col border-border bg-background shadow-2xl",
          sizeClasses[size],
          placement === "right"
            ? "right-0 border-l"
            : "left-0 border-r",
          className
        )}
      >
        {(title || description || headerActions) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div className="min-w-0">
              {title ? (
                <h2 className="text-base font-semibold tracking-tight text-text-primary">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-text-muted">{description}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {headerActions}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm text-text-secondary", bodyClassName)}>
          {children}
        </div>

        {footer ? (
          <div className="border-t border-border bg-background px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}