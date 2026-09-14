import {
  Sparkles,
  Droplets,
  Sun,
  ClipboardList,
  Scissors,
  Syringe,
  Gem,
  Waves,
  Wand2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  "acne-acne-scars": Sparkles,
  pigmentation: Sun,
  "skin-rejuvenation": Droplets,
  "skin-health-consultation": ClipboardList,
  "hair-scalp-treatments": Scissors,
  botox: Syringe,
  "dermal-fillers": Gem,
  "skin-boosters": Waves,
  "facial-rejuvenation": Wand2,
  "non-invasive-skin-treatments": ShieldCheck,
};

export function getServiceIcon(slug: string): LucideIcon {
  return serviceIcons[slug] ?? Sparkles;
}
