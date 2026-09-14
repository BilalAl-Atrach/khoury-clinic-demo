"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { services, testimonials, galleryItems } from "@/lib/data/seed";
import { getServiceIcon } from "@/lib/service-icons";
import { TestimonialCard } from "@/components/public/testimonial-card";
import { AbstractPanel } from "@/components/visuals/abstract-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ServiceDetailPage() {
  const { t } = useLanguage();
  const params = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === params.slug);

  usePageTitle(service?.name ?? "Service");

  if (!service) {
    notFound();
  }

  const Icon = getServiceIcon(service.slug);
  const relatedTestimonials = testimonials.filter((tm) => tm.serviceId === service.id);
  const shownTestimonials = relatedTestimonials.length > 0 ? relatedTestimonials : testimonials.slice(0, 2);
  const relatedGallery = galleryItems.filter((g) =>
    service.category === "dermatology" ? g.category === "skin-treatments" : g.category === "aesthetic"
  );

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--secondary)]/50 py-16 sm:py-20">
        <div className="container-premium grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="outline" className="mb-4">
              {service.category === "dermatology" ? t.nav.dermatology : t.nav.aestheticMedicine}
            </Badge>
            <h1 className="font-serif-display text-3xl font-medium tracking-tight sm:text-4xl">{service.name}</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--muted-foreground)]">
              {service.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
              <span>
                {t.common.priceFrom} {t.common.currency}
                {service.priceFrom}
              </span>
              <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
              <span>
                {service.durationMinutes} {t.common.minutes}
              </span>
            </div>
            <Button asChild size="lg" variant="gold" className="mt-8">
              <Link href="/book">{t.services.ctaButton}</Link>
            </Button>
          </div>
          <AbstractPanel tone="beige" icon={Icon} label={service.name} className="aspect-[4/3] w-full" />
        </div>
      </section>

      <section className="container-premium py-16">
        <h2 className="font-serif-display text-2xl font-medium">{t.services.benefitsTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {service.benefits.map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-4">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {relatedGallery.length > 0 && (
        <section className="container-premium pb-16">
          <h2 className="font-serif-display text-2xl font-medium">{t.services.galleryTitle}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {relatedGallery.map((g) => (
              <AbstractPanel key={g.id} tone={g.accent as "gold" | "navy" | "beige"} label={g.title} className="aspect-square" />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-[var(--border)] bg-[var(--secondary)]/40 py-16">
        <div className="container-premium">
          <h2 className="font-serif-display text-2xl font-medium">{t.services.testimonialsTitle}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {shownTestimonials.map((tm, i) => (
              <TestimonialCard key={tm.id} testimonial={tm} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-premium py-16">
        <h2 className="font-serif-display text-2xl font-medium">{t.services.faqTitle}</h2>
        <Accordion type="single" collapsible className="mt-4">
          {service.faq.map((f) => (
            <AccordionItem key={f.question} value={f.question}>
              <AccordionTrigger>{f.question}</AccordionTrigger>
              <AccordionContent>{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
