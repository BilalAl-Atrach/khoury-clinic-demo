"use client";

import type { ServiceCategory } from "@/types";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { services } from "@/lib/data/seed";
import { SectionHeading } from "@/components/public/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ServiceCategoryPage({ category }: { category: ServiceCategory }) {
  const { t } = useLanguage();
  const isDerm = category === "dermatology";
  const title = isDerm ? t.services.dermatologyTitle : t.services.aestheticTitle;
  usePageTitle(title);

  const list = services.filter((s) => s.category === category);

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--secondary)]/50 py-16 sm:py-20">
        <div className="container-premium">
          <SectionHeading eyebrow={t.services.eyebrow} title={title} subtitle={isDerm ? t.services.dermatologyDesc : t.services.aestheticDesc} />
        </div>
      </section>

      <section className="container-premium py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      <section className="container-premium pb-20">
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--beige)] to-[var(--ivory)] px-8 py-12 text-center bg-grain">
          <h3 className="font-serif-display text-2xl font-medium">{t.services.ctaTitle}</h3>
          <Button asChild variant="gold" className="mt-6">
            <Link href="/book">{t.services.ctaButton}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
