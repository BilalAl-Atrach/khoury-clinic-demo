"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { usePageTitle } from "@/lib/use-page-title";
import { useDemoStore } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/public/language-switcher";

export default function LoginPage() {
  const { t } = useLanguage();
  usePageTitle(t.login.title);
  const router = useRouter();
  const login = useDemoStore((s) => s.login);

  const [email, setEmail] = useState("demo@khouryclinic.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      router.push("/dashboard");
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--secondary)]/40">
      <header className="container-premium flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.dashboard.backToWebsite}
        </Link>
        <LanguageSwitcher />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)] font-serif-display text-sm text-[var(--navy)]">
            NK
          </div>
          <h1 className="mt-5 font-serif-display text-2xl font-medium">{t.login.title}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t.login.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">{t.login.email}</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ps-9" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">{t.login.password}</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ps-9" />
              </div>
            </div>
            {error && <p className="text-sm text-[var(--destructive)]">{t.login.error}</p>}
            <Button type="submit" variant="gold" className="w-full">
              {t.login.signIn}
            </Button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
            {t.login.demoNote}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
