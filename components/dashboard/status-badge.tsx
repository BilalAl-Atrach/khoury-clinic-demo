"use client";

import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types";
import { useLanguage } from "@/lib/i18n/context";

const VARIANT: Record<AppointmentStatus, "success" | "warning" | "destructive" | "info" | "muted"> = {
  confirmed: "success",
  pending: "warning",
  completed: "info",
  cancelled: "destructive",
  rescheduled: "muted",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const { t } = useLanguage();
  const labelMap: Record<AppointmentStatus, string> = {
    confirmed: t.common.confirmed,
    pending: t.common.pending,
    completed: t.common.completed,
    cancelled: t.common.cancelled,
    rescheduled: t.common.rescheduled,
  };
  return <Badge variant={VARIANT[status]}>{labelMap[status]}</Badge>;
}
