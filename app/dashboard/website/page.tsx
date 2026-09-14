"use client";

import { Globe, Image as ImageIcon, MessageSquareQuote, Phone, Search, Stethoscope, Home, Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useDashboardHeader } from "@/lib/dashboard/header-context";
import { useDemoStore } from "@/lib/store/demo-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const SECTIONS = [
  { key: "homepage", icon: Home, label: "Homepage" },
  { key: "doctor", icon: Stethoscope, label: "Doctor Profile" },
  { key: "services", icon: Globe, label: "Services" },
  { key: "gallery", icon: ImageIcon, label: "Gallery" },
  { key: "testimonials", icon: MessageSquareQuote, label: "Testimonials" },
  { key: "contact", icon: Phone, label: "Contact" },
  { key: "seo", icon: Search, label: "SEO" },
  { key: "languages", icon: Languages, label: "Languages" },
];

export default function WebsitePage() {
  const { t } = useLanguage();
  useDashboardHeader(t.dashboard.websiteTitle, t.dashboard.websiteSubtitle);

  const settings = useDemoStore((s) => s.websiteSettings);
  const toggleWebsiteSetting = useDemoStore((s) => s.toggleWebsiteSetting);

  const toggles: { key: keyof typeof settings; label: string; desc: string }[] = [
    { key: "showTestimonials", label: "Show testimonials", desc: "Display patient reviews on the homepage and service pages." },
    { key: "showGallery", label: "Show gallery", desc: "Display the clinic gallery across the public website." },
    { key: "enableArabic", label: "Enable Arabic", desc: "Allow visitors to switch the site to Arabic (RTL)." },
    { key: "enableFrench", label: "Enable French", desc: "Allow visitors to switch the site to French." },
    { key: "enableOnlineBooking", label: "Enable online booking", desc: "Allow patients to book appointments directly from the website." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif-display text-lg font-medium">Sections</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SECTIONS.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy)]">
                <s.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-serif-display text-lg font-medium">Site Settings</h3>
          <Badge variant="warning">{t.common.demoDataLabel}</Badge>
        </div>
        <div className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {toggles.map((tg) => (
            <div key={tg.key} className="flex items-center justify-between gap-4 p-5">
              <div>
                <Label className="text-sm font-medium">{tg.label}</Label>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{tg.desc}</p>
              </div>
              <Switch checked={settings[tg.key]} onCheckedChange={() => toggleWebsiteSetting(tg.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
