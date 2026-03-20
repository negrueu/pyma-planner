import Link from "next/link";
import { getUpcomingEvents, getEventStats, type EventSummary } from "@/lib/notion";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const eventColors: Record<string, string> = {
  NUNTA: "bg-blue-500/20 text-blue-400",
  Botez: "bg-pink-500/20 text-pink-400",
  Aniversare: "bg-green-500/20 text-green-400",
  Corporate: "bg-zinc-500/20 text-zinc-400",
  Cumătrie: "bg-orange-500/20 text-orange-400",
};

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ro-RO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default async function DashboardPage() {
  const [upcoming, stats] = await Promise.all([
    getUpcomingEvents(8),
    getEventStats(),
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Link
          href="/event/new"
          className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + Eveniment nou
        </Link>
      </div>

      <SearchBar />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Evenimente luna asta" value={stats.total} />
        <StatCard label="Total persoane" value={stats.totalPersons} />
        {Object.entries(stats.byType)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 2)
          .map(([type, count]) => (
            <StatCard key={type} label={type} value={count as number} />
          ))}
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Următoarele evenimente
        </h2>
        <div className="space-y-1">
          {upcoming.map((event: EventSummary) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="flex items-center justify-between p-3 rounded-md hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-medium truncate group-hover:underline">
                  {event.name || "—"}
                </span>
                {event.eventType && (
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shrink-0 ${eventColors[event.eventType] || ""}`}
                  >
                    {event.eventType}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0 ml-4">
                <span className="hidden sm:inline">{event.salon}</span>
                <span>{event.estPersons ?? "—"} pers</span>
                <span className="w-20 text-right">{formatDate(event.date)}</span>
              </div>
            </Link>
          ))}
          {upcoming.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Niciun eveniment viitor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-md bg-card border border-border">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
