"use client";

import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import type { Appointment } from "@/types";
import { useLanguage } from "@/lib/i18n/context";
import { formatShortDate, formatTime, initials } from "@/lib/utils";
import { AppointmentStatusBadge } from "./status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, XCircle, CalendarClock, Send } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onComplete?: () => void;
  onSendWhatsApp?: () => void;
}

export function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onReschedule,
  onComplete,
  onSendWhatsApp,
}: AppointmentCardProps) {
  const { t, locale } = useLanguage();
  const isActive = appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "rescheduled";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{initials(appointment.patientName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{appointment.patientName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{appointment.serviceName}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)] sm:gap-6">
        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatShortDate(appointment.date, locale)}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{formatTime(appointment.time)}</span>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="flex items-center gap-2">
        {appointment.status === "pending" && onConfirm && (
          <Button size="sm" variant="gold" onClick={onConfirm}>
            <CheckCircle2 className="h-3.5 w-3.5" /> {t.common.confirm}
          </Button>
        )}
        {isActive && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onSendWhatsApp && (
                <DropdownMenuItem onSelect={onSendWhatsApp}>
                  <Send className="h-3.5 w-3.5" /> Send WhatsApp
                </DropdownMenuItem>
              )}
              {onReschedule && (
                <DropdownMenuItem onSelect={onReschedule}>
                  <CalendarClock className="h-3.5 w-3.5" /> {t.common.reschedule}
                </DropdownMenuItem>
              )}
              {onComplete && (
                <DropdownMenuItem onSelect={onComplete}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> {t.common.complete}
                </DropdownMenuItem>
              )}
              {onCancel && (
                <DropdownMenuItem onSelect={onCancel} className="text-[var(--destructive)]">
                  <XCircle className="h-3.5 w-3.5" /> {t.common.cancel}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
