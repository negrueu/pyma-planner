"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { EventSummary } from "@/lib/notion";

const phases = [
  "Cerere nouă",
  "Ofertă trimisă",
  "Contract semnat",
  "În planificare",
  "Pre-eveniment",
];

const phaseColors: Record<string, string> = {
  "Cerere nouă": "border-t-yellow-500",
  "Ofertă trimisă": "border-t-orange-500",
  "Contract semnat": "border-t-blue-500",
  "În planificare": "border-t-purple-500",
  "Pre-eveniment": "border-t-green-500",
};

const salonColors: Record<string, string> = {
  BallRoom: "bg-amber-500/20 text-amber-400",
  Imperial: "bg-indigo-500/20 text-indigo-400",
  Glamour: "bg-rose-500/20 text-rose-400",
};

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
    // Sort each column by date
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
    <div className="flex gap-4 overflow-x-auto pb-4">
      {phases.map((phase) => (
        <div
          key={phase}
          className={`flex-shrink-0 w-64 bg-muted/30 rounded-md border border-border border-t-2 ${phaseColors[phase]}`}
        >
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm font-medium">{phase}</span>
            <Badge variant="secondary" className="text-xs">
              {columns[phase].length}
            </Badge>
          </div>
          <div className="px-2 pb-2 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
            {columns[phase].map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="block p-3 rounded-md bg-card border border-border hover:bg-accent/50 transition-colors"
              >
                <p className="text-sm font-medium truncate">{event.name || "—"}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                  </span>
                  <div className="flex items-center gap-1">
                    {event.salon && (
                      <Badge variant="secondary" className={`text-[10px] ${salonColors[event.salon] || ""}`}>
                        {event.salon}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
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
