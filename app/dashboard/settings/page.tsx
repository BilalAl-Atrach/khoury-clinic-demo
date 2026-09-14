"use client";

import { Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { t } = useLanguage();
  useDashboardHeader(t.dashboard.settingsTitle, t.dashboard.settingsSubtitle);
  const doctor = useDemoStore((s) => s.doctor);
  const clinic = useDemoStore((s) => s.clinic);

  return (
    <div className="max-w-2xl space-y-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[var(--gold)]" />
          <h3 className="font-serif-display text-lg font-medium">Doctor</h3>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Full name</Label>
            <Input defaultValue={doctor.name} className="mt-1.5" disabled />
          </div>
          <div>
            <Label>Specialty</Label>
            <Input defaultValue={doctor.specialty} className="mt-1.5" disabled />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--gold)]" />
          <h3 className="font-serif-display text-lg font-medium">Clinic</h3>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Clinic name</Label>
            <Input defaultValue={clinic.name} className="mt-1.5" disabled />
          </div>
          <div>
            <Label>City</Label>
            <Input defaultValue={`${clinic.city}, ${clinic.country}`} className="mt-1.5" disabled />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</Label>
            <Input defaultValue={clinic.phone} className="mt-1.5" disabled />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
            <Input defaultValue={clinic.email} className="mt-1.5" disabled />
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-5" disabled>
          {t.common.save}
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/50 p-5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
        <div>
          <Badge variant="warning" className="mb-2">{t.common.demoDataLabel}</Badge>
          <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">{t.common.demoDisclaimer}</p>
        </div>
      </div>
    </div>
  );
}
