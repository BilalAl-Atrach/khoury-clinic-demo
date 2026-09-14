"use client";

import { create } from "zustand";
import type {
  Appointment,
  FollowUp,
  Locale,
  OpenSlot,
  Patient,
  WebsiteSettings,
  WhatsAppMessage,
  TelegramMessage,
} from "@/types";
import {
  automationRules as seedAutomationRules,
  buildAppointments,
  buildFollowUps,
  buildPatients,
  clinic,
  doctor,
  galleryItems,
  services,
  testimonials,
} from "@/lib/data/seed";
import { addDaysISO } from "@/lib/utils";
import { whatsappTemplates } from "@/lib/messages/whatsapp-templates";
import { parseTelegramInput, type TelegramIntent } from "@/lib/telegram/parser";
import { telegramResponses } from "@/lib/telegram/responses";

export const TIME_SLOTS = ["09:00", "10:00", "11:00", "11:30", "13:00", "14:00", "15:00", "16:00", "17:00"];

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

interface BookAppointmentInput {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  source?: Appointment["source"];
}

interface DemoState {
  doctor: typeof doctor;
  clinic: typeof clinic;
  services: typeof services;
  patients: Patient[];
  appointments: Appointment[];
  followUps: FollowUp[];
  testimonials: typeof testimonials;
  galleryItems: typeof galleryItems;
  automationRules: typeof seedAutomationRules;
  websiteSettings: WebsiteSettings;
  whatsappMessages: WhatsAppMessage[];
  telegramMessages: TelegramMessage[];
  telegramPending: { intent: TelegramIntent } | null;
  isAuthenticated: boolean;
  lastBookedAppointmentId: string | null;
  openSlots: OpenSlot[];

  getAvailableSlots: (date: string, excludeAppointmentId?: string) => string[];
  publishOpenSlot: (date: string, time: string) => boolean;
  retractOpenSlot: (id: string) => void;
  bookAppointment: (input: BookAppointmentInput, locale?: Locale) => Appointment;
  confirmAppointment: (id: string, locale?: Locale) => void;
  cancelAppointment: (id: string, locale?: Locale) => void;
  rescheduleAppointment: (id: string, date: string, time: string, locale?: Locale) => void;
  completeAppointment: (id: string, locale?: Locale) => void;
  sendWhatsApp: (appointmentId: string, kind: WhatsAppMessage["kind"], locale?: Locale) => void;

  markFollowUpCompleted: (id: string) => void;
  sendFollowUpWhatsApp: (id: string, locale?: Locale) => void;

  toggleWebsiteSetting: (key: keyof WebsiteSettings) => void;

  login: (email: string, password: string) => boolean;
  logout: () => void;

  telegramSend: (text: string) => void;
  telegramConfirmPending: (locale?: Locale) => void;
  telegramCancelPending: () => void;
}

function consumeOpenSlot(openSlots: OpenSlot[], date: string, time: string): OpenSlot[] {
  return openSlots.filter((s) => !(s.date === date && s.time === time));
}

function findOrCreatePatient(patients: Patient[], name: string, phone: string, email: string) {
  const existing = patients.find(
    (p) => p.phone === phone || p.email.toLowerCase() === email.toLowerCase() || p.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) return { patient: existing, patients };
  const created: Patient = {
    id: uid("pat"),
    name,
    phone,
    email,
    totalAppointments: 0,
    communicationStatus: "opted-in",
    createdAt: nowIso(),
  };
  return { patient: created, patients: [created, ...patients] };
}

function pushMessage(
  messages: WhatsAppMessage[],
  kind: WhatsAppMessage["kind"],
  text: string,
  appointmentId: string,
  patientId?: string,
  actions?: string[]
): WhatsAppMessage[] {
  const msg: WhatsAppMessage = {
    id: uid("wa"),
    appointmentId,
    patientId,
    direction: "outbound",
    kind,
    text,
    timestamp: nowIso(),
    actions,
  };
  return [...messages, msg];
}

function pushTelegramMessage(
  messages: TelegramMessage[],
  from: TelegramMessage["from"],
  text: string,
  actions?: TelegramMessage["actions"],
  richPayload?: TelegramMessage["richPayload"]
): TelegramMessage[] {
  const msg: TelegramMessage = {
    id: uid("tg"),
    from,
    text,
    timestamp: nowIso(),
    actions,
    richPayload,
  };
  return [...messages, msg];
}

const initialPatients = buildPatients();
const initialAppointments = buildAppointments(initialPatients);
const initialFollowUps = buildFollowUps(initialPatients);

export const useDemoStore = create<DemoState>((set, get) => ({
  doctor,
  clinic,
  services,
  patients: initialPatients,
  appointments: initialAppointments,
  followUps: initialFollowUps,
  testimonials,
  galleryItems,
  automationRules: seedAutomationRules,
  websiteSettings: {
    showTestimonials: true,
    showGallery: true,
    enableArabic: true,
    enableFrench: true,
    enableOnlineBooking: true,
  },
  whatsappMessages: [],
  telegramMessages: [
    {
      id: uid("tg"),
      from: "bot",
      text: "Khoury Clinic Assistant is ready. Try /today, /tomorrow, or tell me things like \"Add Sarah tomorrow at 4pm for a skin consultation.\"",
      timestamp: nowIso(),
    },
  ],
  telegramPending: null,
  isAuthenticated: false,
  lastBookedAppointmentId: null,
  openSlots: [],

  getAvailableSlots(date, excludeAppointmentId) {
    const state = get();
    const taken = state.appointments
      .filter((a) => a.date === date && a.status !== "cancelled" && a.id !== excludeAppointmentId)
      .map((a) => a.time);
    const openTimes = state.openSlots.filter((s) => s.date === date).map((s) => s.time);
    const allTimes = Array.from(new Set([...TIME_SLOTS, ...openTimes]));
    return allTimes.filter((t) => !taken.includes(t)).sort();
  },

  publishOpenSlot(date, time) {
    const state = get();
    const alreadyTaken = state.appointments.some(
      (a) => a.date === date && a.time === time && a.status !== "cancelled"
    );
    const alreadyOpen = state.openSlots.some((s) => s.date === date && s.time === time);
    if (alreadyTaken || alreadyOpen) return false;
    const slot: OpenSlot = { id: uid("slot"), date, time, createdAt: nowIso() };
    set({ openSlots: [slot, ...state.openSlots] });
    return true;
  },

  retractOpenSlot(id) {
    set((state) => ({ openSlots: state.openSlots.filter((s) => s.id !== id) }));
  },

  bookAppointment(input, locale) {
    const state = get();
    const { patient, patients } = findOrCreatePatient(state.patients, input.name, input.phone, input.email);
    const service = state.services.find((s) => s.id === input.serviceId);
    const appointment: Appointment = {
      id: uid("apt"),
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      serviceId: input.serviceId,
      serviceName: service?.name ?? "Consultation",
      date: input.date,
      time: input.time,
      status: "confirmed",
      source: input.source ?? "website",
      createdAt: nowIso(),
      history: [{ at: nowIso(), action: "created", note: `Booked via ${input.source ?? "website"}` }],
    };
    const text = whatsappTemplates.confirmation({
      patientFirstName: patient.name,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date: appointment.date,
      time: appointment.time,
      locale,
    });
    set({
      patients: patients.map((p) => (p.id === patient.id ? { ...p, totalAppointments: p.totalAppointments + 1 } : p)),
      appointments: [appointment, ...state.appointments],
      whatsappMessages: pushMessage(state.whatsappMessages, "confirmation", text, appointment.id, patient.id, [
        "reschedule",
        "cancel",
        "calendar",
      ]),
      lastBookedAppointmentId: appointment.id,
      openSlots: consumeOpenSlot(state.openSlots, input.date, input.time),
    });
    return appointment;
  },

  confirmAppointment(id, locale) {
    const state = get();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) return;
    const text = whatsappTemplates.confirmation({
      patientFirstName: appt.patientName,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date: appt.date,
      time: appt.time,
      locale,
    });
    set({
      appointments: state.appointments.map((a) =>
        a.id === id
          ? { ...a, status: "confirmed", history: [...a.history, { at: nowIso(), action: "confirmed" }] }
          : a
      ),
      whatsappMessages: pushMessage(state.whatsappMessages, "confirmation", text, id, appt.patientId),
    });
  },

  cancelAppointment(id, locale) {
    const state = get();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) return;
    const text = whatsappTemplates.cancellation({
      patientFirstName: appt.patientName,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date: appt.date,
      time: appt.time,
      locale,
    });
    set({
      appointments: state.appointments.map((a) =>
        a.id === id
          ? { ...a, status: "cancelled", history: [...a.history, { at: nowIso(), action: "cancelled" }] }
          : a
      ),
      whatsappMessages: pushMessage(state.whatsappMessages, "cancellation", text, id, appt.patientId),
    });
  },

  rescheduleAppointment(id, date, time, locale) {
    const state = get();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) return;
    const text = whatsappTemplates.reschedule({
      patientFirstName: appt.patientName,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date,
      time,
      locale,
    });
    set({
      appointments: state.appointments.map((a) =>
        a.id === id
          ? {
              ...a,
              date,
              time,
              status: "rescheduled",
              history: [...a.history, { at: nowIso(), action: "rescheduled", note: `${date} ${time}` }],
            }
          : a
      ),
      whatsappMessages: pushMessage(state.whatsappMessages, "reschedule", text, id, appt.patientId),
      openSlots: consumeOpenSlot(state.openSlots, date, time),
    });
  },

  completeAppointment(id, locale) {
    const state = get();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) return;
    const text = whatsappTemplates.thankYou({
      patientFirstName: appt.patientName,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date: appt.date,
      time: appt.time,
      locale,
    });
    const hasFollowUp = state.followUps.some((f) => f.patientId === appt.patientId && f.status !== "completed");
    const newFollowUp: FollowUp | null = hasFollowUp
      ? null
      : {
          id: uid("fu"),
          patientId: appt.patientId,
          patientName: appt.patientName,
          treatment: appt.serviceName,
          lastVisit: appt.date,
          dueDate: addDaysISO(30, new Date(appt.date)),
          status: "upcoming",
        };
    set({
      appointments: state.appointments.map((a) =>
        a.id === id
          ? { ...a, status: "completed", history: [...a.history, { at: nowIso(), action: "completed" }] }
          : a
      ),
      whatsappMessages: pushMessage(state.whatsappMessages, "thank-you", text, id, appt.patientId),
      followUps: newFollowUp ? [newFollowUp, ...state.followUps] : state.followUps,
    });
  },

  sendWhatsApp(appointmentId, kind, locale) {
    const state = get();
    const appt = state.appointments.find((a) => a.id === appointmentId);
    if (!appt) return;
    const ctx = {
      patientFirstName: appt.patientName,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date: appt.date,
      time: appt.time,
      locale,
    };
    const map: Record<string, string> = {
      confirmation: whatsappTemplates.confirmation(ctx),
      "reminder-24h": whatsappTemplates.reminder24h(ctx),
      "reminder-2h": whatsappTemplates.reminder2h(ctx),
      "thank-you": whatsappTemplates.thankYou(ctx),
      "follow-up": whatsappTemplates.followUp(ctx),
      cancellation: whatsappTemplates.cancellation(ctx),
      reschedule: whatsappTemplates.reschedule(ctx),
    };
    const text = map[kind] ?? whatsappTemplates.confirmation(ctx);
    set({
      whatsappMessages: pushMessage(state.whatsappMessages, kind, text, appointmentId, appt.patientId),
    });
  },

  markFollowUpCompleted(id) {
    set((state) => ({
      followUps: state.followUps.map((f) => (f.id === id ? { ...f, status: "completed" } : f)),
    }));
  },

  sendFollowUpWhatsApp(id, locale) {
    const state = get();
    const fu = state.followUps.find((f) => f.id === id);
    if (!fu) return;
    const text = whatsappTemplates.followUp({
      patientFirstName: fu.patientName,
      doctorName: state.doctor.name,
      clinicName: state.clinic.name,
      date: fu.dueDate,
      time: "10:00",
      locale,
    });
    set({
      whatsappMessages: pushMessage(state.whatsappMessages, "follow-up", text, fu.id, fu.patientId),
    });
  },

  toggleWebsiteSetting(key) {
    set((state) => ({
      websiteSettings: { ...state.websiteSettings, [key]: !state.websiteSettings[key] },
    }));
  },

  login(email, password) {
    const ok = email.trim().toLowerCase() === "demo@khouryclinic.com" && password === "demo123";
    if (ok) set({ isAuthenticated: true });
    return ok;
  },

  logout() {
    set({ isAuthenticated: false });
  },

  telegramSend(text) {
    const state = get();
    const doctorMsg = pushTelegramMessage(state.telegramMessages, "doctor", text);
    const intent = parseTelegramInput(text, state.patients, state.services);
    const upcoming = state.appointments.filter((a) => a.status !== "cancelled" && a.status !== "completed");

    switch (intent.type) {
      case "query-today": {
        const list = upcoming.filter((a) => a.date === addDaysISO(0));
        set({ telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.today(list)) });
        return;
      }
      case "query-tomorrow": {
        const list = upcoming.filter((a) => a.date === addDaysISO(1));
        set({ telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.tomorrow(list)) });
        return;
      }
      case "query-list": {
        const list = upcoming.filter((a) => a.date >= addDaysISO(0)).sort((a, b) => a.date.localeCompare(b.date));
        set({ telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.list(list)) });
        return;
      }
      case "query-count": {
        const date = intent.date ?? addDaysISO(0);
        const list = upcoming.filter((a) => a.date === date);
        const label = date === addDaysISO(0) ? "today" : date === addDaysISO(1) ? "tomorrow" : date;
        set({ telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.count(list.length, label)) });
        return;
      }
      case "help": {
        set({ telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.help()) });
        return;
      }
      case "add": {
        const date = intent.date ?? addDaysISO(1);
        const time = intent.time ?? "10:00";
        const serviceName = intent.serviceName ?? "Skin Health Consultation";
        const patientName = intent.patientName ?? "New Patient";
        const preview = telegramResponses.addPreview(patientName, serviceName, date, time);
        set({
          telegramMessages: pushTelegramMessage(
            doctorMsg,
            "bot",
            preview,
            [
              { label: "Confirm", value: "confirm" },
              { label: "Cancel", value: "cancel" },
            ],
            { type: "appointment-preview", data: { patientName, serviceName, date, time } }
          ),
          telegramPending: { intent: { ...intent, date, time, serviceName, patientName } },
        });
        return;
      }
      case "reschedule": {
        if (!intent.patientId) {
          set({
            telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.patientNotFound(intent.patientName)),
          });
          return;
        }
        const target = upcoming
          .filter((a) => a.patientId === intent.patientId)
          .sort((a, b) => a.date.localeCompare(b.date))[0];
        if (!target) {
          set({
            telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.patientNotFound(intent.patientName)),
          });
          return;
        }
        const newDate = intent.date ?? target.date;
        const newTime = intent.time ?? target.time;
        const preview = telegramResponses.reschedulePreview(
          target.patientName,
          target.date,
          target.time,
          newDate,
          newTime
        );
        set({
          telegramMessages: pushTelegramMessage(
            doctorMsg,
            "bot",
            preview,
            [
              { label: "Confirm", value: "confirm" },
              { label: "Cancel", value: "cancel" },
            ]
          ),
          telegramPending: {
            intent: { ...intent, patientId: target.patientId, date: newDate, time: newTime, raw: `reschedule:${target.id}` },
          },
        });
        return;
      }
      case "cancel": {
        if (!intent.patientId) {
          set({
            telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.patientNotFound(intent.patientName)),
          });
          return;
        }
        const target = upcoming
          .filter((a) => a.patientId === intent.patientId)
          .sort((a, b) => a.date.localeCompare(b.date))[0];
        if (!target) {
          set({
            telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.patientNotFound(intent.patientName)),
          });
          return;
        }
        const preview = telegramResponses.cancelPreview(target.patientName, target.date, target.time);
        set({
          telegramMessages: pushTelegramMessage(
            doctorMsg,
            "bot",
            preview,
            [
              { label: "Confirm", value: "confirm" },
              { label: "Cancel", value: "cancel" },
            ]
          ),
          telegramPending: { intent: { ...intent, patientId: target.patientId, raw: `cancel:${target.id}` } },
        });
        return;
      }
      default: {
        set({ telegramMessages: pushTelegramMessage(doctorMsg, "bot", telegramResponses.unknown()) });
      }
    }
  },

  telegramConfirmPending(locale) {
    const state = get();
    const pending = state.telegramPending;
    if (!pending) return;
    const { intent } = pending;

    if (intent.type === "add") {
      let patients = state.patients;
      let patientId = intent.patientId;
      let patientName = intent.patientName ?? "New Patient";
      if (!patientId) {
        const created: Patient = {
          id: uid("pat"),
          name: patientName,
          phone: "+961 3 000 000",
          email: `${patientName.toLowerCase().replace(/\s+/g, ".")}@demo.com`,
          totalAppointments: 0,
          communicationStatus: "opted-in",
          createdAt: nowIso(),
        };
        patients = [created, ...patients];
        patientId = created.id;
      } else {
        const existing = patients.find((p) => p.id === patientId);
        if (existing) patientName = existing.name;
      }
      const service = state.services.find((s) => s.id === intent.serviceId) ?? state.services.find((s) => s.name === intent.serviceName);
      const appointment: Appointment = {
        id: uid("apt"),
        patientId,
        patientName,
        patientPhone: patients.find((p) => p.id === patientId)?.phone ?? "",
        serviceId: service?.id ?? "svc-skin-health",
        serviceName: service?.name ?? intent.serviceName ?? "Skin Health Consultation",
        date: intent.date ?? addDaysISO(1),
        time: intent.time ?? "10:00",
        status: "confirmed",
        source: "telegram",
        createdAt: nowIso(),
        history: [{ at: nowIso(), action: "created", note: "Booked via Telegram" }],
      };
      const waText = whatsappTemplates.confirmation({
        patientFirstName: patientName,
        doctorName: state.doctor.name,
        clinicName: state.clinic.name,
        date: appointment.date,
        time: appointment.time,
        locale,
      });
      set({
        patients: patients.map((p) => (p.id === patientId ? { ...p, totalAppointments: p.totalAppointments + 1 } : p)),
        appointments: [appointment, ...state.appointments],
        whatsappMessages: pushMessage(state.whatsappMessages, "confirmation", waText, appointment.id, patientId),
        telegramMessages: pushTelegramMessage(
          state.telegramMessages,
          "bot",
          telegramResponses.addSuccess(),
          undefined,
          { type: "success", data: appointment }
        ),
        telegramPending: null,
        openSlots: consumeOpenSlot(state.openSlots, appointment.date, appointment.time),
      });
      return;
    }

    if (intent.type === "reschedule" && intent.raw.startsWith("reschedule:")) {
      const apptId = intent.raw.split(":")[1];
      const appt = state.appointments.find((a) => a.id === apptId);
      if (!appt) {
        set({ telegramPending: null });
        return;
      }
      const date = intent.date ?? appt.date;
      const time = intent.time ?? appt.time;
      const waText = whatsappTemplates.reschedule({
        patientFirstName: appt.patientName,
        doctorName: state.doctor.name,
        clinicName: state.clinic.name,
        date,
        time,
        locale,
      });
      set({
        appointments: state.appointments.map((a) =>
          a.id === apptId
            ? { ...a, date, time, status: "rescheduled", history: [...a.history, { at: nowIso(), action: "rescheduled", note: "via Telegram" }] }
            : a
        ),
        whatsappMessages: pushMessage(state.whatsappMessages, "reschedule", waText, apptId, appt.patientId),
        telegramMessages: pushTelegramMessage(state.telegramMessages, "bot", telegramResponses.rescheduleSuccess()),
        telegramPending: null,
        openSlots: consumeOpenSlot(state.openSlots, date, time),
      });
      return;
    }

    if (intent.type === "cancel" && intent.raw.startsWith("cancel:")) {
      const apptId = intent.raw.split(":")[1];
      const appt = state.appointments.find((a) => a.id === apptId);
      if (!appt) {
        set({ telegramPending: null });
        return;
      }
      const waText = whatsappTemplates.cancellation({
        patientFirstName: appt.patientName,
        doctorName: state.doctor.name,
        clinicName: state.clinic.name,
        date: appt.date,
        time: appt.time,
        locale,
      });
      set({
        appointments: state.appointments.map((a) =>
          a.id === apptId
            ? { ...a, status: "cancelled", history: [...a.history, { at: nowIso(), action: "cancelled", note: "via Telegram" }] }
            : a
        ),
        whatsappMessages: pushMessage(state.whatsappMessages, "cancellation", waText, apptId, appt.patientId),
        telegramMessages: pushTelegramMessage(state.telegramMessages, "bot", telegramResponses.cancelSuccess()),
        telegramPending: null,
      });
      return;
    }

    set({ telegramPending: null });
  },

  telegramCancelPending() {
    const state = get();
    set({
      telegramMessages: pushTelegramMessage(state.telegramMessages, "bot", telegramResponses.cancelled()),
      telegramPending: null,
    });
  },
}));
