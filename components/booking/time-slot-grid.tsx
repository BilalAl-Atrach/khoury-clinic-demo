"use client";

import { formatTime, cn } from "@/lib/utils";

export function TimeSlotGrid({
  slots,
  value,
  onChange,
}: {
  slots: string[];
  value: string | null;
  onChange: (time: string) => void;
}) {
  if (slots.length === 0) return null;
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((time) => {
        const active = value === time;
        return (
          <button
            key={time}
            onClick={() => onChange(time)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--ivory)]"
                : "border-[var(--border)] hover:border-[var(--navy)]/40"
            )}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}
