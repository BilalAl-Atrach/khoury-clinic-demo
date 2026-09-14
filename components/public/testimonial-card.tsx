"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Testimonial } from "@/types";
import { useLanguage } from "@/lib/i18n/context";
import { initials, formatShortDate } from "@/lib/utils";

export function TestimonialCard({ testimonial, index = 0 }: { testimonial: Testimonial; index?: number }) {
  const { t, locale } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7"
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < testimonial.rating ? "h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" : "h-4 w-4 text-[var(--border)]"}
          />
        ))}
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-medium text-[var(--ivory)]">
          {initials(testimonial.patientName)}
        </div>
        <div>
          <p className="text-sm font-medium">{testimonial.patientName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {formatShortDate(testimonial.date, locale)} · {t.common.demoTestimonial}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
