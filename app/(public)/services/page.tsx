"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { services } from "@/lib/data/seed";
import { SectionHeading } from "@/components/public/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { AbstractPanel } from "@/components/visuals/abstract-panel";
import { ArrowUpRight } from "lucide-react";

export default function ServicesPage() {
  const { t } = useLanguage();
  usePageTitle(t.services.title);
  const derm = services.filter((s) => s.category === "dermatology");
  const aesthetic = services.filter((s) => s.category === "aesthetic-medicine");

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--secondary)]/50 py-16 sm:py-20">
        <div className="container-premium">
          <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} subtitle={t.services.subtitle} />
        </div>
      </section>

      <section className="container-premium py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/services/dermatology"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)]"
          >
            <AbstractPanel tone="navy" className="aspect-[16/10] w-full" />
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <h3 className="font-serif-display text-2xl text-[var(--ivory)]">{t.services.dermatologyTitle}</h3>
              <p className="mt-1 text-sm text-[var(--ivory)]/70">{t.services.dermatologyDesc}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--gold-light)]">
                {t.services.exploreServices}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
          <Link
            href="/services/aesthetic-medicine"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)]"
          >
            <AbstractPanel tone="gold" className="aspect-[16/10] w-full" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent p-7">
              <h3 className="font-serif-display text-2xl text-white">{t.services.aestheticTitle}</h3>
              <p className="mt-1 text-sm text-white/80">{t.services.aestheticDesc}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-medium text-white">
                {t.services.exploreServices}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="container-premium pb-20">
        <h3 className="font-serif-display text-xl">{t.services.dermatologyTitle}</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {derm.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>

        <h3 className="mt-16 font-serif-display text-xl">{t.services.aestheticTitle}</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aesthetic.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
