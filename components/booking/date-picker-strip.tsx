"use client";

import { addDaysISO } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface DatePickerStripProps {
  value: string | null;
  onChange: (iso: string) => void;
  days?: number;
}

export function DatePickerStrip({ value, onChange, days = 21 }: DatePickerStripProps) {
  const { locale } = useLanguage();
  const dates = Array.from({ length: days }, (_, i) => addDaysISO(i));

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {dates.map((iso) => {
        const d = new Date(iso);
        const weekday = new Intl.DateTimeFormat(locale === "ar" ? "ar-LB" : "en-US", { weekday: "short" }).format(d);
        const day = d.getDate();
        const month = new Intl.DateTimeFormat(locale === "ar" ? "ar-LB" : "en-US", { month: "short" }).format(d);
        const active = value === iso;
        return (
          <button
            key={iso}
            onClick={() => onChange(iso)}
            className={cn(
              "flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition-colors",
              active
                ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--ivory)]"
                : "border-[var(--border)] hover:border-[var(--navy)]/40"
            )}
          >
            <span className={cn("text-[10px] uppercase", active ? "text-[var(--ivory)]/70" : "text-[var(--muted-foreground)]")}>
              {weekday}
            </span>
            <span className="font-serif-display text-lg">{day}</span>
            <span className={cn("text-[10px]", active ? "text-[var(--ivory)]/70" : "text-[var(--muted-foreground)]")}>
              {month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
