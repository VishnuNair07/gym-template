"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const MODAL_SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-[95vw]",
} as const;

export type ModalSize = keyof typeof MODAL_SIZE_MAP;

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnOverlayClick?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
  closeOnOverlayClick = true,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg",
          "max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]",
          MODAL_SIZE_MAP[size],
          className
        )}
      >
        {title && (
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold tracking-tight text-text-primary">{title}</h2>
          </div>
        )}

        <div className="overflow-y-auto px-6 py-4 text-sm text-text-secondary">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}