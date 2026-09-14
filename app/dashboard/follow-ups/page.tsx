"use client";

import { useMemo } from "react";
import { RotateCcw, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { FollowUpCard } from "@/components/dashboard/follow-up-card";
import { Badge } from "@/components/ui/badge";

export default function FollowUpsPage() {
  const { t, locale } = useLanguage();
  useDashboardHeader(t.dashboard.followUpsTitle, t.dashboard.followUpsSubtitle);

  const followUps = useDemoStore((s) => s.followUps);
  const sendFollowUpWhatsApp = useDemoStore((s) => s.sendFollowUpWhatsApp);
  const markFollowUpCompleted = useDemoStore((s) => s.markFollowUpCompleted);

  const groups = useMemo(() => {
    return {
      overdue: followUps.filter((f) => f.status === "overdue"),
      due: followUps.filter((f) => f.status === "due"),
      upcoming: followUps.filter((f) => f.status === "upcoming"),
      completed: followUps.filter((f) => f.status === "completed"),
    };
  }, [followUps]);

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold-light)] text-[var(--navy)]">
          <Zap className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-medium">Automated Recall</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Follow-up reminder automatically sent 30 days after appointment.
          </p>
        </div>
      </div>

      <Section title={t.dashboard.overdue} items={groups.overdue} tone="destructive" sendFollowUpWhatsApp={sendFollowUpWhatsApp} markFollowUpCompleted={markFollowUpCompleted} locale={locale} />
      <Section title={t.dashboard.dueToday} items={groups.due} tone="warning" sendFollowUpWhatsApp={sendFollowUpWhatsApp} markFollowUpCompleted={markFollowUpCompleted} locale={locale} />
      <Section title={t.dashboard.upcoming} items={groups.upcoming} tone="muted" sendFollowUpWhatsApp={sendFollowUpWhatsApp} markFollowUpCompleted={markFollowUpCompleted} locale={locale} />

      {groups.overdue.length + groups.due.length + groups.upcoming.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <RotateCcw className="h-6 w-6 text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">No follow-ups pending.</p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  tone,
  sendFollowUpWhatsApp,
  markFollowUpCompleted,
  locale,
}: {
  title: string;
  items: ReturnType<typeof useDemoStore.getState>["followUps"];
  tone: "destructive" | "warning" | "muted";
  sendFollowUpWhatsApp: (id: string, locale?: import("@/types").Locale) => void;
  markFollowUpCompleted: (id: string) => void;
  locale: import("@/types").Locale;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Badge variant={tone}>{items.length}</Badge>
      </div>
      <div className="space-y-3">
        {items.map((f) => (
          <FollowUpCard
            key={f.id}
            followUp={f}
            onSendWhatsApp={() => sendFollowUpWhatsApp(f.id, locale)}
            onMarkCompleted={() => markFollowUpCompleted(f.id)}
          />
        ))}
      </div>
    </div>
  );
}
