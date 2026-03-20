import { getEventsByDateRange } from "@/lib/notion";
import { CalendarView } from "@/components/calendar-view";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  // Fetch 3 months of data (current ± 1 month)
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split("T")[0];
  const end = new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString().split("T")[0];

  const events = await getEventsByDateRange(start, end);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Calendar</h1>
      <CalendarView events={events} />
    </div>
  );
}
