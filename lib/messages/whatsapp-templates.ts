import type { Locale } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface MessageCtx {
  patientFirstName: string;
  doctorName: string;
  clinicName: string;
  date: string;
  time: string;
  locale?: Locale;
}

function firstName(fullName: string) {
  return fullName.split(" ")[0];
}

export const whatsappTemplates = {
  confirmation(ctx: MessageCtx) {
    const dateLabel = formatDate(ctx.date, ctx.locale);
    const timeLabel = formatTime(ctx.time);
    const en = `Hello ${firstName(ctx.patientFirstName)} 👋\n\nYour appointment with ${ctx.doctorName} is confirmed.\n\n📅 ${dateLabel}\n🕓 ${timeLabel}\n📍 ${ctx.clinicName}\n\nWe look forward to seeing you.`;
    const ar = `مرحبًا ${firstName(ctx.patientFirstName)} 👋\n\nتم تأكيد موعدك مع ${ctx.doctorName}.\n\n📅 ${dateLabel}\n🕓 ${timeLabel}\n📍 ${ctx.clinicName}\n\nنتطلع لرؤيتك.`;
    const fr = `Bonjour ${firstName(ctx.patientFirstName)} 👋\n\nVotre rendez-vous avec ${ctx.doctorName} est confirmé.\n\n📅 ${dateLabel}\n🕓 ${timeLabel}\n📍 ${ctx.clinicName}\n\nAu plaisir de vous accueillir.`;
    return pick(ctx.locale, en, ar, fr);
  },
  reminder24h(ctx: MessageCtx) {
    const timeLabel = formatTime(ctx.time);
    const en = `Reminder ⏰\n\nYou have an appointment with ${ctx.doctorName} tomorrow at ${timeLabel}.\n\nSee you soon at ${ctx.clinicName}!`;
    const ar = `تذكير ⏰\n\nلديك موعد مع ${ctx.doctorName} غدًا الساعة ${timeLabel}.\n\nنراك قريبًا في ${ctx.clinicName}!`;
    const fr = `Rappel ⏰\n\nVous avez rendez-vous avec ${ctx.doctorName} demain à ${timeLabel}.\n\nÀ bientôt à ${ctx.clinicName} !`;
    return pick(ctx.locale, en, ar, fr);
  },
  reminder2h(ctx: MessageCtx) {
    const timeLabel = formatTime(ctx.time);
    const en = `Your appointment is today at ${timeLabel}.\n\nWe're looking forward to seeing you shortly at ${ctx.clinicName}.`;
    const ar = `موعدك اليوم الساعة ${timeLabel}.\n\nنتطلع لرؤيتك قريبًا في ${ctx.clinicName}.`;
    const fr = `Votre rendez-vous est aujourd'hui à ${timeLabel}.\n\nNous avons hâte de vous accueillir à ${ctx.clinicName}.`;
    return pick(ctx.locale, en, ar, fr);
  },
  thankYou(ctx: MessageCtx) {
    const en = `Thank you for visiting ${ctx.clinicName} today 🌿\n\nIf you have any questions about your treatment, feel free to reach out anytime.`;
    const ar = `شكرًا لزيارتك ${ctx.clinicName} اليوم 🌿\n\nإذا كان لديك أي استفسار عن علاجك، لا تتردد بالتواصل معنا في أي وقت.`;
    const fr = `Merci de votre visite à ${ctx.clinicName} aujourd'hui 🌿\n\nSi vous avez des questions sur votre traitement, n'hésitez pas à nous contacter.`;
    return pick(ctx.locale, en, ar, fr);
  },
  followUp(ctx: MessageCtx) {
    const en = `Hi ${firstName(ctx.patientFirstName)} 👋\n\nIt's time to schedule your follow-up appointment with ${ctx.doctorName}. Reply here or tap below to book.`;
    const ar = `مرحبًا ${firstName(ctx.patientFirstName)} 👋\n\nحان وقت حجز موعد المتابعة مع ${ctx.doctorName}. الرجاء الرد هنا أو اضغط أدناه للحجز.`;
    const fr = `Bonjour ${firstName(ctx.patientFirstName)} 👋\n\nIl est temps de programmer votre rendez-vous de suivi avec ${ctx.doctorName}. Répondez ici ou appuyez ci-dessous pour réserver.`;
    return pick(ctx.locale, en, ar, fr);
  },
  cancellation(ctx: MessageCtx) {
    const dateLabel = formatDate(ctx.date, ctx.locale);
    const timeLabel = formatTime(ctx.time);
    const en = `Your appointment on ${dateLabel} at ${timeLabel} has been cancelled.\n\nWe hope to see you again soon — just tap below to rebook anytime.`;
    const ar = `تم إلغاء موعدك في ${dateLabel} الساعة ${timeLabel}.\n\nنأمل رؤيتك قريبًا — اضغط أدناه لإعادة الحجز في أي وقت.`;
    const fr = `Votre rendez-vous du ${dateLabel} à ${timeLabel} a été annulé.\n\nNous espérons vous revoir bientôt — appuyez ci-dessous pour réserver à nouveau.`;
    return pick(ctx.locale, en, ar, fr);
  },
  reschedule(ctx: MessageCtx) {
    const dateLabel = formatDate(ctx.date, ctx.locale);
    const timeLabel = formatTime(ctx.time);
    const en = `Your appointment has been successfully rescheduled to ${dateLabel} at ${timeLabel}.\n\nSee you then!`;
    const ar = `تمت إعادة جدولة موعدك بنجاح إلى ${dateLabel} الساعة ${timeLabel}.\n\nنراك حينها!`;
    const fr = `Votre rendez-vous a été reprogrammé avec succès au ${dateLabel} à ${timeLabel}.\n\nÀ bientôt !`;
    return pick(ctx.locale, en, ar, fr);
  },
};

function pick(locale: Locale | undefined, en: string, ar: string, fr: string) {
  if (locale === "ar") return ar;
  if (locale === "fr") return fr;
  return en;
}
