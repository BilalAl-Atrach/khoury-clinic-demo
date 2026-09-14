"use client";

import { motion } from "framer-motion";
import { Bot, Link2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatShortDate, formatTime } from "@/lib/utils";
import { TelegramChat } from "@/components/telegram/telegram-chat";
import { AppointmentStatusBadge } from "@/components/dashboard/status-badge";

const SUGGESTIONS = [
  "/today",
  "/tomorrow",
  "/appointments",
  "Add Sarah tomorrow at 4pm for a skin consultation",
  "Move Maya to Thursday at 3pm",
  "Cancel Lina's appointment",
  "How many appointments are scheduled today?",
];

export default function TelegramPage() {
  const { t, locale } = useLanguage();
  useDashboardHeader(t.dashboard.telegramTitle, t.dashboard.telegramSubtitle);

  const messages = useDemoStore((s) => s.telegramMessages);
  const pending = useDemoStore((s) => s.telegramPending);
  const telegramSend = useDemoStore((s) => s.telegramSend);
  const telegramConfirmPending = useDemoStore((s) => s.telegramConfirmPending);
  const telegramCancelPending = useDemoStore((s) => s.telegramCancelPending);
  const appointments = useDemoStore((s) => s.appointments);

  const telegramAppointments = appointments
    .filter((a) => a.source === "telegram")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <TelegramChat
          messages={messages}
          onSend={(text) => telegramSend(text)}
          onAction={(v) => (v === "confirm" ? telegramConfirmPending(locale) : telegramCancelPending())}
          pending={!!pending}
          suggestions={SUGGESTIONS}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-[var(--gold)]" />
            <h3 className="font-serif-display text-base font-medium">Connected to Dashboard</h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
            Changes made from Telegram appear instantly in Appointments — try it above, then check the list below.
          </p>

          <div className="mt-4 space-y-2">
            {telegramAppointments.length === 0 && (
              <p className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted-foreground)]">
                No appointments created via Telegram yet.
              </p>
            )}
            {telegramAppointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2aabee]/10 text-[#2aabee]">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{a.patientName}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {formatShortDate(a.date, locale)} · {formatTime(a.time)}
                    </p>
                  </div>
                </div>
                <AppointmentStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
