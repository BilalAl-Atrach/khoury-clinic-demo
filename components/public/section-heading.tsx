import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "start", className, light }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-[var(--gold-light)]" : "text-[var(--gold)]"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif-display text-3xl font-medium tracking-tight text-balance sm:text-4xl",
          light ? "text-[var(--ivory)]" : "text-[var(--foreground)]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-base leading-relaxed", light ? "text-[var(--ivory)]/75" : "text-[var(--muted-foreground)]")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
