import type { Metadata } from "next";
import { Fraunces, Inter, Tajawal } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Khoury Dermatology & Aesthetic Clinic | Beirut, Lebanon",
  description:
    "Dr. Nadine Khoury — Dermatologist & Aesthetic Medicine Specialist in Beirut. Book appointments online with automatic WhatsApp confirmations and reminders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${tajawal.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
