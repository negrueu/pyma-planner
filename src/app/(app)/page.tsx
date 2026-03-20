import Link from "next/link";
import { getUpcomingEvents, getEventStats, type EventSummary } from "@/lib/notion";
import { SearchBar } from "@/components/search-bar";
import { NotionBadge } from "@/components/notion-badge";
import { eventTypeStyles, salonStyles } from "@/lib/notion-colors";

export const dynamic = "force-dynamic";

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const [upcoming, stats] = await Promise.all([
    getUpcomingEvents(10),
    getEventStats(),
  ]);

  return (
    <div className="max-w-[900px] mx-auto px-[96px] py-8">
      <h1 className="text-[40px] font-bold mb-1">Dashboard</h1>
      <p className="text-[14px] text-muted-foreground mb-6">Planner Casablanca</p>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex gap-4 mb-8">
        <div>
          <span className="text-[28px] font-bold tabular-nums">{stats.total}</span>
          <span className="text-[13px] text-muted-foreground ml-2">evenimente luna asta</span>
        </div>
        <div className="text-border">|</div>
        <div>
          <span className="text-[28px] font-bold tabular-nums">{stats.totalPersons}</span>
          <span className="text-[13px] text-muted-foreground ml-2">persoane</span>
        </div>
        {Object.entries(stats.byType)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([type, count]) => (
            <div key={type} className="hidden sm:block">
              <div className="text-border">|</div>
            </div>
          ))}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Următoarele evenimente</h2>
        <Link
          href="/event/new"
          className="text-[13px] text-primary hover:underline"
        >
          + Eveniment nou
        </Link>
      </div>

      <div className="border-t border-border">
        {upcoming.map((event: EventSummary) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="flex items-center justify-between px-0 py-[5px] border-b border-border hover:bg-accent transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[14px] truncate group-hover:underline">
                {event.name || "—"}
              </span>
              {event.eventType && (
                <NotionBadge style={eventTypeStyles[event.eventType]}>
                  {event.eventType}
                </NotionBadge>
              )}
              {event.salon && (
                <NotionBadge style={salonStyles[event.salon]}>
                  {event.salon}
                </NotionBadge>
              )}
            </div>
            <div className="flex items-center gap-4 text-[13px] text-muted-foreground shrink-0 ml-3">
              <span className="tabular-nums">{event.estPersons ?? ""}</span>
              <span className="w-[85px] text-right">{formatDate(event.date)}</span>
            </div>
          </Link>
        ))}
        {upcoming.length === 0 && (
          <p className="text-muted-foreground text-[13px] text-center py-6">
            Niciun eveniment viitor.
          </p>
        )}
      </div>
    </div>
  );
}
