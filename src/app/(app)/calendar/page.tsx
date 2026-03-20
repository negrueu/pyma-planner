import { getEventsByDateRange } from "@/lib/notion";
import { CalendarView } from "@/components/calendar-view";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  // Fetch 2 years of data — events are planned far in advance
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString().split("T")[0];
  const end = new Date(today.getFullYear() + 1, today.getMonth() + 6, 0).toISOString().split("T")[0];

  const events = await getEventsByDateRange(start, end);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <h1 className="text-[24px] font-bold">Calendar</h1>
      <CalendarView events={events} />
    </div>
  );
}
