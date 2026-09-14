import type { Locale } from "@/types";
import type { Dictionary } from "./types";
import { en } from "./en";
import { ar } from "./ar";
import { fr } from "./fr";

export const dictionaries: Record<Locale, Dictionary> = { en, ar, fr };

export const localeMeta: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  en: { label: "EN", dir: "ltr" },
  ar: { label: "AR", dir: "rtl" },
  fr: { label: "FR", dir: "ltr" },
};

export type { Dictionary };
