"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export type TabItem = { value: string; label: string; disabled?: boolean };

export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: (activeValue: string) => React.ReactNode;
};

export function Tabs({ items, defaultValue, onChange, children }: TabsProps) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.value);

  function select(value: string) {
    setActive(value);
    onChange?.(value);
  }

  return (
    <div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            aria-selected={active === item.value}
            disabled={item.disabled}
            onClick={() => select(item.value)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              active === item.value
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-primary"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{children(active)}</div>
    </div>
  );
}
