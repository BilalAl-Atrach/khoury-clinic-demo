import type {
  Appointment,
  AutomationRule,
  Clinic,
  Doctor,
  FollowUp,
  GalleryItem,
  Patient,
  Service,
  Testimonial,
} from "@/types";
import { addDaysISO } from "@/lib/utils";

export const doctor: Doctor = {
  id: "doc-nadine-khoury",
  name: "Dr. Nadine Khoury",
  title: "MD",
  specialty: "Dermatologist & Aesthetic Medicine Specialist",
  bio: "Dr. Nadine Khoury combines medical dermatology with refined aesthetic technique to help patients achieve healthy, natural-looking results. With a patient-first philosophy, she designs individualized treatment plans rooted in evidence-based care.",
  education: [
    "M.D., American University of Beirut (fictional, demo)",
    "Residency in Dermatology, Hôtel-Dieu de France (fictional, demo)",
    "Fellowship in Aesthetic Medicine, Paris (fictional, demo)",
  ],
  certifications: [
    "Board Certified Dermatologist (demo)",
    "Certified in Advanced Injectables (demo)",
    "Member, Lebanese Society of Dermatology (demo)",
  ],
  experienceYears: 12,
  specialties: [
    "Medical Dermatology",
    "Botox & Fillers",
    "Skin Rejuvenation",
    "Acne & Scar Therapy",
  ],
};

export const clinic: Clinic = {
  id: "clinic-khoury",
  name: "Khoury Dermatology & Aesthetic Clinic",
  city: "Beirut",
  country: "Lebanon",
  addressLine: "Clemenceau Street, Beirut, Lebanon",
  phone: "+961 1 234 567",
  whatsapp: "+961 76 123 456",
  email: "hello@khouryclinic.demo",
  hours: [
    { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM – 3:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  mapLabel: "Clemenceau, Beirut, Lebanon",
};

export const services: Service[] = [
  {
    id: "svc-acne",
    slug: "acne-acne-scars",
    category: "dermatology",
    name: "Acne & Acne Scars",
    shortDescription: "Targeted therapy for active acne and scar remodeling.",
    description:
      "A structured program combining medical-grade treatments to control active breakouts and progressively improve the appearance of acne scarring, tailored to your skin type.",
    benefits: [
      "Reduces active breakouts",
      "Improves skin texture over time",
      "Personalized treatment plan",
      "Minimal downtime options",
    ],
    durationMinutes: 45,
    priceFrom: 90,
    faq: [
      {
        question: "How many sessions will I need?",
        answer:
          "Most patients see visible improvement after 4–6 sessions, spaced according to your skin's response (demo answer).",
      },
      {
        question: "Is there any downtime?",
        answer: "Most patients return to normal activities the same day (demo answer).",
      },
    ],
    featured: true,
  },
  {
    id: "svc-pigmentation",
    slug: "pigmentation",
    category: "dermatology",
    name: "Pigmentation Correction",
    shortDescription: "Even out tone and reduce sun spots or melasma.",
    description:
      "A gentle, progressive approach to correcting uneven pigmentation, sun damage, and melasma using proven dermatological protocols.",
    benefits: ["Brighter, even skin tone", "Reduces dark spots", "Safe for most skin types"],
    durationMinutes: 40,
    priceFrom: 100,
    faq: [
      {
        question: "Will results be permanent?",
        answer:
          "Results are long-lasting with proper sun protection; maintenance sessions may be recommended (demo answer).",
      },
    ],
  },
  {
    id: "svc-skin-rejuv-derm",
    slug: "skin-rejuvenation",
    category: "dermatology",
    name: "Skin Rejuvenation Therapy",
    shortDescription: "Restore radiance and improve overall skin health.",
    description:
      "A medical skin rejuvenation protocol designed to improve texture, hydration, and radiance through clinically guided treatment cycles.",
    benefits: ["Improved radiance", "Smoother texture", "Boosted hydration"],
    durationMinutes: 50,
    priceFrom: 120,
    faq: [
      { question: "When will I see results?", answer: "Many patients notice a glow within days (demo answer)." },
    ],
  },
  {
    id: "svc-skin-health",
    slug: "skin-health-consultation",
    category: "dermatology",
    name: "Skin Health Consultation",
    shortDescription: "A full assessment of your skin with a personalized plan.",
    description:
      "A comprehensive consultation to assess your skin's health and build a personalized roadmap across medical and aesthetic options.",
    benefits: ["Full skin assessment", "Personalized roadmap", "No obligation plan"],
    durationMinutes: 30,
    priceFrom: 60,
    faq: [{ question: "Do I need this before other treatments?", answer: "Recommended for new patients (demo answer)." }],
    featured: true,
  },
  {
    id: "svc-hair-scalp",
    slug: "hair-scalp-treatments",
    category: "dermatology",
    name: "Hair & Scalp Treatments",
    shortDescription: "Support healthy hair growth and scalp balance.",
    description:
      "Evidence-informed treatments to support scalp health and reduce hair thinning, with a plan tailored to your goals.",
    benefits: ["Supports healthy growth", "Improves scalp condition", "Tailored programs"],
    durationMinutes: 40,
    priceFrom: 110,
    faq: [{ question: "Is this suitable for both men and women?", answer: "Yes, programs are tailored individually (demo answer)." }],
  },
  {
    id: "svc-botox",
    slug: "botox",
    category: "aesthetic-medicine",
    name: "Botox",
    shortDescription: "Smooth expression lines with a natural-looking result.",
    description:
      "Precision Botox treatment to soften fine lines and wrinkles while preserving natural facial expression.",
    benefits: ["Softens expression lines", "Quick appointment", "Natural-looking results"],
    durationMinutes: 30,
    priceFrom: 250,
    faq: [{ question: "How long do results last?", answer: "Typically 3–4 months (demo answer)." }],
    featured: true,
  },
  {
    id: "svc-fillers",
    slug: "dermal-fillers",
    category: "aesthetic-medicine",
    name: "Dermal Fillers",
    shortDescription: "Restore volume and enhance facial contours.",
    description:
      "Carefully placed dermal fillers to restore volume, refine contours, and achieve balanced, natural results.",
    benefits: ["Restores volume", "Enhances contours", "Immediate visible results"],
    durationMinutes: 45,
    priceFrom: 350,
    faq: [{ question: "Is the treatment painful?", answer: "A topical numbing cream is used for comfort (demo answer)." }],
    featured: true,
  },
  {
    id: "svc-skin-boosters",
    slug: "skin-boosters",
    category: "aesthetic-medicine",
    name: "Skin Boosters",
    shortDescription: "Deep hydration for a luminous, healthy glow.",
    description:
      "Micro-injections of hyaluronic acid to deeply hydrate skin from within, improving elasticity and glow.",
    benefits: ["Deep hydration", "Improved elasticity", "Subtle, natural glow"],
    durationMinutes: 35,
    priceFrom: 220,
    faq: [{ question: "How many sessions are recommended?", answer: "A course of 3 sessions is typical (demo answer)." }],
  },
  {
    id: "svc-facial-rejuv",
    slug: "facial-rejuvenation",
    category: "aesthetic-medicine",
    name: "Facial Rejuvenation",
    shortDescription: "A comprehensive approach to a refreshed appearance.",
    description:
      "A combination protocol addressing volume, texture, and tone for a refreshed, well-rested appearance.",
    benefits: ["Comprehensive results", "Customized combination plan", "Natural refresh"],
    durationMinutes: 60,
    priceFrom: 400,
    faq: [{ question: "Can this be combined with other treatments?", answer: "Yes, plans are fully customized (demo answer)." }],
  },
  {
    id: "svc-non-invasive",
    slug: "non-invasive-skin-treatments",
    category: "aesthetic-medicine",
    name: "Non-invasive Skin Treatments",
    shortDescription: "Gentle technology-driven treatments with no downtime.",
    description:
      "A range of non-invasive treatments using advanced technology to refresh skin with no downtime required.",
    benefits: ["No downtime", "Comfortable sessions", "Progressive visible results"],
    durationMinutes: 40,
    priceFrom: 150,
    faq: [{ question: "Can I return to work after?", answer: "Yes, immediately in most cases (demo answer)." }],
  },
];

const patientSeed: { name: string; phone: string; email: string }[] = [
  { name: "Sarah Haddad", phone: "+961 3 111 222", email: "sarah.haddad@demo.com" },
  { name: "Maya Saleh", phone: "+961 3 222 333", email: "maya.saleh@demo.com" },
  { name: "Lina Khoury", phone: "+961 3 333 444", email: "lina.khoury@demo.com" },
  { name: "Nour Farhat", phone: "+961 3 444 555", email: "nour.farhat@demo.com" },
  { name: "Emma Mansour", phone: "+961 3 555 666", email: "emma.mansour@demo.com" },
  { name: "Yara Abou Chacra", phone: "+961 3 666 777", email: "yara.abouchacra@demo.com" },
  { name: "Rania Fakhoury", phone: "+961 3 777 888", email: "rania.fakhoury@demo.com" },
  { name: "Layla Chami", phone: "+961 3 888 999", email: "layla.chami@demo.com" },
  { name: "Zeina Nassar", phone: "+961 3 999 000", email: "zeina.nassar@demo.com" },
  { name: "Christelle Aoun", phone: "+961 3 121 232", email: "christelle.aoun@demo.com" },
  { name: "Dana Rahal", phone: "+961 3 232 343", email: "dana.rahal@demo.com" },
];

export function buildPatients(): Patient[] {
  return patientSeed.map((p, i) => ({
    id: `pat-${i + 1}`,
    name: p.name,
    phone: p.phone,
    email: p.email,
    totalAppointments: 1 + (i % 4),
    communicationStatus: "opted-in",
    createdAt: addDaysISO(-(30 + i * 7)),
  }));
}

const timesSlots = ["09:00", "10:30", "11:30", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function buildAppointments(patients: Patient[]): Appointment[] {
  const offsets = [-14, -10, -7, -5, -3, -2, -1, 0, 0, 0, 1, 1, 2, 3, 4, 5, 7, 9, 12, 14, 18];
  const statuses: Appointment["status"][] = [
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
    "confirmed",
    "confirmed",
    "pending",
    "confirmed",
    "confirmed",
    "confirmed",
    "pending",
    "confirmed",
    "confirmed",
    "confirmed",
    "confirmed",
    "pending",
    "confirmed",
    "cancelled",
  ];

  return offsets.map((offset, i) => {
    const patient = patients[i % patients.length];
    const service = services[i % services.length];
    const time = timesSlots[i % timesSlots.length];
    const status = statuses[i];
    return {
      id: `apt-${i + 1}`,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      serviceId: service.id,
      serviceName: service.name,
      date: addDaysISO(offset),
      time,
      status,
      source: "website",
      createdAt: addDaysISO(offset - 3),
      history: [{ at: addDaysISO(offset - 3), action: "created", note: "Booked via website" }],
    };
  });
}

export function buildFollowUps(patients: Patient[]): FollowUp[] {
  const plan: { idx: number; lastOffset: number; dueOffset: number; treatment: string; status: FollowUp["status"] }[] = [
    { idx: 0, lastOffset: -30, dueOffset: -2, treatment: "Skin Consultation", status: "overdue" },
    { idx: 1, lastOffset: -25, dueOffset: 0, treatment: "Botox Touch-up", status: "due" },
    { idx: 2, lastOffset: -20, dueOffset: 1, treatment: "Acne Follow-up", status: "due" },
    { idx: 3, lastOffset: -18, dueOffset: 5, treatment: "Filler Review", status: "upcoming" },
    { idx: 4, lastOffset: -35, dueOffset: -5, treatment: "Pigmentation Recheck", status: "overdue" },
    { idx: 5, lastOffset: -15, dueOffset: 10, treatment: "Skin Booster Series", status: "upcoming" },
    { idx: 6, lastOffset: -28, dueOffset: 2, treatment: "Facial Rejuvenation Review", status: "due" },
    { idx: 7, lastOffset: -40, dueOffset: -10, treatment: "Hair & Scalp Recheck", status: "overdue" },
    { idx: 8, lastOffset: -12, dueOffset: 14, treatment: "Skin Health Recheck", status: "upcoming" },
    { idx: 9, lastOffset: -22, dueOffset: 3, treatment: "Non-invasive Follow-up", status: "due" },
    { idx: 10, lastOffset: -45, dueOffset: -15, treatment: "Acne Scar Review", status: "overdue" },
  ];

  return plan.map((p, i) => {
    const patient = patients[p.idx % patients.length];
    return {
      id: `fu-${i + 1}`,
      patientId: patient.id,
      patientName: patient.name,
      treatment: p.treatment,
      lastVisit: addDaysISO(p.lastOffset),
      dueDate: addDaysISO(p.dueOffset),
      status: p.status,
    };
  });
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    patientName: "Sarah H.",
    serviceId: "svc-acne",
    rating: 5,
    quote: "Dr. Khoury and her team made me feel comfortable from the first visit. My skin has never looked better. (Demo testimonial)",
    date: addDaysISO(-40),
  },
  {
    id: "t2",
    patientName: "Maya S.",
    serviceId: "svc-botox",
    rating: 5,
    quote: "Natural results and such a professional, calming experience. Booking online was effortless. (Demo testimonial)",
    date: addDaysISO(-33),
  },
  {
    id: "t3",
    patientName: "Lina K.",
    serviceId: "svc-fillers",
    rating: 5,
    quote: "The WhatsApp reminders meant I never missed an appointment. Such a well-run clinic. (Demo testimonial)",
    date: addDaysISO(-21),
  },
  {
    id: "t4",
    patientName: "Nour F.",
    serviceId: "svc-skin-rejuv-derm",
    rating: 4,
    quote: "Warm, attentive, and genuinely expert care. Highly recommend the consultation. (Demo testimonial)",
    date: addDaysISO(-15),
  },
  {
    id: "t5",
    patientName: "Emma M.",
    serviceId: "svc-skin-boosters",
    rating: 5,
    quote: "The clinic feels premium from the website to the follow-up messages. Five stars. (Demo testimonial)",
    date: addDaysISO(-8),
  },
  {
    id: "t6",
    patientName: "Yara A.",
    serviceId: "svc-pigmentation",
    rating: 5,
    quote: "My pigmentation has visibly improved. Grateful for such a thoughtful treatment plan. (Demo testimonial)",
    date: addDaysISO(-4),
  },
];

export const galleryItems: GalleryItem[] = [
  { id: "g1", category: "clinic", title: "Reception & Lounge", accent: "gold" },
  { id: "g2", category: "clinic", title: "Consultation Room", accent: "navy" },
  { id: "g3", category: "clinic", title: "Treatment Suite", accent: "beige" },
  { id: "g4", category: "skin-treatments", title: "Skin Rejuvenation Session", accent: "gold" },
  { id: "g5", category: "skin-treatments", title: "Pigmentation Therapy", accent: "navy" },
  { id: "g6", category: "aesthetic", title: "Precision Injectables", accent: "beige" },
  { id: "g7", category: "aesthetic", title: "Facial Contouring", accent: "gold" },
  { id: "g8", category: "environment", title: "Beirut Clinic Exterior", accent: "navy" },
  { id: "g9", category: "environment", title: "Private Waiting Area", accent: "beige" },
  { id: "g10", category: "aesthetic", title: "Skin Booster Application", accent: "gold" },
];

export const automationRules: AutomationRule[] = [
  {
    id: "auto-confirm",
    name: "Booking Confirmation",
    trigger: "Appointment booked",
    action: "Send WhatsApp confirmation instantly",
    enabled: true,
    timing: "Immediately",
  },
  {
    id: "auto-24h",
    name: "24-Hour Reminder",
    trigger: "24 hours before appointment",
    action: "Send WhatsApp reminder",
    enabled: true,
    timing: "24h before",
  },
  {
    id: "auto-2h",
    name: "2-Hour Reminder",
    trigger: "2 hours before appointment",
    action: "Send WhatsApp reminder",
    enabled: true,
    timing: "2h before",
  },
  {
    id: "auto-thankyou",
    name: "Post-Visit Thank You",
    trigger: "Appointment marked completed",
    action: "Send thank-you message",
    enabled: true,
    timing: "Immediately after visit",
  },
  {
    id: "auto-followup",
    name: "Follow-up Recall",
    trigger: "30 days after appointment",
    action: "Send follow-up reminder",
    enabled: true,
    timing: "30 days after",
  },
  {
    id: "auto-cancel",
    name: "Cancellation Notice",
    trigger: "Appointment cancelled",
    action: "Send cancellation confirmation & release slot",
    enabled: true,
    timing: "Immediately",
  },
];
