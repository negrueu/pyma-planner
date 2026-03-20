"use client";

import Link from "next/link";
import type { EventSummary } from "@/lib/notion";
import { NotionBadge } from "@/components/notion-badge";
import { eventTypeStyles, salonStyles } from "@/lib/notion-colors";

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EventTable({ events }: { events: EventSummary[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-[13px]">
        Niciun eveniment găsit.
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-1 px-2 font-normal text-muted-foreground text-[12px]">Nume</th>
            <th className="text-left py-1 px-2 font-normal text-muted-foreground text-[12px] hidden md:table-cell">Data</th>
            <th className="text-left py-1 px-2 font-normal text-muted-foreground text-[12px] hidden sm:table-cell">Salon</th>
            <th className="text-left py-1 px-2 font-normal text-muted-foreground text-[12px]">Eveniment</th>
            <th className="text-right py-1 px-2 font-normal text-muted-foreground text-[12px] hidden sm:table-cell">Pers.</th>
            <th className="text-left py-1 px-2 font-normal text-muted-foreground text-[12px] hidden lg:table-cell">Planner</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b border-border last:border-0 hover:bg-accent transition-colors"
            >
              <td className="py-[5px] px-2 text-[14px]">
                <Link href={`/event/${event.id}`} className="hover:underline">
                  {event.name || "—"}
                </Link>
              </td>
              <td className="py-[5px] px-2 text-[14px] text-muted-foreground hidden md:table-cell">
                {formatDate(event.date)}
              </td>
              <td className="py-[5px] px-2 hidden sm:table-cell">
                {event.salon && <NotionBadge style={salonStyles[event.salon]}>{event.salon}</NotionBadge>}
              </td>
              <td className="py-[5px] px-2">
                {event.eventType && <NotionBadge style={eventTypeStyles[event.eventType]}>{event.eventType}</NotionBadge>}
              </td>
              <td className="py-[5px] px-2 text-right text-[14px] text-muted-foreground tabular-nums hidden sm:table-cell">
                {event.estPersons ?? ""}
              </td>
              <td className="py-[5px] px-2 text-[13px] text-muted-foreground hidden lg:table-cell">
                {event.planner || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
