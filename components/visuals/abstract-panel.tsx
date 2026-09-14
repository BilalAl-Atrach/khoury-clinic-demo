import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  gold: "from-[#f3e9d2] via-[#eaddb9] to-[#d9c495]",
  navy: "from-[#1c2b4a] via-[#14213d] to-[#0d1830]",
  beige: "from-[#f5efe2] via-[#efe4cd] to-[#e2d3ae]",
  ivory: "from-[#fffdf9] via-[#f8f2e5] to-[#eee1c4]",
};

interface AbstractPanelProps {
  tone?: keyof typeof TONES;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AbstractPanel({ tone = "beige", icon: Icon, label, className, children }: AbstractPanelProps) {
  const isDark = tone === "navy";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br",
        TONES[tone],
        "bg-grain",
        className
      )}
    >
      <div
        className={cn(
          "absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl opacity-40",
          isDark ? "bg-[var(--gold)]" : "bg-white"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-16 -left-10 h-48 w-48 rounded-full blur-3xl opacity-30",
          isDark ? "bg-[var(--gold)]" : "bg-[var(--navy)]"
        )}
      />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
        {Icon && (
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full border",
              isDark ? "border-[var(--gold-light)]/40 text-[var(--gold-light)]" : "border-[var(--navy)]/15 text-[var(--navy)]"
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
        {label && (
          <p className={cn("text-sm font-medium tracking-wide", isDark ? "text-[var(--ivory)]/85" : "text-[var(--navy)]/80")}>
            {label}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export function DoctorPortrait({
  className,
  name = "Dr. Nadine Khoury",
  subtitle = "Dermatologist & Aesthetic Medicine",
}: {
  className?: string;
  name?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1c2b4a] to-[#0d1830]", "bg-grain", className)}>
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--gold)] opacity-20 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[var(--gold-light)] opacity-10 blur-3xl" />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--gold-light)]/50 bg-white/5">
          <span className="font-serif-display text-4xl font-medium text-[var(--gold-light)]">NK</span>
        </div>
        <div>
          <p className="font-serif-display text-2xl text-[var(--ivory)]">{name}</p>
          <p className="mt-1 text-sm text-[var(--gold-light)]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
