import type { Appointment } from "@/types";
import { addDaysISO, formatDate, formatTime } from "@/lib/utils";

export function relativeDateLabel(iso: string): string {
  if (iso === addDaysISO(0)) return "Today";
  if (iso === addDaysISO(1)) return "Tomorrow";
  return formatDate(iso);
}

export function formatAppointmentsList(appts: Appointment[]): string {
  if (appts.length === 0) return "No appointments scheduled.";
  return appts
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((a) => `${formatTime(a.time)} — ${a.patientName} — ${a.serviceName}`)
    .join("\n");
}

export const telegramResponses = {
  today(appts: Appointment[]) {
    return `Today's appointments:\n\n${formatAppointmentsList(appts)}`;
  },
  tomorrow(appts: Appointment[]) {
    return `Tomorrow's appointments:\n\n${formatAppointmentsList(appts)}`;
  },
  list(appts: Appointment[]) {
    return `Upcoming appointments:\n\n${formatAppointmentsList(appts)}`;
  },
  count(n: number, dateLabel: string) {
    return `You have ${n} appointment${n === 1 ? "" : "s"} scheduled ${dateLabel.toLowerCase()}.`;
  },
  addPreview(patientName: string, serviceName: string, date: string, time: string) {
    return `Sure. I found an available slot:\n\n${patientName}\n${serviceName}\n${relativeDateLabel(date)}\n${formatTime(time)}\n\nShould I create the appointment?`;
  },
  addSuccess() {
    return "✅ Appointment created successfully.";
  },
  reschedulePreview(patientName: string, currentDate: string, currentTime: string, newDate: string, newTime: string) {
    return `Got it. Move ${patientName}'s appointment from ${relativeDateLabel(currentDate)} ${formatTime(
      currentTime
    )} to ${relativeDateLabel(newDate)} at ${formatTime(newTime)}?`;
  },
  rescheduleSuccess() {
    return "✅ Appointment rescheduled successfully.";
  },
  cancelPreview(patientName: string, date: string, time: string) {
    return `Cancel ${patientName}'s appointment on ${relativeDateLabel(date)} at ${formatTime(time)}?`;
  },
  cancelSuccess() {
    return "✅ Appointment cancelled and the slot has been released.";
  },
  cancelled() {
    return "No problem — let me know if you need anything else.";
  },
  patientNotFound(name?: string) {
    return name
      ? `I couldn't find an upcoming appointment for "${name}". Try /appointments to see the full list.`
      : `I couldn't find that patient. Try /appointments to see the full list.`;
  },
  help() {
    return [
      "Here's what I can do:",
      "",
      "/today — today's appointments",
      "/tomorrow — tomorrow's appointments",
      "/appointments — full upcoming list",
      "/add — e.g. \"Add Sarah tomorrow at 4pm for a skin consultation\"",
      "/reschedule — e.g. \"Move Maya to Thursday at 3pm\"",
      "/cancel — e.g. \"Cancel Lina's appointment\"",
    ].join("\n");
  },
  unknown() {
    return "Sorry, I didn't quite catch that. Type /help to see what I can do.";
  },
};
