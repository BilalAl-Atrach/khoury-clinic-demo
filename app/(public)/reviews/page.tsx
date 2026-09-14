"use client";

import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { testimonials } from "@/lib/data/seed";
import { SectionHeading } from "@/components/public/section-heading";
import { TestimonialCard } from "@/components/public/testimonial-card";
import { Star } from "lucide-react";

export default function ReviewsPage() {
  const { t } = useLanguage();
  usePageTitle(t.reviews.title);
  const avg = (testimonials.reduce((sum, tm) => sum + tm.rating, 0) / testimonials.length).toFixed(1);

  return (
    <div className="container-premium py-16 sm:py-20">
      <SectionHeading eyebrow={t.reviews.eyebrow} title={t.reviews.title} subtitle={t.reviews.subtitle} align="center" className="mx-auto" />

      <div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
          ))}
        </div>
        <span className="text-sm font-medium">{avg} / 5</span>
        <span className="text-sm text-[var(--muted-foreground)]">· {testimonials.length} {t.common.demoTestimonial}s</span>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((tm, i) => (
          <TestimonialCard key={tm.id} testimonial={tm} index={i} />
        ))}
      </div>
    </div>
  );
}
