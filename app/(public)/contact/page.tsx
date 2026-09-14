"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { clinic } from "@/lib/data/seed";
import { SectionHeading } from "@/components/public/section-heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AbstractPanel } from "@/components/visuals/abstract-panel";

export default function ContactPage() {
  const { t } = useLanguage();
  usePageTitle(t.contact.title);
  const [sent, setSent] = useState(false);

  return (
    <div className="container-premium py-16 sm:py-20">
      <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} subtitle={t.contact.subtitle} />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h3 className="font-serif-display text-lg font-medium">{t.contact.formTitle}</h3>
          {sent ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-[#e4ede7] p-8 text-center">
              <Check className="h-8 w-8 text-[var(--success)]" />
              <p className="text-sm font-medium text-[var(--success)]">Message sent. We&apos;ll be in touch shortly. (Demo)</p>
            </div>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div>
                <Label htmlFor="c-name">{t.contact.name}</Label>
                <Input id="c-name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="c-email">{t.contact.email}</Label>
                <Input id="c-email" type="email" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="c-message">{t.contact.message}</Label>
                <Textarea id="c-message" required className="mt-1.5" />
              </div>
              <Button type="submit" variant="gold" className="w-full">
                {t.contact.send}
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <AbstractPanel tone="navy" icon={MapPin} label={clinic.mapLabel} className="aspect-[4/3] w-full" />

          <div className="rounded-2xl border border-[var(--border)] p-6">
            <h3 className="font-serif-display text-base font-medium">{t.contact.infoTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--gold)]" /> {clinic.addressLine}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--gold)]" /> {clinic.phone}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[var(--gold)]" /> {clinic.email}</li>
            </ul>

            <h3 className="mt-6 font-serif-display text-base font-medium">{t.contact.hoursTitle}</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted-foreground)]">
              {clinic.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-[var(--gold)]" />{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="outline" size="sm"><Navigation className="h-3.5 w-3.5" />{t.common.directions}</Button>
              <Button variant="outline" size="sm"><Phone className="h-3.5 w-3.5" />{t.common.call}</Button>
              <Button variant="gold" size="sm"><MessageCircle className="h-3.5 w-3.5" />{t.common.whatsapp}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
