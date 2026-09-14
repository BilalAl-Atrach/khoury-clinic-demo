"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Globe,
  LayoutDashboard,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Clock,
  TrendingDown,
  Users,
  Smartphone,
  Wand2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { clinic } from "@/lib/data/seed";

const FLOW = [
  { icon: Globe, key: "website" },
  { icon: CalendarCheck, key: "appointment1" },
  { icon: MessageCircle, key: "confirmation" },
  { icon: BellRing, key: "reminder" },
  { icon: Sparkles, key: "appointment2" },
  { icon: RotateCcw, key: "followup" },
] as const;

const FLOW_LABELS: Record<string, string> = {
  website: "Website",
  appointment1: "Appointment",
  confirmation: "WhatsApp Confirmation",
  reminder: "WhatsApp Reminder",
  appointment2: "Appointment",
  followup: "Follow-up",
};

const VALUE_ICONS = [TrendingDown, Clock, MessageCircle, Wand2, BellRing, Users];

export default function DemoLandingPage() {
  const { t } = useLanguage();
  usePageTitle(t.demoLanding.title);

  const values = [
    { title: t.demoLanding.value1Title, desc: t.demoLanding.value1Desc },
    { title: t.demoLanding.value2Title, desc: t.demoLanding.value2Desc },
    { title: t.demoLanding.value3Title, desc: t.demoLanding.value3Desc },
    { title: t.demoLanding.value4Title, desc: t.demoLanding.value4Desc },
    { title: t.demoLanding.value5Title, desc: t.demoLanding.value5Desc },
    { title: t.demoLanding.value6Title, desc: t.demoLanding.value6Desc },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="container-premium flex h-20 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)] font-serif-display text-sm text-[var(--navy)]">
            NK
          </span>
          <span className="hidden text-sm font-medium text-[var(--muted-foreground)] sm:block">{clinic.name} — Platform Demo</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="container-premium py-10 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mx-auto mb-6">{t.demoLanding.eyebrow}</Badge>
          <h1 className="font-serif-display text-4xl font-medium leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.demoLanding.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
            {t.demoLanding.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gold">
              <Link href="/">
                <Globe className="h-4 w-4" />
                {t.demoLanding.cta1}
              </Link>
            </Button>
            <Button asChild size="lg" variant="default">
              <Link href="/login">
                <LayoutDashboard className="h-4 w-4" />
                {t.demoLanding.cta2}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">
                <MessageCircle className="h-4 w-4" />
                {t.demoLanding.cta3}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Flow */}
      <section className="border-y border-[var(--border)] bg-[var(--secondary)]/50 py-16">
        <div className="container-premium">
          <h2 className="text-center font-serif-display text-2xl font-medium sm:text-3xl">{t.demoLanding.flowTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-[var(--muted-foreground)]">{t.demoLanding.flowSubtitle}</p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {FLOW.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex w-28 flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--navy)] text-[var(--ivory)]">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] font-medium leading-tight">{FLOW_LABELS[step.key]}</span>
                  </div>
                  {i < FLOW.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-[var(--gold)] rtl:rotate-180" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container-premium py-20">
        <h2 className="text-center font-serif-display text-2xl font-medium sm:text-3xl">{t.demoLanding.valueTitle}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy)]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-serif-display text-lg">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Final statement */}
      <section className="bg-[var(--navy)] py-24">
        <div className="container-premium text-center">
          <Smartphone className="mx-auto h-8 w-8 text-[var(--gold-light)]" strokeWidth={1.5} />
          <h2 className="mt-6 font-serif-display text-3xl font-medium text-[var(--ivory)] sm:text-4xl">{t.demoLanding.finalTitle}</h2>
          <p className="mt-3 font-serif-display text-2xl italic text-[var(--gold-light)] sm:text-3xl">{t.demoLanding.finalSubtitle}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gold">
              <Link href="/">{t.demoLanding.cta1}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-[var(--ivory)] hover:bg-white/10">
              <Link href="/login">{t.demoLanding.cta2}</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="container-premium py-8 text-center text-xs text-[var(--muted-foreground)]">
        {t.footer.disclaimer}
      </footer>
    </div>
  );
}
