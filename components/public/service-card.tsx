"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Service } from "@/types";
import { getServiceIcon } from "@/lib/service-icons";
import { useLanguage } from "@/lib/i18n/context";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const { t } = useLanguage();
  const Icon = getServiceIcon(service.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy)] transition-colors group-hover:bg-[var(--gold-light)]">
          {/* Icon is a stable, module-level lucide-react reference from a lookup map, not created during render */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h3 className="mt-5 font-serif-display text-lg font-medium">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{service.shortDescription}</p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">
            {t.common.priceFrom} {t.common.currency}
            {service.priceFrom}
          </span>
          <span className="flex items-center gap-1 font-medium text-[var(--navy)]">
            {t.common.learnMore}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
