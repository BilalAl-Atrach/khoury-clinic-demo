"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { addDaysISO, formatDate } from "@/lib/utils";
import type { AppointmentStatus } from "@/types";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { RescheduleDialog } from "@/components/dashboard/reschedule-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RangeKey = "day" | "week" | "month";

const STATUS_FILTERS: (AppointmentStatus | "all")[] = [
  "all",
  "confirmed",
  "pending",
  "completed",
  "cancelled",
  "rescheduled",
];

export default function AppointmentsPage() {
  const { t, locale } = useLanguage();
  useDashboardHeader(t.dashboard.appointmentsTitle, t.dashboard.appointmentsSubtitle);

  const appointments = useDemoStore((s) => s.appointments);
  const confirmAppointment = useDemoStore((s) => s.confirmAppointment);
  const cancelAppointment = useDemoStore((s) => s.cancelAppointment);
  const completeAppointment = useDemoStore((s) => s.completeAppointment);
  const sendWhatsApp = useDemoStore((s) => s.sendWhatsApp);

  const [range, setRange] = useState<RangeKey>("week");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

  const today = addDaysISO(0);
  const rangeEnd = range === "day" ? today : range === "week" ? addDaysISO(6) : addDaysISO(29);
  const rangeStart = addDaysISO(-30);

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => (range === "day" ? a.date === today : a.date >= rangeStart && a.date <= rangeEnd))
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter((a) => a.patientName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appointments, range, statusFilter, search, today, rangeEnd, rangeStart]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const a of filtered) {
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const statusLabels: Record<AppointmentStatus | "all", string> = {
    all: t.common.viewAll,
    confirmed: t.common.confirmed,
    pending: t.common.pending,
    completed: t.common.completed,
    cancelled: t.common.cancelled,
    rescheduled: t.common.rescheduled,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <TabsList>
            <TabsTrigger value="day">{t.dashboard.day}</TabsTrigger>
            <TabsTrigger value="week">{t.dashboard.week}</TabsTrigger>
            <TabsTrigger value="month">{t.dashboard.month}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search patient…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              statusFilter === s ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--ivory)]" : "border-[var(--border)] hover:border-[var(--navy)]/40"
            )}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {grouped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--muted-foreground)]">
            No appointments match these filters.
          </p>
        )}
        {grouped.map(([date, list]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold">{formatDate(date, locale)}</h3>
              <Badge variant="muted">{list.length}</Badge>
            </div>
            <div className="space-y-3">
              {list.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  onConfirm={() => confirmAppointment(a.id, locale)}
                  onCancel={() => cancelAppointment(a.id, locale)}
                  onComplete={() => completeAppointment(a.id, locale)}
                  onReschedule={() => setRescheduleId(a.id)}
                  onSendWhatsApp={() => sendWhatsApp(a.id, "reminder-24h", locale)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <RescheduleDialog
        key={rescheduleId ?? "none"}
        appointmentId={rescheduleId}
        open={!!rescheduleId}
        onOpenChange={(o) => !o && setRescheduleId(null)}
      />
    </div>
  );
}
