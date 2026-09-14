"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { addDaysISO, formatShortDate } from "@/lib/utils";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { CheckCircle2, RotateCcw, TrendingUp, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#4c7a5b",
  pending: "#c9a96a",
  completed: "#14213d",
  cancelled: "#b5453a",
  rescheduled: "#8b98a0",
};

export default function AnalyticsPage() {
  const { t, locale } = useLanguage();
  useDashboardHeader(t.dashboard.analyticsTitle, t.dashboard.analyticsSubtitle);

  const appointments = useDemoStore((s) => s.appointments);
  const patients = useDemoStore((s) => s.patients);
  const followUps = useDemoStore((s) => s.followUps);

  const timeline = useMemo(
    () =>
      Array.from({ length: 21 }, (_, i) => {
        const date = addDaysISO(i - 14);
        return {
          date,
          label: formatShortDate(date, locale),
          count: appointments.filter((a) => a.date === date && a.status !== "cancelled").length,
        };
      }),
    [appointments, locale]
  );

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of appointments) counts[a.status] = (counts[a.status] ?? 0) + 1;
    return Object.entries(counts).map(([status, value]) => ({ status, value }));
  }, [appointments]);

  const newVsReturning = useMemo(() => {
    const newP = patients.filter((p) => p.totalAppointments <= 1).length;
    const returning = patients.length - newP;
    return [
      { label: "New", value: newP },
      { label: "Returning", value: returning },
    ];
  }, [patients]);

  const cancellationRate = appointments.length
    ? Math.round((appointments.filter((a) => a.status === "cancelled").length / appointments.length) * 100)
    : 0;
  const followUpCompletion = followUps.length
    ? Math.round((followUps.filter((f) => f.status === "completed").length / followUps.length) * 100)
    : 0;
  const bookingConversion = 68; // illustrative demo metric

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Badge variant="warning">{t.common.demoDataLabel}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Booking Conversion" value={`${bookingConversion}%`} icon={TrendingUp} trend="Website visitors → bookings" />
        <DashboardCard label="Follow-up Completion" value={`${followUpCompletion}%`} icon={RotateCcw} />
        <DashboardCard label={t.dashboard.cancellationRate} value={`${cancellationRate}%`} icon={CheckCircle2} />
        <DashboardCard label="Total Patients" value={patients.length} icon={Users2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 lg:col-span-2">
          <h3 className="font-serif-display text-lg font-medium">Appointments Over Time</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a96a" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#c9a96a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4dccb", fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="#c9a96a" strokeWidth={2} fill="url(#colorAnalytics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h3 className="font-serif-display text-lg font-medium">New vs Returning Patients</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newVsReturning} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4dccb", fontSize: 12 }} />
                <Bar dataKey="value" fill="#14213d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h3 className="font-serif-display text-lg font-medium">Appointment Status</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4dccb", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {statusBreakdown.map((entry) => (
              <span key={entry.status} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] }} />
                {entry.status} ({entry.value})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
