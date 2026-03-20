import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav />
    </>
  );
}
