"use client";

import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { SectionHeading } from "@/components/public/section-heading";
import { BookingFlow } from "@/components/booking/booking-flow";

export default function BookPage() {
  const { t } = useLanguage();
  usePageTitle(t.booking.title);

  return (
    <div className="container-premium py-16 sm:py-20">
      <SectionHeading title={t.booking.title} subtitle={t.booking.subtitle} align="center" className="mx-auto" />
      <div className="mt-12">
        <BookingFlow />
      </div>
    </div>
  );
}
