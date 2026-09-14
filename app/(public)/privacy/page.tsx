"use client";

import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";

export default function PrivacyPage() {
  const { t } = useLanguage();
  usePageTitle(t.privacy.title);

  return (
    <div className="container-premium max-w-2xl py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy)]">
        <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h1 className="mt-5 font-serif-display text-3xl font-medium">{t.privacy.title}</h1>
      <p className="mt-5 leading-relaxed text-[var(--muted-foreground)]">{t.privacy.body}</p>
    </div>
  );
}
