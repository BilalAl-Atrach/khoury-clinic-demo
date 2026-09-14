"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { doctor, galleryItems, services, testimonials } from "@/lib/data/seed";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { TestimonialCard } from "@/components/public/testimonial-card";
import { AbstractPanel } from "@/components/visuals/abstract-panel";
import { DoctorPhoto, PhotoPanel } from "@/components/visuals/photo-panel";
import { Badge } from "@/components/ui/badge";

const WHY_ICONS = [Sparkles, CalendarCheck, MessageCircleHeart, ShieldCheck];

const GALLERY_PHOTOS: Record<string, string> = {
  g1: "/images/clinic-reception.jpg",
  g3: "/images/spa-detail.jpg",
};

export default function HomePage() {
  const { t } = useLanguage();
  const featured = services.filter((s) => s.featured).slice(0, 4);
  const why = [
    { title: t.home.why1Title, desc: t.home.why1Desc },
    { title: t.home.why2Title, desc: t.home.why2Desc },
    { title: t.home.why3Title, desc: t.home.why3Desc },
    { title: t.home.why4Title, desc: t.home.why4Desc },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-premium grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6">
              {t.home.heroEyebrow}
            </Badge>
            <h1 className="font-serif-display text-4xl font-medium leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--muted-foreground)]">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="gold">
                <Link href="/book">
                  {t.home.heroCta1}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">{t.home.heroCta2}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <DoctorPhoto className="aspect-[4/5] w-full" name={t.about.title} priority />
          </motion.div>
        </div>
      </section>

      {/* Doctor intro */}
      <section className="border-t border-[var(--border)] bg-[var(--secondary)]/50 py-20">
        <div className="container-premium grid items-center gap-12 lg:grid-cols-2">
          <PhotoPanel src="/images/clinic-reception.jpg" alt={doctor.title} label={doctor.title} className="aspect-[4/3] w-full">
            <div className="mt-2 flex items-baseline gap-2">
              <p className="font-serif-display text-3xl text-white">{doctor.experienceYears}+</p>
              <p className="text-xs uppercase tracking-wide text-white/70">{t.about.experienceSuffix}</p>
            </div>
          </PhotoPanel>
          <div>
            <SectionHeading eyebrow={t.home.doctorEyebrow} title={t.home.doctorTitle} />
            <p className="mt-5 leading-relaxed text-[var(--muted-foreground)]">{t.home.doctorBody}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {doctor.specialties.map((s) => (
                <Badge key={s} variant="muted">
                  {s}
                </Badge>
              ))}
            </ul>
            <Button asChild variant="link" className="mt-6 px-0">
              <Link href="/about">
                {t.common.learnMore} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container-premium">
          <SectionHeading eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} subtitle={t.home.servicesSubtitle} align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/services">{t.common.viewAll}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-[var(--navy)] py-20">
        <div className="container-premium">
          <SectionHeading title={t.home.whyTitle} align="center" light />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => {
              const Icon = WHY_ICONS[i];
              return (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold-light)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-serif-display text-lg text-[var(--ivory)]">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ivory)]/70">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-premium">
          <SectionHeading eyebrow={t.home.testimonialsEyebrow} title={t.home.testimonialsTitle} align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((tm, i) => (
              <TestimonialCard key={tm.id} testimonial={tm} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="border-t border-[var(--border)] bg-[var(--secondary)]/50 py-20">
        <div className="container-premium">
          <SectionHeading eyebrow={t.home.galleryEyebrow} title={t.home.galleryTitle} align="center" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {galleryItems.slice(0, 8).map((g, i) => {
              const className = i % 5 === 0 ? "aspect-square md:col-span-2 md:aspect-[2/1]" : "aspect-square";
              const photo = GALLERY_PHOTOS[g.id];
              if (photo) {
                return <PhotoPanel key={g.id} src={photo} alt={g.title} label={g.title} className={className} />;
              }
              return (
                <AbstractPanel
                  key={g.id}
                  tone={g.accent as "gold" | "navy" | "beige"}
                  label={g.title}
                  className={className}
                />
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/gallery">{t.common.viewAll}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container-premium">
          <div className="rounded-[2rem] border border-[var(--border)] bg-gradient-to-br from-[var(--beige)] to-[var(--ivory)] px-8 py-16 text-center bg-grain">
            <h2 className="font-serif-display text-3xl font-medium tracking-tight sm:text-4xl">{t.home.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--muted-foreground)]">{t.home.ctaSubtitle}</p>
            <Button asChild size="lg" variant="gold" className="mt-8">
              <Link href="/book">{t.home.ctaButton}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
