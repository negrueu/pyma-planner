import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:pl-60 pb-14 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
