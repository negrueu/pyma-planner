"use client";

import Link from "next/link";
import type { EventSummary } from "@/lib/notion";
import { NotionBadge } from "@/components/notion-badge";
import { eventTypeStyles, salonStyles } from "@/lib/notion-colors";

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
      <div className="text-center py-12 text-muted-foreground text-sm">
        Niciun eveniment găsit.
      </div>
    );
  }

  return (
    <div className="border border-border rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs">Nume</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs hidden md:table-cell">Data</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Salon</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs">Eveniment</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Pers.</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">Planner</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
            >
              <td className="py-1.5 px-3">
                <Link
                  href={`/event/${event.id}`}
                  className="hover:underline"
                >
                  {event.name || "—"}
                </Link>
              </td>
              <td className="py-1.5 px-3 text-muted-foreground hidden md:table-cell">
                {formatDate(event.date)}
              </td>
              <td className="py-1.5 px-3 hidden sm:table-cell">
                {event.salon && (
                  <NotionBadge style={salonStyles[event.salon]}>
                    {event.salon}
                  </NotionBadge>
                )}
              </td>
              <td className="py-1.5 px-3">
                {event.eventType && (
                  <NotionBadge style={eventTypeStyles[event.eventType]}>
                    {event.eventType}
                  </NotionBadge>
                )}
              </td>
              <td className="py-1.5 px-3 text-right text-muted-foreground tabular-nums hidden sm:table-cell">
                {event.estPersons ?? "—"}
              </td>
              <td className="py-1.5 px-3 text-muted-foreground text-xs hidden lg:table-cell">
                {event.planner || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
