"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, CalendarPlus, LayoutDashboard, PartyPopper } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatDate, formatTime, cn } from "@/lib/utils";
import { getServiceIcon } from "@/lib/service-icons";
import { downloadAppointmentIcs } from "@/lib/ics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "./step-indicator";
import { DatePickerStrip } from "./date-picker-strip";
import { TimeSlotGrid } from "./time-slot-grid";
import { WhatsAppThread } from "@/components/whatsapp/whatsapp-thread";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

type Step = 1 | 2 | 3 | 4 | 5;

export function BookingFlow({ initialServiceId }: { initialServiceId?: string }) {
  const { t, locale } = useLanguage();
  const services = useDemoStore((s) => s.services);
  const clinic = useDemoStore((s) => s.clinic);
  const doctor = useDemoStore((s) => s.doctor);
  const bookAppointment = useDemoStore((s) => s.bookAppointment);
  const cancelAppointment = useDemoStore((s) => s.cancelAppointment);
  const rescheduleAppointment = useDemoStore((s) => s.rescheduleAppointment);
  const getAvailableSlots = useDemoStore((s) => s.getAvailableSlots);
  const appointments = useDemoStore((s) => s.appointments);
  const whatsappMessages = useDemoStore((s) => s.whatsappMessages);

  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(initialServiceId ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rDate, setRDate] = useState<string | null>(null);
  const [rTime, setRTime] = useState<string | null>(null);

  const steps = [t.booking.step1, t.booking.step2, t.booking.step3, t.booking.step4, t.booking.step5];
  const service = services.find((s) => s.id === serviceId);
  // `appointments` is included so slots recompute whenever any booking changes,
  // even though getAvailableSlots itself doesn't appear to change identity.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => (date ? getAvailableSlots(date) : []), [date, getAvailableSlots, appointments]);

  const confirmedAppointment = appointments.find((a) => a.id === confirmedId);
  const confirmedThread = whatsappMessages.filter((m) => m.appointmentId === confirmedId);
  const rescheduleSlots = useMemo(
    () => (rDate ? getAvailableSlots(rDate, confirmedId ?? undefined) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rDate, getAvailableSlots, confirmedId, appointments]
  );

  function canNext() {
    if (step === 1) return !!serviceId;
    if (step === 2) return !!date;
    if (step === 3) return !!time;
    if (step === 4) return name.trim().length > 1 && phone.trim().length > 5 && /\S+@\S+\.\S+/.test(email);
    return true;
  }

  function handleConfirm() {
    if (!serviceId || !date || !time) return;
    const appt = bookAppointment({ serviceId, date, time, name, phone, email, source: "website" }, locale);
    setConfirmedId(appt.id);
  }

  function resetFlow() {
    setStep(1);
    setServiceId(null);
    setDate(null);
    setTime(null);
    setName("");
    setPhone("");
    setEmail("");
    setConfirmedId(null);
  }

  function handleWhatsAppAction(action: string) {
    if (action === "reschedule") {
      setRDate(confirmedAppointment?.date ?? null);
      setRTime(null);
      setRescheduleOpen(true);
    } else if (action === "cancel") {
      setCancelOpen(true);
    } else if (action === "calendar" && confirmedAppointment) {
      downloadAppointmentIcs({
        title: `${confirmedAppointment.serviceName} — ${clinic.name}`,
        description: `Appointment with ${doctor.name} at ${clinic.name}.`,
        location: clinic.addressLine,
        date: confirmedAppointment.date,
        time: confirmedAppointment.time,
        durationMinutes: service?.durationMinutes ?? 30,
      });
    }
  }

  if (confirmedId && confirmedAppointment) {
    return (
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center sm:p-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e4ede7] text-[var(--success)]">
            <PartyPopper className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-serif-display text-2xl font-medium sm:text-3xl">{t.booking.confirmedTitle}</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">{t.booking.confirmedSubtitle}</p>

          <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/50 p-5 text-start text-sm">
            <Row label={t.booking.selectedService} value={confirmedAppointment.serviceName} />
            <Row label={t.booking.selectedDate} value={formatDate(confirmedAppointment.date, locale)} />
            <Row label={t.booking.selectedTime} value={formatTime(confirmedAppointment.time)} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-10">
          <h3 className="text-center font-serif-display text-xl font-medium">{t.booking.automationTitle}</h3>
          <p className="mx-auto mt-1 max-w-md text-center text-sm text-[var(--muted-foreground)]">
            {t.booking.automationSubtitle}
          </p>
          <div className="mx-auto mt-6 max-w-sm">
            <WhatsAppThread messages={confirmedThread} onAction={handleWhatsAppAction} />
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={resetFlow}>
            <CalendarPlus className="h-4 w-4" />
            {t.booking.bookAnother}
          </Button>
          <Button asChild variant="gold">
            <Link href="/dashboard/appointments">
              <LayoutDashboard className="h-4 w-4" />
              {t.booking.goToDashboard}
            </Link>
          </Button>
        </div>

        {/* Reschedule dialog */}
        <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.common.reschedule}</DialogTitle>
              <DialogDescription>{t.booking.selectDatePrompt}</DialogDescription>
            </DialogHeader>
            <DatePickerStrip value={rDate} onChange={(d) => { setRDate(d); setRTime(null); }} />
            <div className="mt-4">
              {rescheduleSlots.length > 0 ? (
                <TimeSlotGrid slots={rescheduleSlots} value={rTime} onChange={setRTime} />
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">{t.booking.noSlots}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
                {t.common.close}
              </Button>
              <Button
                variant="gold"
                disabled={!rDate || !rTime}
                onClick={() => {
                  if (rDate && rTime && confirmedId) {
                    rescheduleAppointment(confirmedId, rDate, rTime, locale);
                    setRescheduleOpen(false);
                  }
                }}
              >
                {t.common.confirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel dialog */}
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>We&apos;re sorry to see you cancel</DialogTitle>
              <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelOpen(false)}>
                {t.common.close}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirmedId) cancelAppointment(confirmedId, locale);
                  setCancelOpen(false);
                }}
              >
                {t.common.cancel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator steps={steps} current={step} />

      <div className="mt-10 min-h-[320px] rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <div>
                <h2 className="font-serif-display text-lg font-medium">{t.booking.selectServicePrompt}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => {
                    const Icon = getServiceIcon(s.slug);
                    const active = serviceId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setServiceId(s.id);
                          setTimeout(() => setStep(2), 300);
                        }}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl border p-4 text-start transition-colors",
                          active ? "border-[var(--navy)] bg-[var(--secondary)]/60" : "border-[var(--border)] hover:border-[var(--navy)]/30"
                        )}
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" strokeWidth={1.5} />
                        <span>
                          <span className="block text-sm font-medium">{s.name}</span>
                          <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{s.shortDescription}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif-display text-lg font-medium">{t.booking.selectDatePrompt}</h2>
                <div className="mt-5">
                  <DatePickerStrip value={date} onChange={(d) => { setDate(d); setTime(null); }} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-serif-display text-lg font-medium">{t.booking.selectTimePrompt}</h2>
                <div className="mt-5">
                  {slots.length > 0 ? (
                    <TimeSlotGrid slots={slots} value={time} onChange={setTime} />
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)]">{t.booking.noSlots}</p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-serif-display text-lg font-medium">{t.booking.detailsPrompt}</h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <Label htmlFor="name">{t.booking.fullName}</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="Sarah Haddad" />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.booking.phone}</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" placeholder="+961 3 111 222" />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.booking.email}</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" placeholder="you@email.com" />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && service && date && time && (
              <div>
                <h2 className="font-serif-display text-lg font-medium">{t.booking.reviewTitle}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t.booking.reviewSubtitle}</p>
                <div className="mt-5 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/40 p-5 text-sm">
                  <Row label={t.booking.selectedService} value={service.name} />
                  <Row label={t.booking.selectedDate} value={formatDate(date, locale)} />
                  <Row label={t.booking.selectedTime} value={formatTime(time)} />
                  <Row label={t.booking.fullName} value={name} />
                  <Row label={t.booking.phone} value={phone} />
                  <Row label={t.booking.email} value={email} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))} disabled={step === 1}>
          {t.common.back}
        </Button>
        {step < 5 ? (
          <Button variant="default" onClick={() => setStep((s) => ((s + 1) as Step))} disabled={!canNext()}>
            {t.common.next}
          </Button>
        ) : (
          <Button variant="gold" onClick={handleConfirm}>
            <CalendarCheck className="h-4 w-4" />
            {t.booking.confirmBooking}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
