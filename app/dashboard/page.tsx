"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CalendarDays, CalendarRange, TrendingDown, UserPlus, RotateCcw, DollarSign, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { addDaysISO, formatShortDate } from "@/lib/utils";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const { t, locale } = useLanguage();
  useDashboardHeader(t.dashboard.overviewTitle, t.dashboard.overviewSubtitle);

  const appointments = useDemoStore((s) => s.appointments);
  const patients = useDemoStore((s) => s.patients);
  const followUps = useDemoStore((s) => s.followUps);
  const services = useDemoStore((s) => s.services);
  const confirmAppointment = useDemoStore((s) => s.confirmAppointment);
  const cancelAppointment = useDemoStore((s) => s.cancelAppointment);
  const completeAppointment = useDemoStore((s) => s.completeAppointment);

  const today = addDaysISO(0);
  const monthPrefix = today.slice(0, 7);

  const stats = useMemo(() => {
    const active = appointments.filter((a) => a.status !== "cancelled");
    const todays = active.filter((a) => a.date === today);
    const upcoming = active.filter((a) => a.date > today);
    const thisMonth = appointments.filter((a) => a.date.startsWith(monthPrefix));
    const newPatients = patients.filter((p) => p.createdAt >= addDaysISO(-30)).length;
    const dueFollowUps = followUps.filter((f) => f.status === "due" || f.status === "overdue").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    const cancellationRate = appointments.length ? Math.round((cancelled / appointments.length) * 100) : 0;
    const estimatedValue = thisMonth
      .filter((a) => a.status !== "cancelled")
      .reduce((sum, a) => sum + (services.find((s) => s.id === a.serviceId)?.priceFrom ?? 0), 0);

    return { todays, upcoming, thisMonth, newPatients, dueFollowUps, cancellationRate, estimatedValue };
  }, [appointments, patients, followUps, services, today, monthPrefix]);

  const chartData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = addDaysISO(i - 10);
      const count = appointments.filter((a) => a.date === date && a.status !== "cancelled").length;
      return { date, count, label: formatShortDate(date, locale) };
    });
  }, [appointments, locale]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label={t.dashboard.todayAppointments} value={stats.todays.length} icon={CalendarDays} />
        <DashboardCard label={t.dashboard.upcomingAppointments} value={stats.upcoming.length} icon={CalendarRange} />
        <DashboardCard label={t.dashboard.newPatients} value={stats.newPatients} icon={UserPlus} trend="Last 30 days" />
        <DashboardCard label={t.dashboard.followUpsDue} value={stats.dueFollowUps} icon={RotateCcw} trendTone={stats.dueFollowUps > 0 ? "negative" : "neutral"} />
        <DashboardCard label={t.dashboard.monthAppointments} value={stats.thisMonth.length} icon={CalendarRange} />
        <DashboardCard
          label={t.dashboard.cancellationRate}
          value={`${stats.cancellationRate}%`}
          icon={TrendingDown}
          trendTone={stats.cancellationRate > 15 ? "negative" : "positive"}
        />
        <DashboardCard
          label={t.dashboard.estimatedValue}
          value={`$${stats.estimatedValue.toLocaleString()}`}
          icon={DollarSign}
          className="col-span-2 lg:col-span-2"
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-lg font-medium">Appointments — last 14 days</h3>
          <Badge variant="warning">{t.common.demoDataLabel}</Badge>
        </div>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14213d" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#14213d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4dccb", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#14213d" strokeWidth={2} fill="url(#colorAppts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-lg font-medium">{t.dashboard.todayAppointments}</h3>
          <Button asChild variant="link" size="sm">
            <Link href="/dashboard/appointments">
              {t.common.viewAll} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {stats.todays.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted-foreground)]">
              No appointments today.
            </p>
          )}
          {stats.todays.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onConfirm={() => confirmAppointment(a.id, locale)}
              onCancel={() => cancelAppointment(a.id, locale)}
              onComplete={() => completeAppointment(a.id, locale)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
