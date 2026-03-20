import { searchEvents, type EventSummary } from "@/lib/notion";
import { KanbanBoard } from "@/components/kanban-board";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  // Get all non-finalized events
  const events = await searchEvents("", 200);

  // Filter out finalized/cancelled and past events
  const today = new Date().toISOString().split("T")[0];
  const active = events.filter((e: EventSummary) => {
    if (e.phase === "Finalizat" || e.phase === "Anulat") return false;
    if (!e.date) return true; // No date = still active
    return e.date >= today;
  });

  return (
    <div className="p-6 max-w-full mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Pipeline</h1>
      <KanbanBoard events={active} />
    </div>
  );
}
