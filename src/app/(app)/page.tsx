import Link from "next/link";
import { getUpcomingEvents, getEventStats, type EventSummary } from "@/lib/notion";
import { SearchBar } from "@/components/search-bar";
import { NotionBadge } from "@/components/notion-badge";
import { eventTypeStyles } from "@/lib/notion-colors";

export const dynamic = "force-dynamic";

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
          className="text-sm px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
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
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Următoarele evenimente
        </h2>
        <div className="space-y-px border border-border rounded overflow-hidden">
          {upcoming.map((event: EventSummary) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="flex items-center justify-between px-3 py-2.5 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm truncate group-hover:underline">
                  {event.name || "—"}
                </span>
                {event.eventType && (
                  <NotionBadge style={eventTypeStyles[event.eventType]}>
                    {event.eventType}
                  </NotionBadge>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0 ml-4">
                <span className="hidden sm:inline">{event.salon}</span>
                <span className="tabular-nums">{event.estPersons ?? "—"} pers</span>
                <span className="w-20 text-right">{formatDate(event.date)}</span>
              </div>
            </Link>
          ))}
          {upcoming.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
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
    <div className="p-3 rounded border border-border">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
