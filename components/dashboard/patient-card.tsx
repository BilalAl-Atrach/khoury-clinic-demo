"use client";

import { Calendar, Mail, Phone } from "lucide-react";
import type { Patient } from "@/types";
import { useLanguage } from "@/lib/i18n/context";
import { formatShortDate, initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function PatientCard({ patient }: { patient: Patient }) {
  const { locale } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarFallback>{initials(patient.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{patient.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{patient.phone}</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{patient.email}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
        <span>{patient.totalAppointments} visits</span>
        {patient.nextFollowUp && (
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatShortDate(patient.nextFollowUp, locale)}</span>
        )}
        <Badge variant={patient.communicationStatus === "opted-in" ? "success" : "muted"}>
          {patient.communicationStatus === "opted-in" ? "Opted-in" : "Opted-out"}
        </Badge>
      </div>
    </div>
  );
}
