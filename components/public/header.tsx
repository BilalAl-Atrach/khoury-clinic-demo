"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/reviews", label: t.nav.reviews },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="container-premium flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--navy)] font-serif-display text-sm">
            NK
          </span>
          <span className="hidden font-serif-display text-base leading-tight sm:block">
            Khoury
            <span className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Dermatology &amp; Aesthetic
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[var(--navy)]",
              pathname === "/" ? "text-[var(--navy)]" : "text-[var(--muted-foreground)]"
            )}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[var(--navy)]",
              pathname === "/about" ? "text-[var(--navy)]" : "text-[var(--muted-foreground)]"
            )}
          >
            {t.nav.about}
          </Link>
          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--navy)]",
                pathname.startsWith("/services") ? "text-[var(--navy)]" : "text-[var(--muted-foreground)]"
              )}
            >
              {t.nav.services}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute start-0 top-full w-56 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg"
                >
                  <Link href="/services" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                    {t.services.title}
                  </Link>
                  <Link href="/services/dermatology" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                    {t.nav.dermatology}
                  </Link>
                  <Link
                    href="/services/aesthetic-medicine"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]"
                  >
                    {t.nav.aestheticMedicine}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {links.slice(2).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--navy)]",
                pathname === l.href ? "text-[var(--navy)]" : "text-[var(--muted-foreground)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link href="/book">{t.nav.bookNow}</Link>
          </Button>
          <button
            className="rounded-full p-2 hover:bg-[var(--muted)] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--border)] lg:hidden"
          >
            <div className="container-premium flex flex-col gap-1 py-4">
              {[
                ...links.slice(0, 2),
                { href: "/services", label: t.nav.services },
                { href: "/services/dermatology", label: `— ${t.nav.dermatology}` },
                { href: "/services/aesthetic-medicine", label: `— ${t.nav.aestheticMedicine}` },
                ...links.slice(2),
              ].map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--muted)]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between px-3">
                <LanguageSwitcher variant="outline" />
                <Button asChild variant="gold" size="sm">
                  <Link href="/book">{t.nav.bookNow}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
