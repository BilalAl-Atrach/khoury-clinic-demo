"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { clinic } from "@/lib/data/seed";

export function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--secondary)]">
      <div className="container-premium grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)] font-serif-display text-sm text-[var(--navy)]">
              NK
            </span>
            <span className="font-serif-display text-base">{clinic.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-[var(--muted-foreground)]">{t.footer.tagline}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
            {t.footer.quickLinks}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-[var(--navy)]">{t.nav.about}</Link></li>
            <li><Link href="/services" className="hover:text-[var(--navy)]">{t.nav.services}</Link></li>
            <li><Link href="/gallery" className="hover:text-[var(--navy)]">{t.nav.gallery}</Link></li>
            <li><Link href="/reviews" className="hover:text-[var(--navy)]">{t.nav.reviews}</Link></li>
            <li><Link href="/privacy" className="hover:text-[var(--navy)]">{t.privacy.title}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
            {t.footer.contactTitle}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
              {clinic.addressLine}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
              {clinic.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[var(--gold)]" />
              {clinic.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-premium flex flex-col gap-2 py-6 text-xs text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {clinic.name}. {t.footer.rights}</p>
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
