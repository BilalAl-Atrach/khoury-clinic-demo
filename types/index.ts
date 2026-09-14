export type Locale = "en" | "ar" | "fr";

export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type ServiceCategory = "dermatology" | "aesthetic-medicine";

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  education: string[];
  certifications: string[];
  experienceYears: number;
  specialties: string[];
}

export interface Clinic {
  id: string;
  name: string;
  city: string;
  country: string;
  addressLine: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: { day: string; hours: string }[];
  mapLabel: string;
}

export interface Service {
  id: string;
  slug: string;
  category: ServiceCategory;
  name: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  durationMinutes: number;
  priceFrom: number;
  faq: { question: string; answer: string }[];
  featured?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit?: string;
  nextFollowUp?: string;
  totalAppointments: number;
  communicationStatus: "opted-in" | "opted-out";
  notes?: string;
  createdAt: string;
}

export interface OpenSlot {
  id: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm 24h
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm 24h
  status: AppointmentStatus;
  source: "website" | "telegram" | "dashboard";
  notes?: string;
  createdAt: string;
  history: { at: string; action: string; note?: string }[];
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  treatment: string;
  lastVisit: string;
  dueDate: string;
  status: "upcoming" | "due" | "overdue" | "completed";
}

export type MessageDirection = "outbound" | "inbound";
export type MessageChannel = "whatsapp" | "telegram";

export interface WhatsAppMessage {
  id: string;
  appointmentId?: string;
  patientId?: string;
  direction: MessageDirection;
  kind:
    | "confirmation"
    | "reminder-24h"
    | "reminder-2h"
    | "thank-you"
    | "follow-up"
    | "cancellation"
    | "reschedule"
    | "custom";
  text: string;
  timestamp: string;
  actions?: string[];
}

export interface TelegramMessage {
  id: string;
  from: "doctor" | "bot";
  text: string;
  timestamp: string;
  actions?: { label: string; value: string }[];
  richPayload?: {
    type: "appointment-preview" | "appointment-list" | "success";
    data: unknown;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  timing?: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  serviceId?: string;
  rating: number;
  quote: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  category: "clinic" | "skin-treatments" | "aesthetic" | "environment";
  title: string;
  accent: string;
}

export interface WebsiteSettings {
  showTestimonials: boolean;
  showGallery: boolean;
  enableArabic: boolean;
  enableFrench: boolean;
  enableOnlineBooking: boolean;
}
