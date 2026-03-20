"use client";

import { Calendar, dateFnsLocalizer, type Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ro } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { EventSummary } from "@/lib/notion";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "ro": ro };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const eventTypeColors: Record<string, string> = {
  NUNTA: "#3b82f6",
  Botez: "#ec4899",
  Aniversare: "#22c55e",
  Corporate: "#71717a",
  Cumătrie: "#f97316",
  Majorat: "#a855f7",
  Banchet: "#eab308",
  Prânz: "#14b8a6",
};

type CalendarEvent = Event & { id: string; salon: string | null; eventType: string | null; persons: number | null };

export function CalendarView({ events }: { events: EventSummary[] }) {
  const router = useRouter();
  const [salonFilter, setSalonFilter] = useState<string>("all");

  const calendarEvents = useMemo(() => {
    return events
      .filter((e) => e.date && (salonFilter === "all" || e.salon === salonFilter))
      .map((e): CalendarEvent => ({
        id: e.id,
        title: `${e.name} (${e.estPersons || "?"})`,
        start: new Date(e.date!),
        end: new Date(e.date!),
        allDay: true,
        salon: e.salon,
        eventType: e.eventType,
        persons: e.estPersons,
      }));
  }, [events, salonFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Salon:</span>
        {["all", "BallRoom", "Imperial", "Glamour"].map((s) => (
          <button
            key={s}
            onClick={() => setSalonFilter(s)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              salonFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {s === "all" ? "Toate" : s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(eventTypeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{type}</span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-md p-2 calendar-notion" style={{ height: 650 }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "agenda"]}
          defaultView="month"
          culture="ro"
          messages={{
            today: "Azi",
            previous: "←",
            next: "→",
            month: "Lună",
            week: "Săptămână",
            agenda: "Agendă",
            noEventsInRange: "Niciun eveniment.",
          }}
          onSelectEvent={(event) => {
            router.push(`/event/${(event as CalendarEvent).id}`);
          }}
          eventPropGetter={(event) => {
            const ce = event as CalendarEvent;
            const color = eventTypeColors[ce.eventType || ""] || "#71717a";
            return {
              style: {
                backgroundColor: color,
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "11px",
                padding: "1px 4px",
              },
            };
          }}
        />
      </div>
    </div>
  );
}
