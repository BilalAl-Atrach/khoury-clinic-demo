import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { StickyBookButton } from "@/components/public/sticky-book-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <PublicFooter />
      <StickyBookButton />
    </div>
  );
}
