"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useDemoStore } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { DatePickerStrip } from "@/components/booking/date-picker-strip";
import { TimeSlotGrid } from "@/components/booking/time-slot-grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RescheduleDialog({
  appointmentId,
  open,
  onOpenChange,
}: {
  appointmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, locale } = useLanguage();
  const appointment = useDemoStore((s) => s.appointments.find((a) => a.id === appointmentId));
  const getAvailableSlots = useDemoStore((s) => s.getAvailableSlots);
  const rescheduleAppointment = useDemoStore((s) => s.rescheduleAppointment);
  const [date, setDate] = useState<string | null>(appointment?.date ?? null);
  const [time, setTime] = useState<string | null>(null);

  const slots = date ? getAvailableSlots(date, appointmentId ?? undefined) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.common.reschedule}</DialogTitle>
          <DialogDescription>
            {appointment ? `${appointment.patientName} — ${appointment.serviceName}` : ""}
          </DialogDescription>
        </DialogHeader>
        <DatePickerStrip value={date} onChange={(d) => { setDate(d); setTime(null); }} />
        <div className="mt-4">
          {slots.length > 0 ? (
            <TimeSlotGrid slots={slots} value={time} onChange={setTime} />
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">{t.booking.noSlots}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.common.close}
          </Button>
          <Button
            variant="gold"
            disabled={!date || !time}
            onClick={() => {
              if (appointmentId && date && time) {
                rescheduleAppointment(appointmentId, date, time, locale);
                onOpenChange(false);
              }
            }}
          >
            {t.common.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
