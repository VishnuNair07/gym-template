"use client";

import { useEffect } from "react";
import { Alert } from "@/components/ui/Alert";

export type AlertMessageProps = {
    message: string | null;
    variant?: "success" | "danger" | "warning" | "info";
    duration?: number;
    onClose?: () => void;
};

export function AlertMessage({
    message,
    variant = "info",
    duration = 1000,
    onClose,
}: AlertMessageProps) {
    useEffect(() => {
        if (!message || !onClose) return;

        const timer = window.setTimeout(() => {
            onClose();
        }, duration);

        return () => window.clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    return <Alert variant={variant}>{message}</Alert>;
}