"use client";

import Link from "next/link";
import type { EventSummary } from "@/lib/notion";
import { Badge } from "@/components/ui/badge";

const eventColors: Record<string, string> = {
  NUNTA: "bg-blue-500/20 text-blue-400",
  Botez: "bg-pink-500/20 text-pink-400",
  Aniversare: "bg-green-500/20 text-green-400",
  Corporate: "bg-zinc-500/20 text-zinc-400",
  Cumătrie: "bg-orange-500/20 text-orange-400",
  Majorat: "bg-purple-500/20 text-purple-400",
  Banchet: "bg-yellow-500/20 text-yellow-400",
  Prânz: "bg-teal-500/20 text-teal-400",
};

const salonColors: Record<string, string> = {
  BallRoom: "bg-amber-500/20 text-amber-400",
  Imperial: "bg-indigo-500/20 text-indigo-400",
  Glamour: "bg-rose-500/20 text-rose-400",
};

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EventTable({ events }: { events: EventSummary[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Niciun eveniment găsit.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nume</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden md:table-cell">Data</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden sm:table-cell">Salon</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Eveniment</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground hidden sm:table-cell">Pers.</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden lg:table-cell">Planner</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
            >
              <td className="py-2 px-3">
                <Link
                  href={`/event/${event.id}`}
                  className="font-medium hover:underline"
                >
                  {event.name || "—"}
                </Link>
                {event.phone && (
                  <span className="text-xs text-muted-foreground ml-2 hidden xl:inline">
                    {event.phone}
                  </span>
                )}
              </td>
              <td className="py-2 px-3 text-muted-foreground hidden md:table-cell">
                {formatDate(event.date)}
              </td>
              <td className="py-2 px-3 hidden sm:table-cell">
                {event.salon && (
                  <Badge variant="secondary" className={salonColors[event.salon] || ""}>
                    {event.salon}
                  </Badge>
                )}
              </td>
              <td className="py-2 px-3">
                {event.eventType && (
                  <Badge variant="secondary" className={eventColors[event.eventType] || ""}>
                    {event.eventType}
                  </Badge>
                )}
              </td>
              <td className="py-2 px-3 text-right text-muted-foreground hidden sm:table-cell">
                {event.estPersons ?? "—"}
              </td>
              <td className="py-2 px-3 text-muted-foreground text-xs hidden lg:table-cell">
                {event.planner || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
