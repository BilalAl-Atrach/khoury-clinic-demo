"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, UserPlus, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerStrip } from "@/components/booking/date-picker-strip";
import { TimeSlotGrid } from "@/components/booking/time-slot-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PatientMode = "existing" | "new";

const initialState = {
  mode: "existing" as PatientMode,
  patientId: "",
  name: "",
  phone: "",
  email: "",
  serviceId: "",
  date: null as string | null,
  time: null as string | null,
};

export function NewAppointmentDialog() {
  const { t, locale } = useLanguage();
  const patients = useDemoStore((s) => s.patients);
  const services = useDemoStore((s) => s.services);
  const getAvailableSlots = useDemoStore((s) => s.getAvailableSlots);
  const bookAppointment = useDemoStore((s) => s.bookAppointment);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialState);

  const slots = useMemo(() => (form.date ? getAvailableSlots(form.date) : []), [form.date, getAvailableSlots]);
  const selectedPatient = patients.find((p) => p.id === form.patientId);

  const canSubmit =
    !!form.serviceId &&
    !!form.date &&
    !!form.time &&
    (form.mode === "existing"
      ? !!form.patientId
      : form.name.trim().length > 1 && form.phone.trim().length > 5);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setForm(initialState);
  }

  function handleSubmit() {
    if (!canSubmit || !form.date || !form.time) return;
    const name = form.mode === "existing" ? selectedPatient?.name ?? "" : form.name;
    const phone = form.mode === "existing" ? selectedPatient?.phone ?? "" : form.phone;
    const email = form.mode === "existing" ? selectedPatient?.email ?? "" : form.email;
    bookAppointment(
      { serviceId: form.serviceId, date: form.date, time: form.time, name, phone, email, source: "dashboard" },
      locale
    );
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <CalendarPlus className="h-4 w-4" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>Create a booking on behalf of a patient.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto py-1 pe-1 scrollbar-thin">
          {/* Patient */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Patient</Label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setForm((f) => ({ ...f, mode: "existing" }))}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  form.mode === "existing"
                    ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--ivory)]"
                    : "border-[var(--border)] text-[var(--muted-foreground)]"
                )}
              >
                <Users className="h-3.5 w-3.5" /> Existing Patient
              </button>
              <button
                onClick={() => setForm((f) => ({ ...f, mode: "new" }))}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  form.mode === "new"
                    ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--ivory)]"
                    : "border-[var(--border)] text-[var(--muted-foreground)]"
                )}
              >
                <UserPlus className="h-3.5 w-3.5" /> New Patient
              </button>
            </div>

            {form.mode === "existing" ? (
              <Select value={form.patientId} onValueChange={(v) => setForm((f) => ({ ...f, patientId: v }))}>
                <SelectTrigger className="mt-3 w-full">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} · {p.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <Label htmlFor="new-name">{t.booking.fullName}</Label>
                  <Input
                    id="new-name"
                    className="mt-1.5"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="new-phone">{t.booking.phone}</Label>
                    <Input
                      id="new-phone"
                      className="mt-1.5"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+961 3 000 000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">{t.booking.email}</Label>
                    <Input
                      id="new-email"
                      type="email"
                      className="mt-1.5"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="jane@email.com"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Service</Label>
            <Select value={form.serviceId} onValueChange={(v) => setForm((f) => ({ ...f, serviceId: v }))}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select a treatment" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Date</Label>
            <div className="mt-2">
              <DatePickerStrip value={form.date} onChange={(d) => setForm((f) => ({ ...f, date: d, time: null }))} />
            </div>
          </div>

          {/* Time */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Time</Label>
            <div className="mt-2">
              {form.date ? (
                slots.length > 0 ? (
                  <TimeSlotGrid slots={slots} value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} />
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">{t.booking.noSlots}</p>
                )
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">Choose a date first.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t.common.close}
          </Button>
          <Button variant="gold" disabled={!canSubmit} onClick={handleSubmit}>
            <CalendarPlus className="h-4 w-4" />
            Create Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
