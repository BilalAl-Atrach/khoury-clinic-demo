import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendTone?: "positive" | "negative" | "neutral";
  className?: string;
}

export function DashboardCard({ label, value, icon: Icon, trend, trendTone = "neutral", className }: DashboardCardProps) {
  return (
    <div className={cn("rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy)]">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 font-serif-display text-2xl font-medium">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trendTone === "positive" && "text-[var(--success)]",
            trendTone === "negative" && "text-[var(--destructive)]",
            trendTone === "neutral" && "text-[var(--muted-foreground)]"
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
