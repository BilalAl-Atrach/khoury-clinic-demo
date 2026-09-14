import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoPanelProps {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

export function PhotoPanel({ src, alt, label, className, priority, children }: PhotoPanelProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        priority={priority}
      />
      {(label || children) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent p-5 pt-12">
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

export function DoctorPhoto({
  className,
  name = "Dr. Nadine Khoury",
  subtitle = "Dermatologist & Aesthetic Medicine",
  priority,
}: {
  className?: string;
  name?: string;
  subtitle?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-[var(--border)]", className)}>
      <Image
        src="/images/doctor-portrait.jpg"
        alt={name}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/85 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold-light)]/60 bg-[var(--navy)]/40 font-serif-display text-sm text-[var(--gold-light)] backdrop-blur-sm">
          NK
        </span>
        <div>
          <p className="font-serif-display text-lg text-white">{name}</p>
          <p className="text-xs text-[var(--gold-light)]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
