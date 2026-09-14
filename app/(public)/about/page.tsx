"use client";

import { GraduationCap, Award, Stethoscope } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { doctor } from "@/lib/data/seed";
import { DoctorPhoto } from "@/components/visuals/photo-panel";
import { SectionHeading } from "@/components/public/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useLanguage();
  usePageTitle(t.about.title);

  return (
    <div className="container-premium py-16 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
        <DoctorPhoto className="aspect-[4/5] w-full lg:sticky lg:top-28" name={t.about.title} priority />

        <div>
          <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} subtitle={t.about.intro} />

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/60 p-5">
            <span className="font-serif-display text-3xl text-[var(--navy)]">{doctor.experienceYears}+</span>
            <div className="text-sm text-[var(--muted-foreground)]">
              <p className="font-medium text-[var(--foreground)]">{t.about.experienceLabel}</p>
              <p>{doctor.title} · {doctor.specialty}</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-[var(--navy)]">
                <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
                <h3 className="font-serif-display text-lg">{t.about.educationTitle}</h3>
              </div>
              <ul className="mt-3 space-y-2 border-s-2 border-[var(--border)] ps-4">
                {doctor.education.map((e) => (
                  <li key={e} className="text-sm text-[var(--muted-foreground)]">{e}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--navy)]">
                <Award className="h-5 w-5" strokeWidth={1.5} />
                <h3 className="font-serif-display text-lg">{t.about.certificationsTitle}</h3>
              </div>
              <ul className="mt-3 space-y-2 border-s-2 border-[var(--border)] ps-4">
                {doctor.certifications.map((c) => (
                  <li key={c} className="text-sm text-[var(--muted-foreground)]">{c}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--navy)]">
                <Stethoscope className="h-5 w-5" strokeWidth={1.5} />
                <h3 className="font-serif-display text-lg">{t.about.specialtiesTitle}</h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.specialties.map((s) => (
                  <Badge key={s} variant="muted">{s}</Badge>
                ))}
              </div>
            </div>
          </div>

          <Button asChild size="lg" variant="gold" className="mt-10">
            <Link href="/book">{t.common.bookAppointment}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
