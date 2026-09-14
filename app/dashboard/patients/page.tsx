"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { PatientCard } from "@/components/dashboard/patient-card";
import { Input } from "@/components/ui/input";

export default function PatientsPage() {
  const { t } = useLanguage();
  useDashboardHeader(t.dashboard.patientsTitle, t.dashboard.patientsSubtitle);

  const patients = useDemoStore((s) => s.patients);
  const followUps = useDemoStore((s) => s.followUps);
  const [search, setSearch] = useState("");

  const enriched = useMemo(() => {
    return patients
      .map((p) => ({
        ...p,
        nextFollowUp: followUps.find((f) => f.patientId === p.id && f.status !== "completed")?.dueDate,
      }))
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [patients, followUps, search]);

  return (
    <div className="space-y-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input placeholder="Search patients…" value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
      </div>

      {enriched.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <Users className="h-6 w-6 text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">No patients found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enriched.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
    </div>
  );
}
