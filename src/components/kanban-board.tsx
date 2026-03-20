"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { EventSummary } from "@/lib/notion";
import { NotionBadge } from "@/components/notion-badge";
import { salonStyles, kanbanPhaseColors } from "@/lib/notion-colors";

const phases = [
  "Cerere nouă",
  "Ofertă trimisă",
  "Contract semnat",
  "În planificare",
  "Pre-eveniment",
];

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
}

export function KanbanBoard({ events }: { events: EventSummary[] }) {
  const columns = useMemo(() => {
    const cols: Record<string, EventSummary[]> = {};
    for (const phase of phases) {
      cols[phase] = [];
    }
    for (const event of events) {
      const phase = event.phase || "Cerere nouă";
      if (cols[phase]) {
        cols[phase].push(event);
      }
    }
    for (const phase of phases) {
      cols[phase].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
      });
    }
    return cols;
  }, [events]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {phases.map((phase) => (
        <div
          key={phase}
          className="flex-shrink-0 w-64 bg-muted/30 rounded border border-border"
          style={{ borderTopWidth: 2, borderTopColor: kanbanPhaseColors[phase] }}
        >
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {phase}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums bg-muted px-1.5 py-0.5 rounded">
              {columns[phase].length}
            </span>
          </div>
          <div className="px-2 pb-2 space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto">
            {columns[phase].map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="block p-2.5 rounded border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <p className="text-sm truncate">{event.name || "—"}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                  </span>
                  <div className="flex items-center gap-1">
                    {event.salon && (
                      <NotionBadge style={salonStyles[event.salon]}>
                        {event.salon}
                      </NotionBadge>
                    )}
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {event.estPersons ?? "?"}p
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {columns[phase].length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Gol</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
