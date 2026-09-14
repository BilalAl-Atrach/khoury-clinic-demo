"use client";

import { Calendar, CheckCircle2, MessageCircle } from "lucide-react";
import type { FollowUp } from "@/types";
import { useLanguage } from "@/lib/i18n/context";
import { formatShortDate, initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const VARIANT: Record<FollowUp["status"], "success" | "warning" | "destructive" | "muted"> = {
  upcoming: "muted",
  due: "warning",
  overdue: "destructive",
  completed: "success",
};

export function FollowUpCard({
  followUp,
  onSendWhatsApp,
  onMarkCompleted,
}: {
  followUp: FollowUp;
  onSendWhatsApp: () => void;
  onMarkCompleted: () => void;
}) {
  const { locale, t } = useLanguage();
  const labels: Record<FollowUp["status"], string> = {
    upcoming: t.dashboard.upcoming,
    due: t.dashboard.dueToday,
    overdue: t.dashboard.overdue,
    completed: t.common.completed,
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarFallback>{initials(followUp.patientName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{followUp.patientName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{followUp.treatment}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
        <span>Last visit: {formatShortDate(followUp.lastVisit, locale)}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {formatShortDate(followUp.dueDate, locale)}</span>
        <Badge variant={VARIANT[followUp.status]}>{labels[followUp.status]}</Badge>
      </div>

      {followUp.status !== "completed" && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onSendWhatsApp}>
            <MessageCircle className="h-3.5 w-3.5" /> {t.common.whatsapp}
          </Button>
          <Button size="sm" variant="gold" onClick={onMarkCompleted}>
            <CheckCircle2 className="h-3.5 w-3.5" /> {t.common.complete}
          </Button>
        </div>
      )}
    </div>
  );
}
