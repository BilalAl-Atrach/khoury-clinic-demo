"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Workflow,
  RotateCcw,
  Bot,
  BarChart3,
  Globe,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: t.dashboard.sidebarOverview, icon: LayoutGrid },
    { href: "/dashboard/appointments", label: t.dashboard.sidebarAppointments, icon: CalendarDays },
    { href: "/dashboard/patients", label: t.dashboard.sidebarPatients, icon: Users },
    { href: "/dashboard/automation", label: t.dashboard.sidebarAutomation, icon: Workflow },
    { href: "/dashboard/follow-ups", label: t.dashboard.sidebarFollowUps, icon: RotateCcw },
    { href: "/dashboard/telegram", label: t.dashboard.sidebarTelegram, icon: Bot },
    { href: "/dashboard/analytics", label: t.dashboard.sidebarAnalytics, icon: BarChart3 },
    { href: "/dashboard/website", label: t.dashboard.sidebarWebsite, icon: Globe },
    { href: "/dashboard/settings", label: t.dashboard.sidebarSettings, icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col bg-[var(--navy)] text-[var(--ivory)]">
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold-light)]/50 font-serif-display text-sm text-[var(--gold-light)]">
            NK
          </span>
          <span className="font-serif-display text-sm leading-tight">
            Khoury Clinic
            <span className="block text-[10px] font-sans uppercase tracking-widest text-[var(--ivory)]/50">Dashboard</span>
          </span>
        </Link>
        <button onClick={onNavigate} className="rounded-full p-1.5 hover:bg-white/10 lg:hidden" aria-label="Close menu">
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-[var(--gold)] text-[var(--charcoal)]" : "text-[var(--ivory)]/75 hover:bg-white/10 hover:text-[var(--ivory)]"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-xs font-medium text-[var(--ivory)]/80 hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t.dashboard.backToWebsite}
        </Link>
      </div>
    </div>
  );
}
