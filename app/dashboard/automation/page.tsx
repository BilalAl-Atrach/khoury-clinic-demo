"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BellRing, CalendarCheck, CheckCircle2, MessageCircle, RotateCcw, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatShortDate, formatTime } from "@/lib/utils";
import { WhatsAppThread } from "@/components/whatsapp/whatsapp-thread";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AutomationPage() {
  const { t, locale } = useLanguage();
  useDashboardHeader(t.dashboard.automationTitle, t.dashboard.automationSubtitle);

  const appointments = useDemoStore((s) => s.appointments);
  const whatsappMessages = useDemoStore((s) => s.whatsappMessages);
  const sendWhatsApp = useDemoStore((s) => s.sendWhatsApp);
  const completeAppointment = useDemoStore((s) => s.completeAppointment);
  const automationRules = useDemoStore((s) => s.automationRules);

  const eligible = useMemo(
    () => appointments.filter((a) => a.status !== "cancelled").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [appointments]
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(eligible[0]?.id);
  const appointment = appointments.find((a) => a.id === selectedId) ?? eligible[0];
  const thread = whatsappMessages.filter((m) => m.appointmentId === appointment?.id);

  const actions = [
    {
      label: "Send Confirmation",
      icon: MessageCircle,
      onClick: () => appointment && sendWhatsApp(appointment.id, "confirmation", locale),
    },
    {
      label: "Send 24h Reminder",
      icon: BellRing,
      onClick: () => appointment && sendWhatsApp(appointment.id, "reminder-24h", locale),
    },
    {
      label: "Send 2h Reminder",
      icon: BellRing,
      onClick: () => appointment && sendWhatsApp(appointment.id, "reminder-2h", locale),
    },
    {
      label: "Simulate Appointment",
      icon: CheckCircle2,
      onClick: () => appointment && completeAppointment(appointment.id, locale),
    },
    {
      label: "Trigger Follow-up",
      icon: RotateCcw,
      onClick: () => appointment && sendWhatsApp(appointment.id, "follow-up", locale),
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Demo appointment</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Select an appointment" />
            </SelectTrigger>
            <SelectContent>
              {eligible.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.patientName} · {formatShortDate(a.date, locale)} {formatTime(a.time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-5 flex flex-wrap gap-2">
            {actions.map((a) => (
              <Button key={a.label} variant="outline" size="sm" onClick={a.onClick} disabled={!appointment}>
                <a.icon className="h-3.5 w-3.5" />
                {a.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif-display text-lg font-medium">Automation Rules</h3>
          <div className="mt-4 space-y-2">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy)]">
                    <Zap className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rule.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {rule.trigger} → {rule.action}
                    </p>
                  </div>
                </div>
                <Switch checked={rule.enabled} disabled />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:sticky lg:top-24">
          {appointment ? (
            <WhatsAppThread messages={thread} />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)]">
              <CalendarCheck className="me-2 h-4 w-4" /> Select an appointment to preview messages
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
