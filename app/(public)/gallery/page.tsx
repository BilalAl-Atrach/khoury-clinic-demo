"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { galleryItems } from "@/lib/data/seed";
import type { GalleryItem } from "@/types";
import { SectionHeading } from "@/components/public/section-heading";
import { AbstractPanel } from "@/components/visuals/abstract-panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type FilterKey = "all" | GalleryItem["category"];

export default function GalleryPage() {
  const { t } = useLanguage();
  usePageTitle(t.gallery.title);
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = filter === "all" ? galleryItems : galleryItems.filter((g) => g.category === filter);

  return (
    <div className="container-premium py-16 sm:py-20">
      <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title} subtitle={t.gallery.subtitle} align="center" className="mx-auto" />

      <div className="mt-10 flex justify-center">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterKey)}>
          <TabsList>
            <TabsTrigger value="all">{t.gallery.all}</TabsTrigger>
            <TabsTrigger value="clinic">{t.gallery.clinic}</TabsTrigger>
            <TabsTrigger value="skin-treatments">{t.gallery.skinTreatments}</TabsTrigger>
            <TabsTrigger value="aesthetic">{t.gallery.aesthetic}</TabsTrigger>
            <TabsTrigger value="environment">{t.gallery.environment}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div layout className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((g, i) => (
          <motion.div
            key={g.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <AbstractPanel tone={g.accent as "gold" | "navy" | "beige"} label={g.title} className="aspect-square" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
