import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--navy)] text-[var(--ivory)]",
        gold: "border-transparent bg-[var(--gold-light)] text-[var(--charcoal)]",
        outline: "border-[var(--border)] text-[var(--foreground)] bg-transparent",
        success: "border-transparent bg-[#e4ede7] text-[var(--success)]",
        warning: "border-transparent bg-[#f3e6cf] text-[#8a6a1f]",
        destructive: "border-transparent bg-[#f4e0dd] text-[var(--destructive)]",
        muted: "border-transparent bg-[var(--muted)] text-[var(--muted-foreground)]",
        info: "border-transparent bg-[#e0e6f0] text-[var(--navy)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
