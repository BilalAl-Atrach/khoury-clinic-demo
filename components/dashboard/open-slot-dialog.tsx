"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePickerStrip } from "@/components/booking/date-picker-strip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function OpenSlotDialog() {
  const { locale } = useLanguage();
  const openSlots = useDemoStore((s) => s.openSlots);
  const publishOpenSlot = useDemoStore((s) => s.publishOpenSlot);
  const retractOpenSlot = useDemoStore((s) => s.retractOpenSlot);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sortedSlots = useMemo(
    () => [...openSlots].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [openSlots]
  );

  function handlePublish() {
    if (!date || !time) return;
    const ok = publishOpenSlot(date, time);
    if (!ok) {
      setError("That time is already taken or already open.");
      return;
    }
    setError(null);
    setTime("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setDate(null);
          setTime("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarClock className="h-4 w-4" />
          Open a Slot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Open a Slot for Booking</DialogTitle>
          <DialogDescription>
            Publish an extra time — it appears as bookable on the patient website. Once a patient picks it,
            it&rsquo;s claimed and removed automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Date</Label>
            <div className="mt-2">
              <DatePickerStrip value={date} onChange={setDate} />
            </div>
          </div>

          <div>
            <Label htmlFor="open-slot-time" className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              Time
            </Label>
            <input
              id="open-slot-time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setError(null);
              }}
              className="mt-2 flex h-11 w-40 rounded-xl border border-[var(--input)] bg-[var(--card)] px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            />
            {error && <p className="mt-1.5 text-xs text-[var(--destructive)]">{error}</p>}
          </div>

          <Button variant="gold" size="sm" disabled={!date || !time} onClick={handlePublish}>
            Publish Slot
          </Button>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-4">
          <Label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
            Currently Open ({sortedSlots.length})
          </Label>
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pe-1 scrollbar-thin">
            {sortedSlots.length === 0 && (
              <p className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted-foreground)]">
                No open slots published yet.
              </p>
            )}
            {sortedSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2"
              >
                <span className="text-sm">
                  {formatDate(slot.date, locale)} · {formatTime(slot.time)}
                </span>
                <Button variant="ghost" size="icon" onClick={() => retractOpenSlot(slot.id)} aria-label="Retract slot">
                  <Trash2 className="h-3.5 w-3.5 text-[var(--destructive)]" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
