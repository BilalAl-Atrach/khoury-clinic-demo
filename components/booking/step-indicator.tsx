import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  done && "border-[var(--navy)] bg-[var(--navy)] text-[var(--ivory)]",
                  active && "border-[var(--navy)] text-[var(--navy)]",
                  !done && !active && "border-[var(--border)] text-[var(--muted-foreground)]"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "hidden text-[11px] font-medium sm:block",
                  active || done ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && (
              <div className={cn("mx-2 h-px flex-1 sm:mx-3", done ? "bg-[var(--navy)]" : "bg-[var(--border)]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
