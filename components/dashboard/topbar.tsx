"use client";

import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDemoStore } from "@/lib/store/demo-store";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardTopbar({ onMenuClick, title, subtitle }: { onMenuClick: () => void; title: string; subtitle?: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const logout = useDemoStore((s) => s.logout);
  const clinic = useDemoStore((s) => s.clinic);
  const followUpsDue = useDemoStore((s) => s.followUps.filter((f) => f.status === "due" || f.status === "overdue").length);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-[var(--muted)] lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-serif-display text-lg font-medium sm:text-xl">{title}</h1>
          {subtitle && <p className="hidden text-xs text-[var(--muted-foreground)] sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge variant="warning" className="hidden sm:inline-flex">{t.common.demoDataLabel}</Badge>
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-full p-2 hover:bg-[var(--muted)]" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5" />
              {followUpsDue > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--destructive)] text-[9px] font-bold text-white">
                  {followUpsDue}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
              {followUpsDue} {t.dashboard.followUpsDue.toLowerCase()}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-[var(--border)] py-1 pe-3 ps-1">
              <Avatar className="h-7 w-7">
                <AvatarFallback>NK</AvatarFallback>
              </Avatar>
              <span className="hidden text-xs font-medium sm:block">{clinic.name.split(" ")[0]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> {t.dashboard.demoAccount}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut className="h-3.5 w-3.5" /> {t.dashboard.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
