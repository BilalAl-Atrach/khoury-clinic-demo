import type { Patient, Service } from "@/types";
import { addDaysISO } from "@/lib/utils";

export type TelegramIntentType =
  | "add"
  | "reschedule"
  | "cancel"
  | "query-today"
  | "query-tomorrow"
  | "query-list"
  | "query-count"
  | "help"
  | "unknown";

export interface TelegramIntent {
  type: TelegramIntentType;
  patientName?: string;
  patientId?: string;
  date?: string;
  time?: string;
  serviceName?: string;
  serviceId?: string;
  raw: string;
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function resolveWeekday(word: string): string | null {
  const idx = WEEKDAYS.indexOf(word.toLowerCase());
  if (idx === -1) return null;
  const today = new Date();
  const todayIdx = today.getDay();
  let diff = idx - todayIdx;
  if (diff < 0) diff += 7;
  return addDaysISO(diff, today);
}

function resolveDate(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (/\btoday\b/.test(lower)) return addDaysISO(0);
  if (/\btomorrow\b/.test(lower)) return addDaysISO(1);
  for (const day of WEEKDAYS) {
    if (lower.includes(day)) return resolveWeekday(day) ?? undefined;
  }
  return undefined;
}

function resolveTime(text: string): string | undefined {
  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s?(am|pm)\b/i);
  if (!match) return undefined;
  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toLowerCase();
  if (period === "pm" && hour !== 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function resolvePatient(text: string, patients: Patient[]): { id?: string; name?: string } {
  const lower = text.toLowerCase();
  for (const p of patients) {
    const first = p.name.split(" ")[0].toLowerCase();
    if (lower.includes(first)) return { id: p.id, name: p.name };
  }
  return {};
}

function resolveService(text: string, services: Service[]): { id?: string; name?: string } {
  const lower = text.toLowerCase();
  let best: Service | undefined;
  let bestScore = 0;
  for (const s of services) {
    const words = s.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const score = words.filter((w) => lower.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  if (best && bestScore > 0) return { id: best.id, name: best.name };
  if (/\bconsult/.test(lower)) {
    const consult = services.find((s) => s.slug === "skin-health-consultation");
    if (consult) return { id: consult.id, name: consult.name };
  }
  return {};
}

export function parseTelegramInput(
  raw: string,
  patients: Patient[],
  services: Service[]
): TelegramIntent {
  const text = raw.trim();
  const lower = text.toLowerCase();

  if (lower === "/appointments" || lower === "appointments") {
    return { type: "query-list", raw: text };
  }
  if (lower === "/today" || lower.includes("today") && /appointments|scheduled|have/.test(lower) && !/how many/.test(lower)) {
    return { type: "query-today", raw: text };
  }
  if (lower === "/tomorrow" || (lower.includes("tomorrow") && /appointments|scheduled|have/.test(lower))) {
    return { type: "query-tomorrow", raw: text };
  }
  if (/how many/.test(lower)) {
    return { type: "query-count", date: resolveDate(text) ?? addDaysISO(0), raw: text };
  }
  if (lower.startsWith("/cancel") || lower.startsWith("cancel")) {
    const patient = resolvePatient(text, patients);
    return { type: "cancel", patientId: patient.id, patientName: patient.name, raw: text };
  }
  if (lower.startsWith("/reschedule") || lower.startsWith("move") || lower.startsWith("reschedule")) {
    const patient = resolvePatient(text, patients);
    return {
      type: "reschedule",
      patientId: patient.id,
      patientName: patient.name,
      date: resolveDate(text),
      time: resolveTime(text),
      raw: text,
    };
  }
  if (lower.startsWith("/add") || lower.startsWith("add") || lower.startsWith("book") || lower.startsWith("schedule")) {
    const patient = resolvePatient(text, patients);
    const service = resolveService(text, services);
    return {
      type: "add",
      patientId: patient.id,
      patientName: patient.name ?? extractCapitalizedName(text),
      date: resolveDate(text) ?? addDaysISO(1),
      time: resolveTime(text) ?? "10:00",
      serviceId: service.id,
      serviceName: service.name ?? "Skin Health Consultation",
      raw: text,
    };
  }
  if (lower === "/help" || lower === "help") {
    return { type: "help", raw: text };
  }

  return { type: "unknown", raw: text };
}

function extractCapitalizedName(text: string): string | undefined {
  const match = text.match(/\b[A-Z][a-z]+\b/);
  return match ? match[0] : undefined;
}
